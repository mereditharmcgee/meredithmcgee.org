// The scroll piece on each package page: the steps that scroll past and
// the labels on the stage that stays pinned beside them. The example labels
// (such as "Few repeat funders" or "Local foundations") are generic
// illustrations, not real clients. The wording is ported exactly from the
// approved preview. Prices are not here. They live in src/data/packages.ts.

export interface SceneStep {
	kicker: string;
	title: string;
	body: string[];
}

export interface PackageScene {
	// Describes the stage for screen readers.
	stageLabel: string;
	steps: SceneStep[];
	// The button at the end of the last step.
	cta: { label: string; href: string; arrow: boolean };
}

export const auditScene: PackageScene = {
	stageLabel: 'How your materials and your team’s stories turn into a short list of priorities',
	steps: [
		{
			kicker: 'Before',
			title: 'What you hand me',
			body: [
				'Old applications, your budget, past funders, your annual report, whatever you’ve got. It doesn’t need to be organized. That’s my job.',
			],
		},
		{
			kicker: '1 of 4',
			title: 'Talking to your people',
			body: [
				'I sit down with your staff and board, because the heart of the work usually lives in how the people closest to it talk about it, not in the files.',
			],
		},
		{
			kicker: '2 of 4',
			title: 'Sorting it',
			body: [
				'I sort everything into what you’ve asked for, what you’ve won, how you describe yourselves to funders, and what your team told me.',
			],
		},
		{
			kicker: '3 of 4',
			title: 'Finding the gaps',
			body: [
				'Then the gaps show up: the outcomes nobody’s tracking, the funders who gave once and never again, the story your team tells better than your materials do.',
			],
		},
		{
			kicker: '4 of 4',
			title: 'The report',
			body: [
				'The gaps become your priorities. You get a short written report on where you stand and what I’d fix first, and we meet to decide where to start.',
			],
		},
	],
	cta: { label: 'Continue to the foundation', href: '/work-with-me/foundation', arrow: true },
};

// The labels on the audit stage.
export const auditStage = {
	pile: [
		{ text: 'Old applications', bin: 'au-b1' },
		{ text: 'Letters of inquiry', bin: 'au-b1' },
		{ text: 'Past funders', bin: 'au-b2' },
		{ text: 'Award letters', bin: 'au-b2' },
		{ text: 'Annual report', bin: 'au-b3' },
		{ text: 'Website', bin: 'au-b3' },
		{ text: 'Budget', bin: 'au-b3' },
	],
	voices: [
		{ text: 'Staff conversations', bin: 'au-b4' },
		{ text: 'Board conversations', bin: 'au-b4' },
	],
	bins: [
		{ id: 'au-b1', heading: 'What you’ve asked for', gap: 'Outcomes nobody’s tracking' },
		{ id: 'au-b2', heading: 'What you’ve won', gap: 'Few repeat funders' },
		{ id: 'au-b3', heading: 'How you describe yourselves' },
		{ id: 'au-b4', heading: 'What your team told me', gap: 'Your team tells the story better than your materials do' },
	],
	report: { title: 'Your audit report', subtitle: 'What I’d fix first' },
};

export const foundationScene: PackageScene = {
	stageLabel: 'The logic model, the story, and the funder map building one at a time',
	steps: [
		{
			kicker: 'Before',
			title: 'Where we start',
			body: [
				'We start from the priorities the audit turned up. If you’re starting here, the audit comes first, and it’s included.',
			],
		},
		{
			kicker: '1 of 3',
			title: 'The logic model',
			body: [
				'A one-page map of the problem you’re solving, what you do about it, and what changes because of it. Every application after this draws on it.',
			],
		},
		{
			kicker: '2 of 3',
			title: 'Your story',
			body: [
				'One core story, written so a funder can follow it, and built into a prospectus and a one-pager you can send anywhere.',
			],
		},
		{
			kicker: '3 of 3',
			title: 'Your funder map',
			body: [
				'Research on up to 25 funders, sorted by how likely they are to say yes, so you know who to approach first.',
			],
		},
		{
			kicker: 'After',
			title: 'Ready to apply',
			body: [
				'With all three in place, you stop starting from scratch every time. This is what the partnership builds on.',
			],
		},
	],
	cta: { label: 'Continue to the partnership', href: '/work-with-me/partnership', arrow: true },
};

// The labels on the foundation stage.
export const foundationStage = {
	trayLabel: 'From the audit',
	priorities: ['Build a logic model', 'One core story', 'Widen your funder list'],
	logicModel: {
		heading: 'Logic model',
		columns: [
			{ heading: 'The problem', chip: 'Who you serve, and why' },
			{ heading: 'What you do', chip: 'Your programs' },
			{ heading: 'What changes', chip: 'Outcomes you can show' },
		],
	},
	story: { heading: 'Your story', lines: ['Who it’s for', 'What changes for them', 'Why you'] },
	funderMap: {
		heading: 'Funder map',
		rings: [
			{ heading: 'Most likely', chips: ['Local foundations', 'Health funders'] },
			{ heading: 'Worth a try', chips: ['Corporate giving'] },
			{ heading: 'Later', chips: ['Government grants'] },
		],
	},
	ready: 'Ready to apply',
};

export const partnershipScene: PackageScene = {
	stageLabel: 'Applications moving from Meredith to your team over the first year',
	steps: [
		{
			kicker: 'Month one',
			title: 'I take the first ones',
			body: ['I write the first applications myself, so nothing slips while you watch how they come together.'],
		},
		{
			kicker: 'Months two and three',
			title: 'Writing together',
			body: ['We start drafting side by side. I explain why each piece is built the way it is.'],
		},
		{
			kicker: 'Months four to six',
			title: 'Your team takes the lead',
			body: ['Your team drafts, and I edit, coach, and catch what’s missing before it goes out.'],
		},
		{
			kicker: 'Year two',
			title: 'It runs without me',
			body: ['Most of it runs on its own. The hours drop, and I’m there for review and the big asks.'],
		},
	],
	cta: { label: 'Request a free consultation', href: '/work-with-me#consult', arrow: false },
};

// The labels on the partnership stage.
export const partnershipStage = {
	lanes: { me: 'Me', together: 'Together', team: 'Your team' },
	apps: [
		{ text: 'Foundation grant', path: '0:pa-me,1:pa-tog,2:pa-team' },
		{ text: 'Grant report', path: '0:pa-me,1:pa-tog,2:pa-team' },
		{ text: 'Renewal', path: '0:pa-me,2:pa-tog,3:pa-team' },
		{ text: 'Corporate ask', path: '0:pa-me,2:pa-tog,3:pa-team' },
		{ text: 'Event sponsors', path: '0:pa-me,3:pa-tog' },
	],
	review: 'Reviewing and big asks',
	meter: 'Hours with me',
};

export const packageScenes: Record<string, PackageScene> = { audit: auditScene, foundation: foundationScene, partnership: partnershipScene };
