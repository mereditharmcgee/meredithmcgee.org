// Rosedle, the game on /rosedle. One puzzle a day, counted from LAUNCH_DATE
// in the player's own time zone, with each day's answer from answerFor().
// Today's board and the player's stats are kept in their browser, and the
// game still works if that storage is off. Players who join the family board
// also keep a copy online (rosedle-sync.ts), so one code carries their streak
// to every device they play on.
import wordList from '../data/rosedle-words.txt?raw';
import { ANSWER, LAUNCH_DATE, ROSEDLE, type Mark } from '../data/rosedle';
import { DAILY_ANSWERS } from '../data/rosedle-answers';
import { onPage, reducedMotion } from './page';
import { cleanCode, sync, syncOn, type BoardRow, type Remote } from './rosedle-sync';

const LENGTH = 5;
const TRIES = 6;
const FLIP_STEP = 280; // ms between tiles turning over
const FLIP_TIME = 480; // ms for one tile to turn over
const WORDS = new Set(wordList.split(/\s+/).filter(Boolean));

// The answers are stored in ROT13 so the page source doesn't spoil them.
const rot13 = (w: string) => w.replace(/[a-z]/g, (c) => String.fromCharCode(((c.charCodeAt(0) - 84) % 26) + 97));
const ANSWERS = DAILY_ANSWERS.map(rot13);

// Every answer counts as a real word, even names like PHILS that aren't in the guess list.
WORDS.add(ANSWER);
ANSWERS.forEach((w) => WORDS.add(w));

// Each day takes the next word from the list, starting at No. 1. After the
// list runs out, it's the home word.
export function answerFor(day: number) {
	return ANSWERS[day - 1] ?? ANSWER;
}

// The "-2" keys started with the daily answers, so boards and stats from
// the AROSE-only tryout don't carry over.
const GAME_KEY = 'rosedle-game-2';
const STATS_KEY = 'rosedle-stats-2';
// This device's place on the family board: the player's code and name.
const SYNC_KEY = 'rosedle-sync-2';

type Status = 'playing' | 'won' | 'lost';
interface Game { day: number; guesses: string[]; status: Status }
interface Stats { played: number; wins: number; streak: number; maxStreak: number; dist: number[]; lastWin: number; lastPlayed: number }
interface Me { code: string; name: string }

// Marks each letter of a guess. Letters that are in the right spot claim
// their match first, so a repeated letter only lights up as many times as
// it appears in the answer.
export function score(guess: string, answer: string): Mark[] {
	const marks: Mark[] = Array(LENGTH).fill('absent');
	const left: Record<string, number> = {};
	for (let i = 0; i < LENGTH; i++) {
		if (guess[i] === answer[i]) marks[i] = 'correct';
		else left[answer[i]] = (left[answer[i]] || 0) + 1;
	}
	for (let i = 0; i < LENGTH; i++) {
		if (marks[i] !== 'correct' && left[guess[i]]) {
			marks[i] = 'present';
			left[guess[i]]--;
		}
	}
	return marks;
}

// Puzzle number for a date, in local time. Day one is LAUNCH_DATE.
export function dayNumber(date = new Date()) {
	const [y, m, d] = LAUNCH_DATE.split('-').map(Number);
	const launch = Date.UTC(y, m - 1, d);
	const today = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
	return Math.max(1, Math.floor((today - launch) / 86400000) + 1);
}

function read<T>(key: string): T | null {
	try {
		const raw = localStorage.getItem(key);
		return raw ? (JSON.parse(raw) as T) : null;
	} catch {
		return null;
	}
}

function write(key: string, value: unknown) {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {
		// Storage is off or full. The game carries on; it just won't remember.
	}
}

// A saved board for the given day, checked and tidied, or null if it isn't one.
function checkGame(saved: unknown, day: number): Game | null {
	const g = saved as Partial<Game> | null;
	if (!g || g.day !== day || !Array.isArray(g.guesses) || g.guesses.length > TRIES) return null;
	if (!g.guesses.every((x) => typeof x === 'string' && /^[a-z]{5}$/.test(x))) return null;
	const answer = answerFor(day);
	const won = g.guesses.includes(answer);
	const status: Status = won ? 'won' : g.guesses.length === TRIES ? 'lost' : 'playing';
	return { day, guesses: g.guesses.slice(0, won ? g.guesses.indexOf(answer) + 1 : TRIES), status };
}

