// The cannabis legalization study, in one place. The homepage uses it now
// and the case study page uses it once that page is rebuilt.

export const report = {
	kicker: 'Research report · August 2026',
	title: '“I Like Not Having to Go Behind the Dumpster at a Taco Bell”',
	subtitle: 'Consumer Perspectives in States with Established Cannabis Markets',
	authors: ['Faith English', 'Meredith McGee'],
	publisher: 'Parabola Center for Law and Policy',
	pdf: 'https://www.parabolacenter.com/pdf/consumer-study.pdf',
	studyPage: 'https://www.parabolacenter.com/consumerstudy',
	readLabel: 'Read the report',
	studyPageLabel: 'Study page',
	// Cropped above the byline on purpose. The printed cover carries an old title.
	cover: { src: '/img/report-cover.jpg', width: 720, height: 731 },
};

export const studyStats = [
	{ count: 37, suffix: '', caption: 'in-depth interviews' },
	{ count: 9, suffix: '', caption: 'states' },
	{ count: 5, suffix: '+', caption: 'years of legal sales in every one' },
];

// One square per person interviewed. The counts must add up to 37.
export const states = [
	{ name: 'Massachusetts', count: 8 },
	{ name: 'Alaska', count: 6 },
	{ name: 'California', count: 6 },
	{ name: 'Nevada', count: 4 },
	{ name: 'Oregon', count: 4 },
	{ name: 'Illinois', count: 3 },
	{ name: 'Colorado', count: 2 },
	{ name: 'Michigan', count: 2 },
	{ name: 'Washington', count: 2 },
];

export const squaresLabel = 'One square per person we interviewed';

export const methodNote =
	'Interviews ran 45 to 60 minutes, February to April 2026. Two of us coded the same excerpts independently and reached a Cohen’s kappa above 0.93. Approved by the Johns Hopkins Bloomberg School of Public Health IRB.';

// Keep this caption wherever the findings lists appear. The lists describe
// what people perceived, not measured results.
export const findingsCaption = 'What participants told us. These are their perceptions, not measured outcomes.';

export const findings = [
	{
		heading: 'What people like',
		items: ['Fewer arrests and less incarceration', 'Less stigma around use', 'Safer, tested products', 'A boost to local economies'],
	},
	{
		heading: 'What worries them',
		items: ['Too much regulation', 'Not knowing where the tax money goes', 'Uncertainty about whether underage and problem use could rise'],
	},
	{
		heading: 'What they’d change',
		items: ['Show where the tax money goes', 'Give residents more say', 'Protect small businesses', 'Legal places to consume'],
	},
];

export const pressLabel = 'Covered by';

export const press = [
	{ outlet: 'GBH News', href: 'https://www.wgbh.org/news/local/2026-08-10/mass-cannabis-consumers-are-concerned-about-potency-tax-spending-finds-study' },
	{ outlet: 'New England Public Media', href: 'https://www.nepm.org/podcast/the-fabulous-413/2026-08-18/impacts-of-legalized-marijuana-dear-alien-play-at-chester-theater-mr-universe' },
	{ outlet: 'mg Magazine', href: 'https://mgmagazine.com/business-strategy/finance-acquisitions-business-strategy/cannabis-consumers-consolidation-small-business/' },
	{ outlet: 'International Cannabis Business Conference', href: 'https://internationalcbc.com/study-highlights-cannabis-consumer-perspectives-in-legal-u-s-markets/' },
	{ outlet: 'Ganjapreneur', href: 'https://ganjapreneur.com/grassroots-cannabis-leaders-gather-at-fourth-annual-people-over-profit-summit/' },
];

export const moreAboutStudy = { label: 'More about the study', href: '/work/cannabis-legalization-study' };
