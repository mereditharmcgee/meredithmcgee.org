// Meredith's pieces in The Parabola Papers, for the Writing page.
// One fetch per build. It reads Parabola's public RSS feed and keeps only the
// posts she wrote. The feed holds the newest 20 posts from every author, so
// her older pieces come from the committed saved copy, which is also the
// fallback when the feed cannot be reached (Substack refuses some build
// servers, including the one that deploys this site).
import { XMLParser } from 'fast-xml-parser';
import savedPieces from '../data/parabola-cache.json';

export interface ParabolaPiece {
	title: string;
	excerpt: string;
	url: string;
	date: Date;
}

export const PARABOLA_PAPERS = 'The Parabola Papers';
const FEED_URL = 'https://parabolacenter.substack.com/feed';
// How her name appears in the feed's author field (dc:creator).
const AUTHOR = 'Meredith McGee';
const HEADERS = { 'User-Agent': 'Mozilla/5.0 (compatible; AstroSSG; +https://meredithmcgee.org)' };

let allPieces: Promise<ParabolaPiece[]> | undefined;

const fromSaved = (): ParabolaPiece[] =>
	savedPieces.map((p) => ({ title: p.title, excerpt: p.excerpt, url: p.url, date: new Date(p.date) }));

async function loadFromFeed(): Promise<ParabolaPiece[]> {
	const res = await fetch(FEED_URL, { headers: HEADERS });
	if (!res.ok) throw new Error(`status ${res.status}`);
	const parsed = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' }).parse(await res.text());
	const items = parsed?.rss?.channel?.item;
	const list = Array.isArray(items) ? items : items ? [items] : [];
	if (list.length === 0) throw new Error('no posts in the feed');

	return list
		.filter((item: any) => [item['dc:creator']].flat().some((name) => String(name ?? '').trim() === AUTHOR))
		.map((item: any) => ({
			title: String(item.title ?? '').trim(),
			excerpt: String(item.description ?? '').trim(),
			url: String(item.link ?? ''),
			date: new Date(item.pubDate),
		}))
		.filter((p) => p.title && p.url && !Number.isNaN(p.date.getTime()));
}

async function loadPieces(): Promise<ParabolaPiece[]> {
	const saved = fromSaved();
	let pieces = saved;
	try {
		const live = await loadFromFeed();
		const liveUrls = new Set(live.map((p) => p.url));
		const older = saved.filter((p) => !liveUrls.has(p.url));
		pieces = [...live, ...older];
		console.log(`[Parabola Papers] ${live.length} pieces by ${AUTHOR} loaded live from the RSS feed, plus ${older.length} older from the saved copy.`);
	} catch (e) {
		console.warn(
			'\n[Parabola Papers] WARNING: the live feed failed, so this build is using the saved copy in src/data/parabola-cache.json.',
			`\n  RSS feed: ${e instanceof Error ? e.message : String(e)}\n`,
		);
	}
	return pieces.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function getParabolaPieces(): Promise<ParabolaPiece[]> {
	allPieces ??= loadPieces();
	return allPieces;
}