function loadGame(day: number): Game {
	return checkGame(read(GAME_KEY), day) ?? { day, guesses: [], status: 'playing' };
}

// Stats, checked and tidied, from this device or from the family board.
function checkStats(saved: unknown): Stats {
	const s: Stats = { played: 0, wins: 0, streak: 0, maxStreak: 0, dist: [0, 0, 0, 0, 0, 0], lastWin: 0, lastPlayed: 0 };
	if (!saved || typeof saved !== 'object') return s;
	const raw = saved as Record<string, unknown>;
	for (const k of ['played', 'wins', 'streak', 'maxStreak', 'lastWin', 'lastPlayed'] as const) {
		const v = raw[k];
		if (typeof v === 'number' && Number.isInteger(v) && v >= 0) s[k] = v;
	}
	if (Array.isArray(raw.dist) && raw.dist.length === TRIES && raw.dist.every((v) => Number.isInteger(v) && v >= 0)) s.dist = [...(raw.dist as number[])];
	return s;
}

function loadStats(): Stats {
	return checkStats(read(STATS_KEY));
}

// Of two sets of stats for one player, the one with the most recent game,
// or the most games if they last played the same day.
function pickStats(mine: Stats, theirs: Stats) {
	if (theirs.lastPlayed !== mine.lastPlayed) return theirs.lastPlayed > mine.lastPlayed ? theirs : mine;
	return theirs.played > mine.played ? theirs : mine;
}

// Whether board a is further along than board b: finished beats unfinished,
// then more guesses wins.
function ahead(a: Game, b: Game) {
	const done = (g: Game) => g.status !== 'playing';
	if (done(a) !== done(b)) return done(a);
	return a.guesses.length > b.guesses.length;
}

const RANK: Record<Mark, number> = { absent: 0, present: 1, correct: 2 };
const SPOKEN: Record<Mark, string> = { correct: 'correct', present: 'in the word, wrong spot', absent: 'not in the word' };

function clock(ms: number) {
	const t = Math.max(0, Math.floor(ms / 1000));
	const pad = (n: number) => String(n).padStart(2, '0');
	return `${pad(Math.floor(t / 3600))}:${pad(Math.floor((t % 3600) / 60))}:${pad(t % 60)}`;
}

