export const SITE_TITLE = 'Meredith McGee';
export const SITE_DESCRIPTION = 'Public health researcher and grant writer helping small nonprofits and research teams with funding, research, and writing.';
export const SUBSTACK_URL = 'https://groundlevelmm.substack.com';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/meredith-mcgee-mph/';
export const CONTACT_EMAIL = 'meredith.ar.mcgee@gmail.com';

// Footer lines. Change the wording here, not in Footer.astro.
export const FOOTER_ROLE = 'Public health researcher, writer, and builder.';
export const FOOTER_AVAILABILITY = 'Available for research, speaking, writing, and development work.';

// The MM avatar that sits beside the name in the header and footer.
// Part of the brand family, so it is never redrawn, recolored or cropped.
export const MM_AVATAR = '/img/brand/mm-avatar-160.png';

// Where the consultation form on /work-with-me sends. This is a Formspree
// form of its own, separate from the contact form, so requests arrive with
// their own subject line. Paste the form's address here, for example
// 'https://formspree.io/f/abcdwxyz'. While it is empty the form is switched
// off and says so, and nothing is sent anywhere.
export const CONSULT_FORM_ENDPOINT = 'https://formspree.io/f/xaeodeqz';

// Where the contact form on /contact sends. A Formspree form of its own.
export const CONTACT_FORM_ENDPOINT = 'https://formspree.io/f/xgooeagz';

// Rosedle's family board and sync codes run on a free Supabase project. Paste
// its Project URL (like 'https://abcdefgh.supabase.co') and its publishable
// key here. Both are meant to be public. Never put the secret key here. While
// either is empty, the family board is switched off and each phone keeps its
// own stats. The database setup is in scripts/rosedle-supabase.sql.
export const ROSEDLE_SYNC_URL = '';
export const ROSEDLE_SYNC_KEY = '';
