-- Rosedle family board and sync codes.
--
-- Run this once in the Supabase SQL editor (SQL Editor, New query, paste,
-- Run). Running it again is safe: it only creates what is missing and
-- replaces the functions.
--
-- One table holds each player's name, stats and today's board. The page
-- never touches the table directly. It can only call the four functions
-- below, so a player's code is the only way to change their row, and the
-- family board never shows codes or guesses.

create table if not exists public.rosedle_players (
	code text primary key,
	name text not null check (char_length(name) between 1 and 24),
	stats jsonb not null default '{}'::jsonb,
	game jsonb not null default '{}'::jsonb,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

alter table public.rosedle_players enable row level security;
revoke all on public.rosedle_players from public;
do $$ begin
	if exists (select 1 from pg_roles where rolname = 'anon') then
		execute 'revoke all on public.rosedle_players from anon';
	end if;
	if exists (select 1 from pg_roles where rolname = 'authenticated') then
		execute 'revoke all on public.rosedle_players from authenticated';
	end if;
end $$;

-- A whole number from a stats field, or 0 if it is missing or not a number.
create or replace function public.rosedle_int(j jsonb, k text)
returns int language sql immutable set search_path = public as $$
	select case when (j ->> k) ~ '^[0-9]{1,6}$' then (j ->> k)::int else 0 end;
$$;

-- Join: makes a player with a new six-character code like K7Q-M2X and
-- returns the code. Letters and digits that look alike (0 and O, 1 and I)
-- are left out.
create or replace function public.rosedle_join(p_name text)
returns text language plpgsql security definer set search_path = public as $$
declare
	alphabet constant text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
	clean text := btrim(regexp_replace(coalesce(p_name, ''), '\s+', ' ', 'g'));
	bytes bytea;
	new_code text;
begin
	if char_length(clean) < 1 or char_length(clean) > 24 then
		raise exception 'Name must be 1 to 24 characters';
	end if;
	loop
		bytes := decode(replace(gen_random_uuid()::text, '-', ''), 'hex');
		new_code := '';
		for i in 0..5 loop
			new_code := new_code || substr(alphabet, 1 + get_byte(bytes, i) % length(alphabet), 1);
		end loop;
		new_code := substr(new_code, 1, 3) || '-' || substr(new_code, 4, 3);
		begin
			insert into rosedle_players (code, name) values (new_code, clean);
			return new_code;
		exception when unique_violation then
			-- That code is taken. Go round again for a new one.
		end;
	end loop;
end $$;

-- Get: a player's name, stats and board, by their code. Null if no match.
create or replace function public.rosedle_get(p_code text)
returns jsonb language sql stable security definer set search_path = public as $$
	select jsonb_build_object('name', name, 'stats', stats, 'game', game)
	from rosedle_players
	where code = upper(btrim(coalesce(p_code, '')));
$$;

-- Save: updates a player's stats and board, by their code. True if it matched.
create or replace function public.rosedle_save(p_code text, p_stats jsonb, p_game jsonb)
returns boolean language plpgsql security definer set search_path = public as $$
begin
	if pg_column_size(p_stats) > 2000 or pg_column_size(p_game) > 2000 then
		raise exception 'Too much data';
	end if;
	if jsonb_typeof(p_stats) is distinct from 'object' or jsonb_typeof(p_game) is distinct from 'object' then
		raise exception 'Stats and game must be objects';
	end if;
	update rosedle_players
	set stats = p_stats, game = p_game, updated_at = now()
	where code = upper(btrim(coalesce(p_code, '')));
	return found;
end $$;

-- Board: everyone's numbers and today's result, with no codes and no guesses.
create or replace function public.rosedle_board()
returns table (
	name text, played int, wins int, streak int, max_streak int, last_win int, last_played int,
	game_day int, game_status text, game_guesses int
)
language sql stable security definer set search_path = public as $$
	select
		p.name,
		rosedle_int(p.stats, 'played'),
		rosedle_int(p.stats, 'wins'),
		rosedle_int(p.stats, 'streak'),
		rosedle_int(p.stats, 'maxStreak'),
		rosedle_int(p.stats, 'lastWin'),
		rosedle_int(p.stats, 'lastPlayed'),
		rosedle_int(p.game, 'day'),
		case when p.game ->> 'status' in ('playing', 'won', 'lost') then p.game ->> 'status' else '' end,
		case when jsonb_typeof(p.game -> 'guesses') = 'array' then least(jsonb_array_length(p.game -> 'guesses'), 6) else 0 end
	from rosedle_players p
	order by p.updated_at desc
	limit 200;
$$;

revoke execute on function public.rosedle_join(text), public.rosedle_get(text), public.rosedle_save(text, jsonb, jsonb), public.rosedle_board() from public;
do $$ begin
	if exists (select 1 from pg_roles where rolname = 'anon') then
		execute 'grant execute on function public.rosedle_join(text), public.rosedle_get(text), public.rosedle_save(text, jsonb, jsonb), public.rosedle_board() to anon';
	end if;
	if exists (select 1 from pg_roles where rolname = 'authenticated') then
		execute 'grant execute on function public.rosedle_join(text), public.rosedle_get(text), public.rosedle_save(text, jsonb, jsonb), public.rosedle_board() to authenticated';
	end if;
end $$;
