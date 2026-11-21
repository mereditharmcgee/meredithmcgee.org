// How I work, in one place: the four pillars and the three tracks that the
// scroll walkthrough plays. Wording changes go here, not in the page.

// The color key matches the .tk-1 to .tk-4 classes in global.css.
export const pillars = [
	{
		"id": "tenet-a1",
		"color": "tk-1",
		"name": "Evidence.",
		"tag": "Evidence",
		"sentence": "I blend qualitative and quantitative data, because the numbers show what’s happening and people can tell you why."
	},
	{
		"id": "tenet-a2",
		"color": "tk-3",
		"name": "Stories.",
		"tag": "Stories",
		"sentence": "Good work doesn’t always speak for itself. I find the story that’s already there and write it so someone outside the work can follow it."
	},
	{
		"id": "tenet-a3",
		"color": "tk-4",
		"name": "Village.",
		"tag": "Village",
		"sentence": "Funding is relationship work. I help organizations tap into and build the village around them: the funders, partners, and community who want them to succeed."
	},
	{
		"id": "tenet-a4",
		"color": "tk-2",
		"name": "Capacity.",
		"tag": "Capacity",
		"sentence": "I do the work alongside your team and teach it as we go, so it keeps running after I leave."
	}
];

// Labels on the two slots of every step card.
export const slotLabels = { startsWith: 'Starts with', walkAway: 'Walk away with' };

// Each track has three steps. What one step makes moves over and becomes
// what the next step starts with, so only the first step names its own
// starting point. "tags" are pillar names and take that pillar's color.
export const tracks = [
	{
		"id": "fund",
		"tab": "Funding",
		"stageLabel": "The three steps for funding work, building as you scroll",
		"before": {
			"kicker": "Before",
			"title": "Watch it build",
			"body": [
				"Scroll, and each step hands what it made to the next one."
			]
		},
		"steps": [
			{
				"title": "The audit",
				"tags": [
					"Evidence"
				],
				"startsWith": "Past applications, budget, materials",
				"makes": "Audit report and priorities",
				"kicker": "1 of 3 · Find out where things stand",
				"body": [
					"I look at what you’ve applied for, what you’ve won, what your materials say about you, and where the gaps are.",
					"You walk away with: a short written report on where you stand and what I’d prioritize, and a meeting to decide what to tackle first."
				]
			},
			{
				"title": "The foundation",
				"tags": [
					"Stories",
					"Village"
				],
				"makes": "Logic model, story, funder map",
				"kicker": "2 of 3 · Build what’s missing",
				"body": [
					"I build the pieces every application draws on: a logic model for your program, your core story and funder materials, and a map of the funders most likely to say yes.",
					"You walk away with: a logic model, a story and materials funders can follow, and a list of who to approach."
				]
			},
			{
				"title": "The partnership",
				"tags": [
					"Village",
					"Capacity"
				],
				"makes": "Applications in motion",
				"kicker": "3 of 3 · Carry it forward",
				"body": [
					"I write and manage applications with you month to month, and I teach your team the process as we go.",
					"You walk away with: applications in motion, and a team that knows how to keep them going without me."
				]
			}
		]
	},
	{
		"id": "study",
		"tab": "Research",
		"stageLabel": "The three steps for research work, building as you scroll",
		"before": {
			"kicker": "Before",
			"title": "Watch it build",
			"body": [
				"Scroll, and each step hands what it made to the next one."
			]
		},
		"steps": [
			{
				"title": "Scoping",
				"tags": [
					"Evidence"
				],
				"startsWith": "A question and your data",
				"makes": "A study plan",
				"kicker": "1 of 3 · Find out where things stand",
				"body": [
					"We pin down the question, check what’s already known, and figure out what’s realistic for your time and budget.",
					"You walk away with: a study plan: who we’ll hear from, what we’ll ask, and how."
				]
			},
			{
				"title": "The study",
				"tags": [
					"Evidence"
				],
				"makes": "Findings that hold up",
				"kicker": "2 of 3 · Build what’s missing",
				"body": [
					"Ethics review if it needs one, then recruitment, surveys or interviews, and coding with a second coder and a reliability check, so the findings hold up.",
					"You walk away with: findings grounded in what people actually said."
				]
			},
			{
				"title": "Findings you can use",
				"tags": [
					"Stories",
					"Capacity"
				],
				"makes": "A report you can act on",
				"kicker": "3 of 3 · Carry it forward",
				"body": [
					"I turn them into a report or brief your board, your funders, or the public can follow. If you want to keep collecting data, I’ll train your team to do it.",
					"You walk away with: something you can act on, and the tools to keep asking the question."
				]
			}
		]
	},
	{
		"id": "write",
		"tab": "Writing",
		"stageLabel": "The three steps for writing work, building as you scroll",
		"before": {
			"kicker": "Before",
			"title": "Watch it build",
			"body": [
				"Scroll, and each step hands what it made to the next one."
			]
		},
		"steps": [
			{
				"title": "Finding the story",
				"tags": [
					"Evidence",
					"Stories"
				],
				"startsWith": "Your work and your data",
				"makes": "A map of the argument",
				"kicker": "1 of 3 · Find out where things stand",
				"body": [
					"I dig in, check anything that doesn’t add up, and figure out what your reader actually needs to know.",
					"You walk away with: a map of the argument and the evidence behind it, before any drafting starts."
				]
			},
			{
				"title": "A full draft",
				"tags": [
					"Evidence",
					"Stories"
				],
				"makes": "A full, checked draft",
				"kicker": "2 of 3 · Build what’s missing",
				"body": [
					"I write the whole thing and check every claim against its source. You get a finished draft I’m proud of, not a rough sketch.",
					"You walk away with: a complete, checked draft."
				]
			},
			{
				"title": "Tearing it apart together",
				"tags": [
					"Stories",
					"Capacity"
				],
				"makes": "A piece ready to send",
				"kicker": "3 of 3 · Carry it forward",
				"body": [
					"We push on it together, cutting, reframing, and sharpening until it has an edge. I want your pushback here, because that’s where the writing gets better.",
					"You walk away with: a piece that’s ready to publish, pitch, or send."
				]
			}
		]
	}
];

export const pillarColor = (tag: string) => pillars.find((p) => p.tag === tag)?.color ?? 'tk-1';
