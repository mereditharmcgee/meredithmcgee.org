// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://meredithmcgee.org',
	integrations: [mdx(), sitemap()],
	redirects: {
		'/portfolio': '/work',
		'/resume': '/Meredith-McGee-CV.pdf',
		'/cv': '/Meredith-McGee-CV.pdf',
		'/blog': '/ground-level',
	},
});
