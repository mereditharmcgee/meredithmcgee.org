// The RateMyPlace logic model: the columns, the pieces that sort into them,
// and the words for each scroll step. src/components/LogicModel.astro
// renders it and src/scripts/logicModel.ts moves the pieces.

export const columns = ['The problem', 'What’s known', 'What I built', 'What it makes', 'What changes'];

// Each piece is [column index, label].
export const chips: [number, string][] = [
	[0, 'Landlords have data on tenants'],
	[0, 'Tenants have word of mouth'],
	[1, 'Three validated housing surveys'],
	[1, 'Public records'],
	[2, 'A 27-item housing assessment'],
	[2, 'Items weighted by health impact'],
	[2, 'Buildings traced to their owners'],
	[2, 'Reviewers stay anonymous'],
	[3, 'Search an address'],
	[3, 'What past tenants reported'],
	[3, 'A score that points at a person'],
	[4, 'Telling the truth without fear'],
	[4, 'A public record of housing'],
];

export const gapLabel = 'What’s still missing?';

export const intro = {
	heading: 'One project, start to finish',
	lede: 'Scroll to see how RateMyPlace went from scattered pieces to a plan.',
	skip: 'Skip ahead',
	walkLabel: 'RateMyPlace, step by step',
	stageLabel:
		'A logic model for RateMyPlace that builds up as you scroll: the problem, what is known, what I built, what it makes, and what changes.',
};

export const steps = [
	{
		n: 'Before',
		title: 'The pieces',
		body: ['Every project starts as scattered pieces: a problem, some research, and a few ideas about what to build. The work is putting them in an order someone else can follow.'],
	},
	{
		n: '1 of 5',
		title: 'The problem',
		body: ['Landlords have data on tenants. Tenants have word of mouth. RateMyPlace is my attempt to even that out.'],
	},
	{
		n: '2 of 5',
		title: 'What’s known',
		body: ['I built a 27-item housing assessment out of three validated public health instruments, the OHQS, the PHQS, and the WHO LARES, and weighted each item by its documented health impact.'],
	},
	{
		n: '3 of 5',
		title: 'What I built',
		body: [
			'Every reviewed building gets traced back through public records to the owner actually accountable for its conditions, so the score points at a person, not just a place.',
			'Reviewers stay anonymous, move-out dates show as seasons instead of exact dates, and no IP addresses or personal identifiers are stored.',
		],
	},
	{
		n: '4 of 5',
		title: 'What it makes',
		body: ['You search an address and see what people who actually lived there reported about conditions, management, and the problems research shows affect your health. Then you leave your own review for the next tenant.'],
	},
	{
		n: '5 of 5',
		title: 'What changes',
		body: [
			'The point is that a tenant can tell the truth about a place without fear of retaliation.',
			'It’s growing by word of mouth, one honest review at a time, which is exactly how a public record of housing should grow.',
		],
	},
	{
		n: 'After',
		title: 'What’s missing',
		body: ['A logic model is only honest if it shows what isn’t there yet. For RateMyPlace, the missing piece is evidence that it changes what renters do. I can show you the tool and the reviews, but I can’t yet show you someone who picked a different apartment because of it, and that’s what I most want to measure next.'],
	},
];

export const outro = {
	text: 'Live now, and it works everywhere.',
	link: { label: 'Read the case study', href: '/work/rate-my-place' },
};
