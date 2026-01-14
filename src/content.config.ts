import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	type: 'content',
	schema: ({ image }) => z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: image().optional(),
	}),
});

const portfolio = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		category: z.string(),
		image: z.string(),
		description: z.string(),
		tags: z.array(z.string()),
		size: z.enum(['small', 'medium', 'large']),
		order: z.number(),
		// At-a-glance cards
		role: z.string().optional(),
		challenge: z.string().optional(),
		impact: z.string().optional(),
		// Meta info
		skills: z.array(z.string()).optional(),
		timeline: z.string().optional(),
		organization: z.string().optional(),
		video: z.string().optional(),
	}),
});

export const collections = { blog, portfolio };
