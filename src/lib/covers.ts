// Which Ground Level post covers the site shows, and at what size.
//
// A cover shows only when it is hosted on Substack's own upload bucket,
// which means Meredith made or uploaded it. A cover that points anywhere
// else (the stock photos Substack offers come from images.unsplash.com) is
// treated as no cover, and the page shows a title card instead.

// To turn one post's cover off, add its full post URL here.
export const HIDDEN_COVERS: string[] = [];

const BUCKET = 'substack-post-media.s3.amazonaws.com';
const CDN = 'substackcdn.com';

// Substack's image server sends the original at full size, sometimes several
// megabytes. Asking it for a resized copy keeps the pages light.
const RESIZE = 'w_1000,c_limit,f_auto,q_auto:good,fl_progressive:steep';

// Returns the cover URL to use for a post, or '' for a title card.
export function coverFor(post: { url: string; cover: string }): string {
	if (!post.cover || HIDDEN_COVERS.includes(post.url)) return '';
	let original = '';
	try {
		const url = new URL(post.cover);
		if (url.hostname === BUCKET) {
			original = post.cover;
		} else if (url.hostname === CDN) {
			// The server's own links wrap the original address after the last "/".
			const inner = decodeURIComponent(post.cover.slice(post.cover.lastIndexOf('/') + 1));
			if (new URL(inner).hostname === BUCKET) original = inner;
		}
	} catch {
		return '';
	}
	if (!original) return '';
	return `https://${CDN}/image/fetch/${RESIZE}/${encodeURIComponent(original)}`;
}
