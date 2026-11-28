// Rosedle's family board and sync codes: small calls to the Supabase project
// named in consts.ts, through the functions in scripts/rosedle-supabase.sql.
// Any call can fail (no signal, the project asleep), and the game carries on
// without it.
import { ROSEDLE_SYNC_KEY, ROSEDLE_SYNC_URL } from '../consts';

// A test build can point at a stand-in database through these two variables.
const SYNC_URL = (import.meta.env.PUBLIC_ROSEDLE_SYNC_URL as string | undefined) || ROSEDLE_SYNC_URL;
const SYNC_KEY = (import.meta.env.PUBLIC_ROSEDLE_SYNC_KEY as string | undefined) || ROSEDLE_SYNC_KEY;

export const syncOn = Boolean(SYNC_URL && SYNC_KEY);

export interface Remote {
	name: string;
	stats: Record<string, unknown>;
	game: Record<string, unknown>;
}

export interface BoardRow {
	name: string;
	played: number;
	wins: number;
	streak: number;
	max_streak: number;
	last_win: number;
	last_played: number;
	game_day: number;
	game_status: string;
	game_guesses: number;
}

async function rpc<T>(fn: string, args: object): Promise<T> {
	const headers: Record<string, string> = { 'Content-Type': 'application/json', apikey: SYNC_KEY };
	// Older Supabase keys are tokens that also go in the Authorization header.
	if (SYNC_KEY.startsWith('eyJ')) headers.Authorization = `Bearer ${SYNC_KEY}`;
	const stop = new AbortController();
	const timer = setTimeout(() => stop.abort(), 8000);
	try {
		const res = await fetch(`${SYNC_URL.replace(/\/+$/, '')}/rest/v1/rpc/${fn}`, {
			method: 'POST',
			headers,
			body: JSON.stringify(args),
			signal: stop.signal,
		});
		if (!res.ok) throw new Error(`${fn} failed with ${res.status}`);
		return (await res.json()) as T;
	} finally {
		clearTimeout(timer);
	}
}

export const sync = {
	join: (name: string) => rpc<string>('rosedle_join', { p_name: name }),
	get: (code: string) => rpc<Remote | null>('rosedle_get', { p_code: code }),
	save: (code: string, stats: object, game: object) => rpc<boolean>('rosedle_save', { p_code: code, p_stats: stats, p_game: game }),
	board: () => rpc<BoardRow[]>('rosedle_board', {}),
};

// Tidies a typed code: capitals, no spaces, and the dash in the middle.
export function cleanCode(raw: string) {
	const s = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
	return s.length === 6 ? `${s.slice(0, 3)}-${s.slice(3)}` : s;
}
