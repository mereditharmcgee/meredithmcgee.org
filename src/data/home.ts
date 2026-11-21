// Every hand-picked line on the homepage, in page order. Change wording
// here, not in src/pages/index.astro. The study block reads from study.ts,
// the How I work strip from approach.ts, and the Ground Level posts come
// from the live feed.

export type Verb = 'study' | 'write' | 'build' | 'fund';

export const hero = {
	kicker: 'Meredith McGee, MPH · Boston',
	// The opening sentence. Each verb is a link to its section further down.
	sentence: [
		'I ',
		{ verb: 'study' },
		' how systems fail the people they’re supposed to serve, I ',
		{ verb: 'write' },
		' about it publicly, I ',
		{ verb: 'build' },
		' tools to close the gap, and I help ',
		{ verb: 'fund' },
		' the people doing the work.',
	] as (string | { verb: Verb })[],
	photo: { src: '/img/meredith.jpg', alt: 'Meredith McGee', width: 800, height: 801 },
	lede: 'I’m a public health researcher, writer, and builder. I get close to where systems meet people, listen for what the official story leaves out, and make things that help.',
	links: {
		workWithMe: { label: 'Work with me', href: '/work-with-me' },
		howIWork: { label: 'How I work', href: '/how-i-work' },
		story: { label: 'My story', href: '/about' },
	},
};

// The sticky bar under the hero. It highlights the section in view.
export const chapterBar = { label: 'On this page', lead: 'I', cta: { label: 'Work with me', href: '/work-with-me' } };

export const study = {
	clause: { before: 'I ', after: ' how systems fail the people they’re supposed to serve.' },
	where: 'Public Health Researcher · Parabola Center for Law and Policy',
	rail: {
		label: 'More research and talks, each one a PDF you can page through',
		more: { label: 'All work', href: '/work' },
		scrollLabel: 'More research and talks. Scroll sideways.',
	},
};

export const write = {
	clause: { before: 'I ', after: ' about it publicly.' },
	where: 'Ground Level, on Substack',
	aside: 'I write for people outside the room where the decisions get made.',
	latestLabel: 'Latest from Ground Level',
	staleLink: 'Read Ground Level on Substack',
	inPrintLabel: 'In print',
	allWriting: { label: 'All writing', href: '/writing' },
};

export const build = {
	clause: { before: 'I ', after: ' tools to close the gap.' },
	where: 'Founder and builder · RateMyPlace',
	feature: {
		image: { src: '/img/rate-my-place.jpg', width: 1000, height: 588 },
		site: 'https://ratemyplace.org',
		stat: { count: 27, caption: 'health and housing measures behind every RateMyPlace score' },
		title: 'RateMyPlace',
		text: 'Landlords have data on tenants. Tenants have word of mouth. RateMyPlace is my attempt to even that out.',
		caseStudy: { label: 'Read the case study', href: '/work/rate-my-place' },
		visit: { label: 'Visit RateMyPlace', href: 'https://ratemyplace.org' },
		thinking: { label: 'See how I thought it through', href: '/how-i-work#logic-model' },
	},
	cards: [
		{
			image: { src: '/img/kappa-tool.jpg', width: 1000, height: 633 },
			label: 'Tools',
			title: 'A Reliability Tool for Qualitative Coders',
			text: 'A free browser tool I built that calculates inter-rater reliability straight from Dedoose exports. I made it because I needed it.',
			link: { label: 'Try the tool', href: '/tools/kappa' },
		},
		{
			image: { src: '/img/cover-ratemyplace-deck.jpg', width: 640, height: 360 },
			label: 'The pitch',
			title: 'Know before you sign',
			text: '9-slide pitch deck, Yale Innovation Summit 2026.',
			link: { label: 'Open the deck', href: '/projects/pdfs/ratemyplace-deck.pdf' },
		},
	],
};

export const fund = {
	clause: { before: 'I help ', after: ' the people doing the work.' },
	where: 'Bradbury-Sullivan LGBT Community Center · 2023 to present',
	// Counts up through $999K, then lands on the final text.
	stat: { count: 999, prefix: '$', suffix: 'K', final: '$1M+', caption: 'raised for health equity and community programs' },
	pullline: 'Development work is public health work.',
	figures: [
		{
			image: {
				src: '/img/rachel-levine.jpg',
				alt: 'Meredith with Rachel Levine and colleagues at the Pennsylvania LGBTQIA+ Health Summit',
				width: 760,
				height: 1021,
			},
			caption: 'With Rachel Levine at the Pennsylvania LGBTQIA+ Health Summit.',
		},
		{
			image: { src: '/img/cover-people-over-profits.jpg', alt: 'People Over Profits sponsorship prospectus cover', width: 640, height: 829 },
			caption: 'The sponsorship case I wrote and designed for Parabola\'s People Over Profits event in Fort Lauderdale.',
			href: '/projects/pdfs/people-over-profits.pdf',
		},
	],
	workWithMe: { label: 'Work with me', href: '/work-with-me' },
	caseStudy: { label: 'Read the grants case study', href: '/work/bradbury-sullivan-grants' },
};

// The strip that links to the four pillars on How I work.
export const howIWork = { heading: 'How I work', more: { label: 'See how I work', href: '/how-i-work' } };

export const closing = {
	ember: { src: '/img/ember.webp', alt: 'Ember, a black lab in a purple harness', width: 440, height: 707 },
	text: {
		before: 'Off the clock, I’m usually reading across three disciplines at once, badly attempting to cook, or outside with Ember. If any of this sounds like your kind of thing, ',
		link: { label: 'say hello', href: '/contact' },
		after: '.',
	},
	cv: { label: 'CV (PDF)', href: '/Meredith-McGee-CV.pdf' },
};
