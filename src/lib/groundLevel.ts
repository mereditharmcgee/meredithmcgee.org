// Ground Level posts for the homepage, /writing and /ground-level.
// One fetch per build, shared by every page. It tries Substack's API, then
// the RSS feed, then the committed cache when neither can be reached.
import { XMLParser } from 'fast-xml-parser';
import cachedPosts from '../data/substack-cache.json';

export interface GroundLevelPost {
	title: string;
	excerpt: string;
	url: string;
	date: Date;
	cover: string;
}

const API_URL = 'https://groundlevelmm.substack.com/api/v1/posts?limit=12';
const FEED_URL = 'https://groundlevelmm.substack.com/feed';
const HEADERS = { 'User-Agent': 'Mozilla/5.0 (compatible; AstroSSG; +https://meredithmcgee.org)' };

// If the newest post is older than this, pages show one plain link to
// Substack instead of dated posts, so a stuck feed never looks current.
const STALE_AFTER_DAYS = 60;

// Post covers are fetched and saved, but not shown yet. Phase 0 changes
// nothing about how the site looks. The rebuild turns covers on with its
// own rules for which ones to show (SITE-REBUILD.md, section 6).
const SHOW_COVERS = false;

let allPosts: Promise<GroundLevelPost[]> | undefined;

// Source 1: Substack's JSON API.
async function loadFromApi(): Promise<GroundLevelPost[]> {
	const res = await fetch(API_URL, { headers: HEADERS });
	if (!res.ok) throw new Error(`status ${res.status}`);
	const data = await res.json();
	// The API used to return a bare array. It now returns { posts, nextCursor }.
	const list = Array.isArray(data) ? data : (data.posts ?? []);
	if (list.length === 0) throw new Error('no posts in the response');

	return list.map((p: any) => ({
		title: p.title || '',
		excerpt: p.subtitle || p.description || '',
		url: p.canonical_url || '',
		date: new Date(p.post_date),
		cover: p.cover_image || '',
	}));
}

// Source 2: the public RSS feed. Substack refuses the API from some build
// servers, and the feed is the same list of posts in a different format.
async function loadFromFeed(): Promise<GroundLevelPost[]> {
	const res = await fetch(FEED_URL, { headers: HEADERS });
	if (!res.ok) throw new Error(`status ${res.status}`);
	const xml = await res.text();
	const parsed = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' }).parse(xml);
	const items = parsed?.rss?.channel?.item;
	const list = Array.isArray(items) ? items : items ? [items] : [];
	if (list.length === 0) throw new Error('no posts in the feed');

	return list
		.map((item: any) => ({
			title: String(item.title ?? ''),
			excerpt: String(item.description ?? ''),
			url: String(item.link ?? ''),
			date: new Date(item.pubDate),
			cover: String(item.enclosure?.['@_url'] ?? ''),
		}))
		.filter((p) => p.title && p.url && !Number.isNaN(p.date.getTime()))
		.sort((a, b) => b.date.getTime() - a.date.getTime());
}

const reason = (e: unknown) => (e instanceof Error ? e.message : String(e));

async function loadPosts(): Promise<GroundLevelPost[]> {
	let apiError = '';
	try {
		const posts = await loadFromApi();
		console.log(`[Ground Level] ${posts.length} posts loaded live from the Substack API.`);
		return posts;
	} catch (e) {
		apiError = reason(e);
	}

	try {
		const posts = await loadFromFeed();
		console.log(`[Ground Level] ${posts.length} posts loaded live from the RSS feed. (The API failed: ${apiError}.)`);
		return posts;
	} catch (e) {
		console.warn(
			'\n[Ground Level] WARNING: both live sources failed, so this build is using the saved copy in src/data/substack-cache.json.',
			`\n  API: ${apiError}`,
			`\n  RSS feed: ${reason(e)}\n`,
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

export async function getGroundLevelPosts(
	limit: number,
	// Rebuilt pages pass { covers: true } and choose which covers to show
	// with src/lib/covers.ts. Old pages leave it off and get no covers.
	options: { covers?: boolean } = {},
): Promise<{ posts: GroundLevelPost[]; stale: boolean }> {
	allPosts ??= loadPosts();
	const posts = (await allPosts)
		.slice(0, limit)
		.map((p) => (SHOW_COVERS || options.covers ? p : { ...p, cover: '' }));
	const newest = posts[0]?.date.getTime() ?? 0;
	const stale = Date.now() - newest > STALE_AFTER_DAYS * 24 * 60 * 60 * 1000;
	return { posts, stale };
}