onPage((signal) => {
	const root = document.querySelector<HTMLElement>('[data-rosedle]');
	if (!root) return;

	const R = ROSEDLE;
	const board = root.querySelector<HTMLElement>('[data-board]')!;
	const rows = [...board.querySelectorAll<HTMLElement>('.rd-row')];
	const keys = new Map([...root.querySelectorAll<HTMLButtonElement>('[data-key]')].map((b) => [b.dataset.key!, b]));
	const toastEl = root.querySelector<HTMLElement>('[data-toast]')!;
	const announceEl = root.querySelector<HTMLElement>('[data-announce]')!;
	const numEl = root.querySelector<HTMLElement>('[data-num]')!;
	const help = document.getElementById('rd-help') as HTMLDialogElement;
	const statsBox = document.getElementById('rd-stats') as HTMLDialogElement;
	const shareMsg = statsBox.querySelector<HTMLElement>('[data-share-msg]')!;
	const shareBox = statsBox.querySelector<HTMLTextAreaElement>('[data-share-text]')!;
	// The Family board tab, when the site has a Supabase project set up.
	const familyEl = syncOn ? statsBox.querySelector<HTMLElement>('[data-family]') : null;
	const panelYou = statsBox.querySelector<HTMLElement>('#rd-panel-you')!;
	const tabs = [...statsBox.querySelectorAll<HTMLButtonElement>('[data-tab]')];
	let me: Me | null = familyEl ? read<Me>(SYNC_KEY) : null;
	if (me && (typeof me.code !== 'string' || typeof me.name !== 'string')) me = null;
	let pushTimer = 0;

	// Set by startDay() before anything reads it.
	let game!: Game;
	let current = '';
	let busy = false;
	let toastTimer = 0;
	let clockTimer = 0;
	let dayTimer = 0;
	const timers: number[] = [];
	const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));
	signal.addEventListener('abort', () => {
		timers.forEach(clearTimeout);
		clearTimeout(toastTimer);
		clearInterval(clockTimer);
		clearInterval(dayTimer);
		clearTimeout(pushTimer);
	});

	function toast(text: string, ms = 1600) {
		toastEl.textContent = text;
		toastEl.classList.add('on');
		clearTimeout(toastTimer);
		if (ms > 0) toastTimer = window.setTimeout(() => toastEl.classList.remove('on'), ms);
	}

	// Marks a guess against today's answer.
	const mark = (g: string) => score(g, answerFor(game.day));

	function tilesOf(r: number) {
		return [...rows[r].querySelectorAll<HTMLElement>('.rd-tile')];
	}

	function paintTile(tile: HTMLElement, letter: string, mark?: Mark) {
		tile.textContent = letter;
		tile.toggleAttribute('data-filled', Boolean(letter));
		if (mark) tile.dataset.state = mark;
		else delete tile.dataset.state;
	}

	// What a screen reader hears for a row: its number, then each letter's result.
	function spoken(guess: string) {
		return mark(guess).map((m, i) => `${guess[i].toUpperCase()} ${SPOKEN[m]}`).join(', ');
	}

	function labelRow(r: number) {
		const guess = game.guesses[r];
		rows[r].setAttribute('aria-label', guess ? `Guess ${r + 1}: ${spoken(guess)}` : `Guess ${r + 1}`);
	}

	function paintKeys() {
		const best: Record<string, Mark> = {};
		for (const g of game.guesses) {
			mark(g).forEach((m, i) => {
				const l = g[i];
				if (!best[l] || RANK[m] > RANK[best[l]]) best[l] = m;
			});
		}
		keys.forEach((btn, k) => {
			if (k.length !== 1) return;
			const m = best[k];
			if (m) {
				btn.dataset.state = m;
				btn.setAttribute('aria-label', `${k.toUpperCase()}, ${SPOKEN[m]}`);
			} else {
				delete btn.dataset.state;
				btn.removeAttribute('aria-label');
			}
		});
	}

	function paintBoard() {
		for (let r = 0; r < TRIES; r++) {
			const guess = game.guesses[r];
			const marks = guess ? mark(guess) : null;
			const letters = guess ?? (r === game.guesses.length ? current : '');
			tilesOf(r).forEach((t, i) => {
				t.classList.remove('pop', 'flip', 'hop');
				paintTile(t, letters[i] ?? '', marks?.[i]);
			});
			labelRow(r);
		}
		paintKeys();
	}

	function startDay() {
		const day = dayNumber();
		game = loadGame(day);
		current = '';
		busy = false;
		numEl.textContent = `No. ${day}`;
		paintBoard();
		void pull();
	}

	function finish(fresh: boolean) {
		if (fresh) {
			const s = loadStats();
			if (s.lastPlayed !== game.day) {
				s.played++;
				s.lastPlayed = game.day;
				if (game.status === 'won') {
					s.wins++;
					s.dist[game.guesses.length - 1]++;
					s.streak = s.lastWin === game.day - 1 ? s.streak + 1 : 1;
					s.lastWin = game.day;
					s.maxStreak = Math.max(s.maxStreak, s.streak);
				} else {
					s.streak = 0;
				}
				write(STATS_KEY, s);
				push();
			}
		}
		const msg = game.status === 'won' ? R.messages.wins[game.guesses.length - 1] : R.messages.lose.replace('{word}', answerFor(game.day).toUpperCase());
		toast(msg, game.status === 'won' ? 2200 : 5000);
		later(() => openStats(), fresh ? 1900 : 500);
	}

	function shake() {
		const row = rows[game.guesses.length];
		row.classList.remove('shake');
		void row.offsetWidth;
		row.classList.add('shake');
		later(() => row.classList.remove('shake'), 600);
	}

	function type(letter: string) {
		if (busy || game.status !== 'playing' || current.length >= LENGTH) return;
		current += letter;
		const tile = tilesOf(game.guesses.length)[current.length - 1];
		paintTile(tile, letter);
		if (!reducedMotion()) {
			tile.classList.remove('pop');
			void tile.offsetWidth;
			tile.classList.add('pop');
		}
	}

	function erase() {
		if (busy || game.status !== 'playing' || !current) return;
		current = current.slice(0, -1);
		paintTile(tilesOf(game.guesses.length)[current.length], '');
	}

	function submit() {
		if (busy || game.status !== 'playing') return;
		if (current.length < LENGTH) return (toast(R.messages.notEnough), shake());
		if (!WORDS.has(current)) return (toast(R.messages.notAWord), shake());

		const guess = current;
		const r = game.guesses.length;
		const marks = mark(guess);
		game.guesses.push(guess);
		current = '';
		if (guess === answerFor(game.day)) game.status = 'won';
		else if (game.guesses.length === TRIES) game.status = 'lost';
		write(GAME_KEY, game);
		push();

		busy = true;
		const still = reducedMotion();
		const step = still ? 0 : FLIP_STEP;
		const tiles = tilesOf(r);
		tiles.forEach((tile, i) => {
			if (still) return paintTile(tile, guess[i], marks[i]);
			tile.style.setProperty('--delay', `${i * step}ms`);
			tile.classList.add('flip');
			later(() => paintTile(tile, guess[i], marks[i]), i * step + FLIP_TIME / 2);
		});

		const done = still ? 0 : (LENGTH - 1) * step + FLIP_TIME;
		later(() => {
			tiles.forEach((t) => t.classList.remove('flip'));
			paintKeys();
			busy = false;
			labelRow(r);
			announceEl.textContent = `${spoken(guess)}.`;
			if (game.status === 'won' && !still) {
				tiles.forEach((t, i) => {
					t.style.setProperty('--delay', `${i * 90}ms`);
					t.classList.add('hop');
				});
			}
			if (game.status !== 'playing') finish(true);
		}, done);
	}

	function press(key: string) {
		if (rolledOver()) return;
		if (key === 'enter') submit();
		else if (key === 'back') erase();
		else if (/^[a-z]$/.test(key)) type(key);
	}

	function renderStats() {
		const s = loadStats();
		const streak = s.lastWin >= game.day - 1 ? s.streak : 0;
		const set = (k: string, v: number) => (statsBox.querySelector(`[data-stat="${k}"]`)!.textContent = String(v));
		set('played', s.played);
		set('winPct', s.played ? Math.round((s.wins / s.played) * 100) : 0);
		set('streak', streak);
		set('maxStreak', s.maxStreak);

		const top = Math.max(1, ...s.dist);
		statsBox.querySelectorAll<HTMLElement>('[data-dist] li').forEach((li, i) => {
			const bar = li.querySelector<HTMLElement>('.rd-dist-bar')!;
			bar.style.setProperty('--w', String(s.dist[i] / top));
			bar.querySelector('span')!.textContent = String(s.dist[i]);
			li.toggleAttribute('data-today', game.status === 'won' && game.guesses.length === i + 1);
		});

		const doneBox = statsBox.querySelector<HTMLElement>('[data-done]')!;
		doneBox.hidden = game.status === 'playing';
	}

	function tickClock() {
		const now = new Date();
		const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
		statsBox.querySelector('[data-clock]')!.textContent = clock(midnight.getTime() - now.getTime());
		rolledOver();
	}

	function openStats() {
		if (help.open) help.close();
		renderStats();
		tickClock();
		clearInterval(clockTimer);
		clockTimer = window.setInterval(tickClock, 1000);
		if (!statsBox.open) {
			showTab('you');
			statsBox.showModal();
		}
	}

	function openHelp() {
		if (statsBox.open) statsBox.close();
		if (!help.open) help.showModal();
	}

	function newDay() {
		if (statsBox.open) statsBox.close();
		toastEl.classList.remove('on');
		startDay();
	}

	function shareText() {
		const result = game.status === 'won' ? game.guesses.length : 'X';
		const grid = game.guesses.map((g) => mark(g).map((m) => R.share.emoji[m]).join('')).join('\n');
		return `${R.name} No. ${game.day} ${result}/${TRIES}\n\n${grid}\n${R.share.url}`;
	}

	async function share() {
		const text = shareText();
		if (navigator.share && window.matchMedia('(pointer: coarse)').matches) {
			try {
				await navigator.share({ text });
				return;
			} catch (err) {
				if ((err as Error).name === 'AbortError') return;
			}
		}
		let ok = true;
		try {
			await navigator.clipboard.writeText(text);
		} catch {
			ok = false;
		}
		shareMsg.textContent = ok ? R.stats.copied : R.stats.copyFailed;
		if (ok) later(() => (shareMsg.textContent = ''), 2500);
		else {
			// Some browsers block the clipboard. Show the text so it can be copied by hand.
			shareBox.value = text;
			shareBox.hidden = false;
			shareBox.select();
		}
	}

	// On-screen keys. A mouse or finger tap drops focus afterwards, so a
	// later press of the real Enter key submits instead of re-tapping the
	// last letter. Keyboard users who tab onto the keys keep their place.
	root.querySelector('.rd-keys')!.addEventListener(
		'click',
		(e) => {
			const btn = (e.target as Element).closest<HTMLButtonElement>('[data-key]');
			if (!btn) return;
			press(btn.dataset.key!);
			if ((e as MouseEvent).detail > 0) btn.blur();
		},
		{ signal },
	);

	document.addEventListener(
		'keydown',
		(e) => {
			if (e.ctrlKey || e.metaKey || e.altKey || (e.repeat && e.key === 'Enter')) return;
			if (document.querySelector('dialog[open]')) return;
			const target = e.target as HTMLElement;
			if (target.closest('input, textarea, select')) return;
			const key = e.key === 'Backspace' ? 'back' : e.key.toLowerCase();
			const onControl = target.closest('button, a');
			// Typing means playing: move focus off a button so Enter submits.
			if (/^[a-z]$/.test(key) && onControl) board.focus({ preventScroll: true });
			else if (onControl && (key === 'enter' || key === ' ')) return;
			if (key === 'enter' || key === 'back' || /^[a-z]$/.test(key)) {
				e.preventDefault();
				press(key);
			}
		},
		{ signal },
	);

	document.querySelectorAll<HTMLButtonElement>('[data-open]').forEach((btn) =>
		btn.addEventListener('click', () => (btn.dataset.open === 'rd-stats' ? openStats() : openHelp()), { signal }),
	);
	for (const dlg of [help, statsBox]) {
		dlg.querySelector('[data-close]')!.addEventListener('click', () => dlg.close(), { signal });
		// A click on the dimmed backdrop lands on the dialog itself.
		dlg.addEventListener('click', (e) => e.target === dlg && dlg.close(), { signal });
	}
	statsBox.addEventListener('close', () => clearInterval(clockTimer), { signal });
	statsBox.querySelector('[data-share]')!.addEventListener('click', share, { signal });
	// A page left open past midnight moves on to the new puzzle: checked
	// every minute, when the tab comes back into view, and on the next key press.
	function rolledOver() {
		if (busy || dayNumber() === game.day) return false;
		newDay();
		return true;
	}
	dayTimer = window.setInterval(rolledOver, 60000);
	// Coming back to the tab also picks up anything played on another device.
	document.addEventListener('visibilitychange', () => document.visibilityState === 'visible' && !rolledOver() && void pull(), { signal });

	// Family board and sync codes. Everything here is skipped when the site
	// has no Supabase project, and any call that fails leaves the game as is.

	// Sends this device's stats and board up, a moment after the last change.
	function push() {
		if (!me) return;
		const code = me.code;
		clearTimeout(pushTimer);
		pushTimer = window.setTimeout(() => void sync.save(code, loadStats(), game).catch(() => {}), 400);
	}

	// Brings in what this player did on their other devices, and sends up
	// anything this device has that the copy online doesn't.
	async function pull() {
		if (!me) return;
		const mine = me;
		let remote: Remote | null;
		try {
			remote = await sync.get(mine.code);
		} catch {
			return;
		}
		if (signal.aborted || me !== mine) return;
		if (!remote) return forget();
		if (remote.name && remote.name !== mine.name) {
			me = { ...mine, name: remote.name };
			write(SYNC_KEY, me);
		}
		const local = loadStats();
		const theirs = checkStats(remote.stats);
		const stats = pickStats(local, theirs);
		if (stats !== local) write(STATS_KEY, stats);
		const theirGame = checkGame(remote.game, game.day);
		let adopted = false;
		if (theirGame && !busy && ahead(theirGame, game)) {
			game = theirGame;
			current = '';
			write(GAME_KEY, game);
			paintBoard();
			adopted = true;
		}
		if (adopted && game.status !== 'playing') finish(false);
		else if (statsBox.open) renderStats();
		if (JSON.stringify(stats) !== JSON.stringify(theirs) || JSON.stringify(game) !== JSON.stringify(theirGame)) push();
	}

	function forget() {
		me = null;
		try {
			localStorage.removeItem(SYNC_KEY);
		} catch {
			// Nothing saved to remove.
		}
		renderFamily();
	}

	function showTab(which: 'you' | 'family') {
		if (!familyEl) return;
		tabs.forEach((t) => {
			const on = t.dataset.tab === which;
			t.setAttribute('aria-selected', String(on));
			t.tabIndex = on ? 0 : -1;
		});
		panelYou.hidden = which !== 'you';
		familyEl.hidden = which !== 'family';
		if (which === 'family') {
			renderFamily();
			void pull();
			void loadBoard();
		}
	}

	function familyMsg(text: string) {
		if (familyEl) familyEl.querySelector('[data-family-msg]')!.textContent = text;
	}

	// Shows the join forms to someone new, or the board and their code to a member.
	function renderFamily() {
		if (!familyEl) return;
		familyEl.querySelector<HTMLElement>('[data-family-join]')!.hidden = Boolean(me);
		familyEl.querySelector<HTMLElement>('[data-family-board]')!.hidden = !me;
		if (me) familyEl.querySelector('[data-my-code]')!.textContent = me.code;
	}

	async function loadBoard() {
		if (!familyEl || !me) return;
		familyMsg(R.family.loading);
		try {
			const list = await sync.board();
			if (signal.aborted) return;
			drawBoard(Array.isArray(list) ? list : []);
			familyMsg('');
		} catch {
			familyMsg(R.family.offline);
		}
	}

	// Today's finishers first, fewest guesses on top, then everyone else by streak.
	function drawBoard(list: BoardRow[]) {
		const body = familyEl!.querySelector('[data-family-rows]')!;
		body.replaceChildren();
		const day = game.day;
		const today = (r: BoardRow) => (r.game_day !== day ? 8 : r.game_status === 'won' ? r.game_guesses : r.game_status === 'lost' ? 7 : 8);
		const streakOf = (r: BoardRow) => (r.last_win >= day - 1 ? r.streak : 0);
		const sorted = [...list].sort((a, b) => today(a) - today(b) || streakOf(b) - streakOf(a) || a.name.localeCompare(b.name));
		if (!sorted.length) {
			const tr = document.createElement('tr');
			const td = document.createElement('td');
			td.colSpan = 4;
			td.textContent = R.family.empty;
			tr.append(td);
			body.append(tr);
			return;
		}
		for (const r of sorted.slice(0, 60)) {
			const tr = document.createElement('tr');
			const isMe = Boolean(me) && r.name.toLowerCase() === me!.name.toLowerCase();
			if (isMe) tr.dataset.me = '';
			const t = today(r);
			const name = document.createElement('th');
			name.scope = 'row';
			name.textContent = r.name;
			if (isMe) {
				const you = document.createElement('span');
				you.className = 'rd-you';
				you.textContent = ` (${R.family.you})`;
				name.append(you);
			}
			const cells = [t <= TRIES ? `${t}/${TRIES}` : t === 7 ? `X/${TRIES}` : R.family.notYet, String(streakOf(r)), String(r.played ? Math.round((r.wins / r.played) * 100) : 0)];
			tr.append(name, ...cells.map((text, i) => {
				const td = document.createElement('td');
				td.textContent = text;
				if (i === 0 && t === 8) td.className = 'rd-notyet';
				return td;
			}));
			body.append(tr);
		}
	}

	if (familyEl) {
		tabs.forEach((t) => t.addEventListener('click', () => showTab(t.dataset.tab === 'family' ? 'family' : 'you'), { signal }));
		statsBox.querySelector('[role="tablist"]')!.addEventListener(
			'keydown',
			(e) => {
				const k = (e as KeyboardEvent).key;
				if (k !== 'ArrowLeft' && k !== 'ArrowRight') return;
				const next = tabs.find((t) => t.getAttribute('aria-selected') !== 'true')!;
				showTab(next.dataset.tab === 'family' ? 'family' : 'you');
				next.focus();
			},
			{ signal },
		);
		statsBox.querySelector('[data-to-family]')?.addEventListener('click', () => showTab('family'), { signal });

		familyEl.querySelector('[data-join-form]')!.addEventListener(
			'submit',
			async (e) => {
				e.preventDefault();
				const form = e.currentTarget as HTMLFormElement;
				const input = form.querySelector('input')!;
				const btn = form.querySelector('button')!;
				const name = input.value.trim().replace(/\s+/g, ' ');
				if (!name) return;
				btn.disabled = true;
				familyMsg(R.family.joining);
				try {
					const code = await sync.join(name);
					me = { code, name };
					write(SYNC_KEY, me);
					await sync.save(code, loadStats(), game).catch(() => {});
					input.value = '';
					renderFamily();
					await loadBoard();
				} catch {
					familyMsg(R.family.joinFailed);
				} finally {
					btn.disabled = false;
				}
			},
			{ signal },
		);

		familyEl.querySelector('[data-code-form]')!.addEventListener(
			'submit',
			async (e) => {
				e.preventDefault();
				const form = e.currentTarget as HTMLFormElement;
				const input = form.querySelector('input')!;
				const btn = form.querySelector('button')!;
				const code = cleanCode(input.value);
				if (!/^[A-Z0-9]{3}-[A-Z0-9]{3}$/.test(code)) return familyMsg(R.family.badCode);
				btn.disabled = true;
				familyMsg(R.family.loading);
				try {
					const remote = await sync.get(code);
					if (!remote) return familyMsg(R.family.badCode);
					me = { code, name: remote.name };
					write(SYNC_KEY, me);
					input.value = '';
					await pull();
					renderFamily();
					renderStats();
					await loadBoard();
				} catch {
					familyMsg(R.family.offline);
				} finally {
					btn.disabled = false;
				}
			},
			{ signal },
		);

		const copyBtn = familyEl.querySelector<HTMLButtonElement>('[data-copy-code]')!;
		copyBtn.addEventListener(
			'click',
			async () => {
				if (!me) return;
				try {
					await navigator.clipboard.writeText(me.code);
					copyBtn.textContent = R.family.copied;
					later(() => (copyBtn.textContent = R.family.copy), 2000);
				} catch {
					// Copying is blocked here, so select the code for a manual copy.
					const range = document.createRange();
					range.selectNodeContents(familyEl.querySelector('[data-my-code]')!);
					const sel = window.getSelection();
					sel?.removeAllRanges();
					sel?.addRange(range);
				}
			},
			{ signal },
		);

		familyEl.querySelector('[data-leave]')!.addEventListener(
			'click',
			() => {
				const code = me?.code ?? '';
				forget();
				familyMsg(R.family.signedOut.replace('{code}', code));
			},
			{ signal },
		);
		renderFamily();
	}

	startDay();
	if (game.status !== 'playing') finish(false);
	else if (!read(GAME_KEY) && !read(STATS_KEY)) later(openHelp, 300);
});
