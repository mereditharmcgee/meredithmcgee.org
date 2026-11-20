// Ground Level posts for the homepage, /writing and /ground-level.
// One fetch per build, shared by every page, with the committed cache as
// the fallback when Substack cannot be reached.
import cachedPosts from '../data/substack-cache.json';

export interface GroundLevelPost {
	title: string;
	excerpt: string;
	url: string;
	date: Date;
	cover: string;
}

const API_URL = 'https://groundlevelmm.substack.com/api/v1/posts?limit=12';

// If the newest post is older than this, pages show one plain link to
// Substack instead of dated posts, so a stuck feed never looks current.
const STALE_AFTER_DAYS = 60;

// Post covers are fetched and saved, but not shown yet. Phase 0 changes
// nothing about how the site looks. The rebuild turns covers on with its
// own rules for which ones to show (SITE-REBUILD.md, section 6).
const SHOW_COVERS = false;

let allPosts: Promise<GroundLevelPost[]> | undefined;

async function loadPosts(): Promise<GroundLevelPost[]> {
	try {
		const res = await fetch(API_URL, {
			headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AstroSSG; +https://meredithmcgee.org)' },
		});
		if (!res.ok) throw new Error(`API fetch failed: ${res.status}`);
		const data = await res.json();
		// The API used to return a bare array. It now returns { posts, nextCursor }.
		const list = Array.isArray(data) ? data : (data.posts ?? []);
		if (list.length === 0) throw new Error('API returned no posts');

		return list.map((p: any) => ({
			title: p.title || '',
			excerpt: p.subtitle || p.description || '',
			url: p.canonical_url || '',
			date: new Date(p.post_date),
			cover: p.cover_image || '',
		}));
	} catch (e) {
		console.warn(
			'\n[Ground Level] WARNING: the live Substack fetch failed, so this build is using the saved copy in src/data/substack-cache.json. Reason:',
			e instanceof Error ? e.message : e,
			'\n',
		);
		return cachedPosts.map((p) => ({
			title: p.title,
			excerpt: p.excerpt,
			url: p.url,
			date: new Date(p.date),
			cover: (p as any).cover || '',
		}));
	}
}

export async function getGroundLevelPosts(limit: number): Promise<{ posts: GroundLevelPost[]; stale: boolean }> {
	allPosts ??= loadPosts();
	const posts = (await allPosts)
		.slice(0, limit)
		.map((p) => (SHOW_COVERS ? p : { ...p, cover: '' }));
	const newest = posts[0]?.date.getTime() ?? 0;
	const stale = Date.now() - newest > STALE_AFTER_DAYS * 24 * 60 * 60 * 1000;
	return { posts, stale };
}
