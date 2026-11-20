// Scroll scenes. The stage stays pinned while short steps scroll past.
// Inside a stage, an element with data-in="k" appears from step k, and an
// element with data-at="k:slot,..." physically moves into the slot with that
// id at step k, animated from where it was. One engine drives every scene on
// the site. Markup comes from src/components/Scene.astro.
import { onPage, reducedMotion } from './page';

interface Scene {
	pick: () => void;
}

let scenes: Scene[] = [];

// Re-reads the scroll position for every scene. Call it after something
// changes which scenes are visible, such as switching a tab.
export function pickScenes() {
	scenes.forEach((s) => s.pick());
}

function build(root: HTMLElement): Scene {
	const stage = root.querySelector<HTMLElement>('.scn')!;
	const steps = Array.from(root.querySelectorAll<HTMLElement>('.steps .step'));
	const ins = Array.from(stage.querySelectorAll<HTMLElement>('[data-in]'));
	const movers = Array.from(stage.querySelectorAll<HTMLElement>('[data-at]')).map((el) => {
		const plan = el
			.getAttribute('data-at')!
			.split(',')
			.map((x) => {
				const p = x.split(':');
				return [Number(p[0]), p[1]] as [number, string];
			})
			.sort((a, b) => a[0] - b[0]);
		return { el, plan };
	});
	let cur = -1;

	function target(m: (typeof movers)[number], n: number) {
		let id = m.plan[0][1];
		m.plan.forEach((p) => {
			if (n >= p[0]) id = p[1];
		});
		return document.getElementById(id);
	}

	function set(n: number, animate: boolean) {
		if (n === cur) return;
		cur = n;
		const moves: { el: HTMLElement; to: HTMLElement; from: DOMRect }[] = [];
		movers.forEach((m) => {
			const to = target(m, n);
			if (to && m.el.parentNode !== to) moves.push({ el: m.el, to, from: m.el.getBoundingClientRect() });
		});
		stage.setAttribute('data-step', String(n));
		steps.forEach((el, i) => el.classList.toggle('on', i === n));
		ins.forEach((el) => {
			const k = Number(el.getAttribute('data-in'));
			el.classList.toggle('on', n >= k);
			el.classList.toggle('now', n === k);
		});
		moves.forEach((x) => x.to.appendChild(x.el));
		// With reduced motion the state still changes, but nothing slides.
		if (!animate || reducedMotion()) return;
		moves.forEach((x) => {
			const el = x.el;
			const r = el.getBoundingClientRect();
			const dx = x.from.left - r.left;
			const dy = x.from.top - r.top;
			if (!x.from.width) return;
			el.style.transition = 'none';
			el.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
			void el.offsetWidth;
			el.style.transition = '';
			el.style.transform = '';
			el.classList.add('moving');
			setTimeout(() => el.classList.remove('moving'), 800);
		});
	}

	function pick() {
		// A scene in a hidden tab does nothing until its tab opens.
		if (!root.offsetParent || !stage.clientWidth) return;
		const vh = window.innerHeight;
		const sr = stage.getBoundingClientRect();
		const mobile = window.innerWidth <= 860;
		const line = mobile ? Math.min(vh * 0.9, sr.bottom + (vh - sr.bottom) * 0.45) : vh * 0.55;
		let n = 0;
		for (let i = 0; i < steps.length; i++) {
			if (steps[i].getBoundingClientRect().top < line) n = i;
		}
		set(n, true);
	}

	set(0, false);
	return { pick };
}

onPage((signal) => {
	scenes = Array.from(document.querySelectorAll<HTMLElement>('[data-scene]')).map(build);
	if (!scenes.length) return;
	let ticking = false;
	window.addEventListener(
		'scroll',
		() => {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(() => {
				ticking = false;
				pickScenes();
			});
		},
		{ passive: true, signal },
	);
	window.addEventListener('resize', pickScenes, { signal });
	requestAnimationFrame(pickScenes);
});
