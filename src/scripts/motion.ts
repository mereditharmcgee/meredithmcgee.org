// Site-wide motion: sections that rise in as they scroll into view (.rv),
// numbers that count up when they appear ([data-count]), and smooth jumps
// to a section on the same page ([data-jump]). Without JavaScript, or with
// reduced motion, everything simply shows.
import { onPage, reducedMotion } from './page';

function countUp(el: HTMLElement) {
	if (el.dataset.done) return;
	el.dataset.done = '1';
	const to = Number(el.dataset.count);
	const pre = el.dataset.prefix || '';
	const suf = el.dataset.suffix || '';
	const fin = el.dataset.final || pre + to + suf;
	const dur = 1100;
	let t0: number | null = null;
	function frame(t: number) {
		if (t0 === null) t0 = t;
		const p = Math.min(1, (t - t0) / dur);
		const e = 1 - Math.pow(1 - p, 3);
		el.textContent = p < 1 ? pre + Math.round(to * e) + suf : fin;
		if (p < 1) requestAnimationFrame(frame);
	}
	requestAnimationFrame(frame);
}

onPage((signal) => {
	document.addEventListener(
		'click',
		(e) => {
			const link = (e.target as Element | null)?.closest?.('a[data-jump]');
			if (!link) return;
			const target = document.getElementById(link.getAttribute('data-jump') || '');
			if (!target) return;
			e.preventDefault();
			target.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' });
		},
		{ signal },
	);

	if (!('IntersectionObserver' in window) || reducedMotion()) return;

	const io = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				const el = entry.target as HTMLElement;
				io.unobserve(el);
				el.classList.remove('wait');
				const counters = Array.from(el.querySelectorAll<HTMLElement>('[data-count]'));
				if (el.hasAttribute('data-count')) counters.push(el);
				counters.forEach(countUp);
			});
		},
		{ rootMargin: '0px 0px -8% 0px' },
	);
	signal.addEventListener('abort', () => io.disconnect());

	// Only sections below the first screen wait. Anything already in view stays put.
	document.querySelectorAll<HTMLElement>('.rv').forEach((el) => {
		if (el.getBoundingClientRect().top > window.innerHeight * 0.9) {
			el.classList.add('wait');
			io.observe(el);
		}
	});
});
