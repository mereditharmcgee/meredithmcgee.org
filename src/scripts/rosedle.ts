// Rosedle, the game on /rosedle. One puzzle a day, counted from LAUNCH_DATE
// in the player's own time zone. Today's board and the player's stats are
// kept in their browser, and the game still works if that storage is off.
import wordList from '../data/rosedle-words.txt?raw';
import { ANSWER, LAUNCH_DATE, ROSEDLE, type Mark } from '../data/rosedle';
import { onPage, reducedMotion } from './page';

const LENGTH = 5;
const TRIES = 6;
const FLIP_STEP = 280; // ms between tiles turning over
const FLIP_TIME = 480; // ms for one tile to turn over
const WORDS = new Set(wordList.split(/\s+/).filter(Boolean));
WORDS.add(ANSWER);

const GAME_KEY = 'rosedle-game';
const STATS_KEY = 'rosedle-stats';

type Status = 'playing' | 'won' | 'lost';
interface Game { day: number; guesses: string[]; status: Status }
interface Stats { played: number; wins: number; streak: number; maxStreak: number; dist: number[]; lastWin: number; lastPlayed: number }

// Marks each letter of a guess. Letters that are in the right spot claim
// their match first, so a repeated letter only lights up as many times as
// it appears in the answer.
export function score(guess: string, answer = ANSWER): Mark[] {
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

function loadGame(day: number): Game {
	const saved = read<Game>(GAME_KEY);
	const valid =
		saved &&
		saved.day === day &&
		Array.isArray(saved.guesses) &&
		saved.guesses.length <= TRIES &&
		saved.guesses.every((g) => typeof g === 'string' && g.length === LENGTH);
	if (!valid) return { day, guesses: [], status: 'playing' };
	const won = saved.guesses.includes(ANSWER);
	const status: Status = won ? 'won' : saved.guesses.length === TRIES ? 'lost' : 'playing';
	return { day, guesses: saved.guesses.slice(0, won ? saved.guesses.indexOf(ANSWER) + 1 : TRIES), status };
}

function loadStats(): Stats {
	const blank: Stats = { played: 0, wins: 0, streak: 0, maxStreak: 0, dist: [0, 0, 0, 0, 0, 0], lastWin: 0, lastPlayed: 0 };
	const saved = read<Partial<Stats>>(STATS_KEY);
	if (!saved) return blank;
	const s = { ...blank, ...saved };
	if (!Array.isArray(s.dist) || s.dist.length !== TRIES) s.dist = blank.dist;
	return s;
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

	let game: Game;
	let current = '';
	let busy = false;
	let toastTimer = 0;
	let clockTimer = 0;
	const timers: number[] = [];
	const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));
	signal.addEventListener('abort', () => {
		timers.forEach(clearTimeout);
		clearTimeout(toastTimer);
		clearInterval(clockTimer);
	});

	function toast(text: string, ms = 1600) {
		toastEl.textContent = text;
		toastEl.classList.add('on');
		clearTimeout(toastTimer);
		if (ms > 0) toastTimer = window.setTimeout(() => toastEl.classList.remove('on'), ms);
	}

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
		return score(guess).map((m, i) => `${guess[i].toUpperCase()} ${SPOKEN[m]}`).join(', ');
	}

	function labelRow(r: number) {
		const guess = game.guesses[r];
		rows[r].setAttribute('aria-label', guess ? `Guess ${r + 1}: ${spoken(guess)}` : `Guess ${r + 1}`);
	}

	function paintKeys() {
		const best: Record<string, Mark> = {};
		for (const g of game.guesses) {
			score(g).forEach((m, i) => {
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
			const marks = guess ? score(guess) : null;
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
			}
		}
		const msg = game.status === 'won' ? R.messages.wins[game.guesses.length - 1] : `${R.messages.lose} ${ANSWER.toUpperCase()}.`;
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
		const marks = score(guess);
		game.guesses.push(guess);
		current = '';
		if (guess === ANSWER) game.status = 'won';
		else if (game.guesses.length === TRIES) game.status = 'lost';
		write(GAME_KEY, game);

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
		if (dayNumber(now) !== game.day && !busy) newDay();
	}

	function openStats() {
		if (help.open) help.close();
		renderStats();
		tickClock();
		clearInterval(clockTimer);
		clockTimer = window.setInterval(tickClock, 1000);
		if (!statsBox.open) statsBox.showModal();
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
		const grid = game.guesses.map((g) => score(g).map((m) => R.share.emoji[m]).join('')).join('\n');
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
	document.addEventListener('visibilitychange', () => document.visibilityState === 'visible' && dayNumber() !== game.day && !busy && newDay(), { signal });

	startDay();
	if (game.status !== 'playing') finish(false);
	else if (!read(GAME_KEY) && !read(STATS_KEY)) later(openHelp, 300);
});
