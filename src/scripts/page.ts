// Small helpers every page script shares.

// Runs setup on each page load, including the client-side navigations that
// Astro's router does, and cancels the previous page's listeners first.
// Pass the signal to addEventListener so listeners clean themselves up.
export function onPage(setup: (signal: AbortSignal) => void) {
	let controller: AbortController | undefined;
	document.addEventListener('astro:page-load', () => {
		controller?.abort();
		controller = new AbortController();
		setup(controller.signal);
	});
}

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
