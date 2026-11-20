// The consultation form on /work-with-me. Labels and choices are ported
// exactly from the approved preview. Where it sends is set in src/consts.ts
// (CONSULT_FORM_ENDPOINT).

export type ConsultField =
	| { kind: 'text' | 'email'; id: string; name: string; label: string; autocomplete?: string; required?: boolean }
	| { kind: 'select'; id: string; name: string; label: string; placeholder: string; options: string[] }
	| { kind: 'checks'; name: string; label: string; options: string[] }
	| { kind: 'textarea'; id: string; name: string; label: string; rows: number };

// Name and email are the two fields a reply needs, so they are required.
export const NAME: ConsultField = { kind: 'text', id: 'cq-name', name: 'name', label: 'Your name', autocomplete: 'name', required: true };
export const EMAIL: ConsultField = { kind: 'email', id: 'cq-email', name: 'email', label: 'Email', autocomplete: 'email', required: true };
export const ORGANIZATION: ConsultField = { kind: 'text', id: 'cq-org', name: 'organization', label: 'Organization', autocomplete: 'organization' };
export const ORG_TYPE: ConsultField = {
	kind: 'select',
	id: 'cq-type',
	name: 'type',
	label: 'What kind of organization',
	placeholder: 'Choose one',
	options: ['Nonprofit', 'Small business', 'Social enterprise', 'Research team', 'Something else'],
};
export const BUDGET: ConsultField = {
	kind: 'select',
	id: 'cq-budget',
	name: 'budget',
	label: 'Rough annual budget',
	placeholder: 'Choose one',
	options: ['Under $300K', '$300K to $1M', '$1M to $5M', 'Over $5M', 'Not sure'],
};
export const TIMELINE: ConsultField = {
	kind: 'select',
	id: 'cq-timeline',
	name: 'timeline',
	label: 'Timeline',
	placeholder: 'Choose one',
	options: ['In the next month', 'In the next three months', 'Later this year', 'Just exploring'],
};
export const HELP: ConsultField = { kind: 'checks', name: 'help', label: 'What would you like help with?', options: ['Funding', 'Research', 'Writing', 'Speaking'] };
export const MESSAGE: ConsultField = { kind: 'textarea', id: 'cq-msg', name: 'message', label: 'What’s going on, and what are you hoping for?', rows: 5 };
export const HEARD: ConsultField = { kind: 'text', id: 'cq-heard', name: 'heard', label: 'How did you hear about me?' };

export const SUBMIT_LABEL = 'Request a free consultation';

// The email subject. The organization's name is added after the colon.
export const SUBJECT_PREFIX = 'Consultation request';

// Meredith's wording, approved Nov 20, 2026.
// Shown in place of the form after it sends.
export const SENT_MESSAGE = 'Thanks for reaching out. I’ll read this and write back with a few times to talk.';
// Shown under the form if sending fails.
export const FAILED_MESSAGE = 'Something went wrong and this didn’t send. You can email me directly instead.';
// PROVISIONAL, not Meredith's wording. It never shows once the form is
// connected, because it only appears while CONSULT_FORM_ENDPOINT is empty.
export const NOT_CONNECTED_MESSAGE = 'This form isn’t connected yet. Please email me instead.';
