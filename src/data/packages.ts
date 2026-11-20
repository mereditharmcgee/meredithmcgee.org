// Every price on the site lives in this file, so a number changes in one
// place. That covers the three funding packages, the single-pieces menu,
// the price line on each Work with me tile, and the lines about what counts
// toward a package. Nothing else on the site should hard-code a price.
// The wording is ported exactly from the approved preview.

export interface Package {
	slug: string;
	step: number;
	stepLabel: string;
	name: string;
	// The price as shown on the package's block and page.
	price: string;
	// The paragraph under the title on the package's page.
	pitch: string;
	// The three short items on the package's block.
	youGet: string[];
	// The line at the foot of the block. feedsNext adds an arrow after it.
	feeds: string;
	feedsNext: boolean;
	// The heading and full scope list in the "you get" box on the package's page.
	dealHeading: string;
	scope: string[];
	// The small line under the scope list, where the package has one.
	note?: string;
	// The large card at the foot of the package's page.
	next: { label: string; title: string; text: string; href: string };
}

export const packages: Package[] = [
	{
		slug: 'audit',
		step: 1,
		stepLabel: 'Step 1',
		name: 'The audit',
		price: '$2,500',
		pitch: 'A funding assessment for organizations that want to know what’s actually working before they write another application. I look at how you raise money now, talk with the people doing the work, and tell you, plainly, what I’d fix first.',
		youGet: ['A funding assessment', 'Conversations with your team', 'A report with your priorities'],
		feeds: 'Feeds the foundation',
		feedsNext: true,
		dealHeading: 'For $2,500, you get',
		scope: [
			'A funding assessment: what you’ve applied for, what you’ve won, and what you send funders',
			'Conversations with your staff and board',
			'A short written report on where you stand and what I’d prioritize',
			'A meeting to talk it through and decide what comes first',
		],
		next: { label: 'Next', title: 'The foundation', text: 'Build the pieces every application draws on.', href: '/work-with-me/foundation' },
	},
	{
		slug: 'foundation',
		step: 2,
		stepLabel: 'Step 2',
		name: 'The foundation',
		price: '$5,000 after the audit, or $7,500 on its own',
		pitch: 'This is where we build the pieces every application draws on: a logic model, a case for support, and a funder map. Once they’re in place, you stop starting from scratch each time.',
		youGet: ['A logic model', 'A case for support', 'A ranked funder list'],
		feeds: 'Feeds the partnership',
		feedsNext: true,
		dealHeading: 'For $5,000 after the audit, or $7,500 on its own, you get',
		scope: [
			'The audit, if you haven’t done it yet',
			'A logic model for your program, your theory of change on one page',
			'A case for support, built into a prospectus and a one-pager',
			'Prospect research on up to 25 funders, ranked by fit',
			'Your funding pipeline set up, so you can see what’s due when',
			'Check-ins along the way',
		],
		note: 'If you did the audit first, what you paid counts toward this.',
		next: { label: 'Next', title: 'The partnership', text: 'Apply together while your team learns the process.', href: '/work-with-me/partnership' },
	},
	{
		slug: 'partnership',
		step: 3,
		stepLabel: 'Step 3',
		name: 'The partnership',
		price: 'From $1,800 a month',
		pitch: 'Grant management and capacity building in one. I write and manage applications with you, month to month, and teach your team the process as we go. The goal is that you don’t need me forever.',
		youGet: ['Applications written with you', 'A funding calendar', 'A team that can run it'],
		feeds: 'Ongoing',
		feedsNext: false,
		dealHeading: 'From $1,800 a month, you get',
		scope: [
			'About 20 hours a month in the first year',
			'Applications written and submitted with you',
			'A funding calendar, so nothing sneaks up on you',
			'Grant reports for the funders you win',
			'Monthly check-ins',
			'Training for your team as we go',
		],
		note: 'Billed monthly, with 30 days’ notice to end it. In year two, the hours usually drop as your team takes more on.',
		next: { label: 'Not ready for all three?', title: 'Start with one piece', text: 'Every piece is also available on its own.', href: '/work-with-me#menu' },
	},
];

// Labels the three package blocks share.
export const blockLabels = { youGet: 'You get', fullScope: 'See the full scope' };

// The line under the three blocks, on Work with me and on each package page.
export const SYSTEM_LINE = 'Any one of these stands on its own. Together, they build a funding system driven by your story, backed by your data, and run by your own team.';

// The four kinds of work on the Work with me tiles, each with its price line.
// The id picks the color and matches a group in the menu below.
export const kinds = [
	{
		id: 'fund',
		name: 'Funding',
		text: 'Good proposals get passed over because they weren’t framed the way a funder needed to see them. I make that process clearer, and I connect your work with the people who’d want to support it.',
		priceLine: 'Packages from $2,500, or single pieces from $350.',
	},
	{
		id: 'study',
		name: 'Research',
		text: 'I can come in at any stage of a study, from the first question to the final report. I’ve taken an interview study from IRB protocol to publication and evaluated programs while they were still running.',
		priceLine: 'Quoted by project, at $90 an hour.',
	},
	{
		id: 'write',
		name: 'Writing',
		text: 'Research does the most good when people outside the field can follow it. I write for funders, legislators, boards, and regular readers, and I give them the data and the background to make up their own minds.',
		priceLine: 'One-pagers from $500. Longer pieces are quoted by project.',
	},
	{
		id: 'speak',
		name: 'Speaking',
		text: 'I talk about cannabis policy, health equity, and what research actually means for people’s lives, at conferences, in classrooms, and in staff trainings.',
		priceLine: 'Talks from $500. Workshops are $750.',
	},
];

// The single-pieces menu, in four groups.
export const menuGroups = [
	{
		id: 'fund',
		name: 'Funding',
		rows: [
			{ item: 'Grant proposal', note: 'Federal or very large proposals are quoted separately.', price: '$1,500' },
			{ item: 'Grant report', price: '$600' },
			{ item: 'Review or edit of your draft', price: '$350' },
			{ item: 'Logic model', price: '$1,200' },
			{ item: 'Prospectus', price: '$2,000' },
			{ item: 'Prospect research, up to 25 funders', price: '$1,500' },
			{ item: 'Event sponsorship packet and asks', price: '$1,500' },
			{ item: 'Advising', price: '$90 an hour' },
		],
	},
	{
		id: 'study',
		name: 'Research',
		rows: [
			{
				item: 'Program evaluations, interview studies, and surveys',
				note: 'At $90 an hour, once we’ve scoped it together.',
				price: 'Quoted by project',
			},
		],
	},
	{
		id: 'write',
		name: 'Writing',
		rows: [
			{ item: 'One-pager', price: '$500' },
			{ item: 'Reports, briefs, op-eds, and explainers', price: 'Quoted by project' },
		],
	},
	{
		id: 'speak',
		name: 'Speaking',
		rows: [
			{ item: 'Talk or panel', price: 'From $500' },
			{ item: 'Staff workshop or board session', price: '$750 each' },
		],
	},
];

// The line under the menu about moving up from a single piece to a package.
export const MENU_CREDIT = 'If you start with a single piece and later move up to a package, anything the package already includes counts toward it.';
