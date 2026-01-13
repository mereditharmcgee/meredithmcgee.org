import { defineCollection, z } from 'astro:content';

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
		// Detail page fields
		challenge: z.string().optional(),
		approach: z.string().optional(),
		outcome: z.string().optional(),
		skills: z.array(z.string()).optional(),
		timeline: z.string().optional(),
		organization: z.string().optional(),
	}),
});

export const collections = { portfolio };
