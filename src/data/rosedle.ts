// Rosedle, the word game at /rosedle. It plays like any five-letter word
// game, except the answer never changes. All of the page's wording lives
// here, so it can be changed without touching the game code.
//
// The guess list (rosedle-words.txt) is the five-letter words from the
// word-list package by Sindre Sorhus, MIT license.

export const ANSWER = 'arose';

// Puzzle No. 1. The number on the page counts up one a day from here.
export const LAUNCH_DATE = '2026-11-27';

export type Mark = 'correct' | 'present' | 'absent';

export const ROSEDLE = {
	name: 'Rosedle',
	description: 'Guess the five-letter word in six tries. A new Rosedle every day.',

	help: {
		heading: 'How to play',
		intro: 'Guess the word in six tries. Each guess has to be a real five-letter word.',
		lead: 'After each guess, the tiles change color to show how close you got.',
		examples: [
			{ word: 'bloom', index: 2, mark: 'correct' as Mark, text: 'O is in the word and in the right spot.' },
			{ word: 'thorn', index: 3, mark: 'present' as Mark, text: 'R is in the word, but in a different spot.' },
			{ word: 'petal', index: 4, mark: 'absent' as Mark, text: 'L is not in the word at all.' },
		],
		outro: 'A new Rosedle comes out every day at midnight.',
	},

	messages: {
		notEnough: 'Not enough letters',
		notAWord: 'Not in the word list',
		// One line per number of guesses, first try to sixth.
		wins: ['First try. Lucky you.', 'Two guesses. Very nice.', 'Three. Solid.', 'Four. Getting there.', 'Five. That was close.', 'Six. Just made it.'],
		lose: 'The word was',
	},

	stats: {
		heading: 'Your stats',
		played: 'Played',
		winPct: 'Win %',
		streak: 'Current streak',
		maxStreak: 'Max streak',
		distribution: 'Guess distribution',
		next: 'Next Rosedle in',
		tease: 'Tomorrow’s word is a mystery.',
		share: 'Share',
		copied: 'Copied your results',
		copyFailed: 'Couldn’t copy automatically. Here’s the text to copy.',
	},

	// The shared result. Each guess becomes a row of these.
	share: {
		url: 'meredithmcgee.org/rosedle',
		emoji: { correct: '🌹', present: '🌿', absent: '⬜' } as Record<Mark, string>,
	},

	noscript: 'Rosedle needs JavaScript to run. Turn it on and reload the page to play.',
};
