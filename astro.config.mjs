// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://meredithmcgee.org',
	// The Observatory page keeps working but is not linked or listed anywhere.
	integrations: [mdx(), sitemap({ filter: (page) => !page.includes('/observatory') })],
	redirects: {
		'/portfolio': '/work',
		'/resume': '/Meredith-McGee-CV.pdf',
		'/cv': '/Meredith-McGee-CV.pdf',
		'/ground-level': '/writing#ground-level',
		'/blog': '/writing#ground-level',
		'/Meredith-McGee-Resume.pdf': '/Meredith-McGee-CV.pdf',
	},
});
