// Refreshes the saved copy of Ground Level posts in
// src/data/substack-cache.json.
//
// Why this exists: Substack refuses requests from GitHub's build servers,
// so the deployed site builds from the saved copy. This script runs
// somewhere Substack does answer, and updates that copy when a new post
// is out. It changes one file and nothing else.
//
// Exit codes:
//    0  no new post, nothing changed
//   10  a new post was found and the saved copy was updated
//   20  Substack refused the request or the feed could not be read.
//       Nothing was changed. Do not retry another way.
import { readFileSync, writeFileSync } from 'node:fs';
import { XMLParser } from 'fast-xml-parser';

const FEED_URL = process.env.GROUND_LEVEL_FEED_URL || 'https://groundlevelmm.substack.com/feed';
const CACHE_PATH = new URL('../src/data/substack-cache.json', import.meta.url);
const KEEP = 6;

function stop(message) {
	console.log(`REFUSED: ${message}`);
	console.log('Nothing was changed.');
	process.exit(20);
}

let xml;
try {
	const res = await fetch(FEED_URL, {
		headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AstroSSG; +https://meredithmcgee.org)' },
	});
	if (!res.ok) stop(`the feed answered with status ${res.status}`);
	xml = await res.text();
} catch (e) {
	stop(`the feed could not be reached (${e instanceof Error ? e.message : e})`);
}

let feedPosts;
try {
	const parsed = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' }).parse(xml);
	const items = parsed?.rss?.channel?.item;
	const list = Array.isArray(items) ? items : items ? [items] : [];
	feedPosts = list
		.map((item) => ({
			title: String(item.title ?? ''),
			excerpt: String(item.description ?? ''),
			url: String(item.link ?? ''),
			date: new Date(item.pubDate),
			cover: String(item.enclosure?.['@_url'] ?? ''),
		}))
		.filter((p) => p.title && p.url.startsWith('https://groundlevelmm.substack.com/') && !Number.isNaN(p.date.getTime()))
		.sort((a, b) => b.date - a.date);
} catch (e) {
	stop(`the feed could not be read (${e instanceof Error ? e.message : e})`);
}
if (feedPosts.length === 0) stop('the feed had no posts in it');

const saved = JSON.parse(readFileSync(CACHE_PATH, 'utf8'));
const savedUrls = new Set(saved.map((p) => p.url));
const newestSaved = Math.max(...saved.map((p) => new Date(p.date).getTime()));

// A post counts as new only if it is not saved yet and is newer than
// everything saved. Edits to old posts are left alone.
const fresh = feedPosts.filter((p) => !savedUrls.has(p.url) && p.date.getTime() > newestSaved);

if (fresh.length === 0) {
	console.log(`NO CHANGE: the newest post is still "${saved[0].title}".`);
	process.exit(0);
}

const updated = [...fresh.map((p) => ({ ...p, date: p.date.toISOString() })), ...saved].slice(0, KEEP);
writeFileSync(CACHE_PATH, JSON.stringify(updated, null, 2) + '\n');

console.log(`UPDATED: ${fresh.length} new post${fresh.length === 1 ? '' : 's'} saved.`);
for (const p of fresh) console.log(`  ${p.date.toISOString().slice(0, 10)}  ${p.title}`);
process.exit(10);
