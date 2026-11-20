// The RateMyPlace logic model. Loose pieces sort themselves into five
// columns as the reader scrolls through the steps. The layout math is
// ported from the approved preview as it was. The content comes from
// src/data/logicModel.ts by way of data attributes on the stage.
import { onPage, reducedMotion } from './page';

const SOLID = ['#5f0c27', '#b18d70', '#6b4a35', '#969e68', '#464c20'];
const PERM = [7, 2, 12, 5, 10, 0, 14, 3, 9, 6, 1, 13, 4];

function buildWalk(stage: HTMLElement, stepsEl: HTMLElement, signal: AbortSignal) {
	const COLS: string[] = JSON.parse(stage.dataset.cols || '[]');
	const CHIPS: [number, string][] = JSON.parse(stage.dataset.chips || '[]');
	const steps = Array.from(stepsEl.querySelectorAll<HTMLElement>('.step'));
	let step = -1;
	const els: HTMLElement[] = [];
	const heads: HTMLElement[] = [];

	function rnd(i: number, k: number) {
		const x = Math.sin((i + 1) * 12.9898 + k * 78.233) * 43758.5453;
		return x - Math.floor(x);
	}
	function mk(cls: string, text?: string) {
		const d = document.createElement('div');
		d.className = cls;
		if (text != null) d.textContent = text;
		stage.appendChild(d);
		return d;
	}
	const rail = mk('rail');
	const fill = mk('railfill');
	COLS.forEach((c, i) => {
		const h = mk('head', c);
		h.setAttribute('data-c', String(i));
		heads.push(h);
	});
	CHIPS.forEach((c) => {
		const e = mk('chip', c[1]);
		e.setAttribute('data-c', String(c[0]));
		els.push(e);
	});
	function bands(dir: string, ends: number[]) {
		const a: string[] = [];
		let p = 0;
		ends.forEach((e, i) => {
			a.push(SOLID[i] + ' ' + p + 'px ' + Math.round(e) + 'px');
			p = Math.round(e);
		});
		return 'linear-gradient(to ' + dir + ',' + a.join(',') + ')';
	}
	const gap = mk('chip gap', stage.dataset.gap || '');
	const count = document.createElement('p');
	count.className = 'count';
	stage.parentNode!.appendChild(count);

	function place(el: HTMLElement, x: number, y: number, w: number, h: number) {
		el.style.transform = 'translate(' + Math.round(x) + 'px,' + Math.round(y) + 'px)';
		el.style.width = Math.round(w) + 'px';
		el.style.height = Math.round(h) + 'px';
	}

	function render() {
		const W = stage.clientWidth;
		if (!W) return;
		const fitH = function (w: number, cls: string, min: number) {
			const m = document.createElement('div');
			m.className = cls;
			m.style.cssText = 'position:absolute;visibility:hidden;left:0;top:0;height:auto;transform:none;transition:none;width:' + w + 'px';
			stage.appendChild(m);
			let h = min;
			CHIPS.forEach((c) => {
				m.textContent = c[1];
				h = Math.max(h, Math.ceil(m.getBoundingClientRect().height) + 2);
			});
			m.remove();
			return h;
		};
		const mobile = W < 560;
		const s = step < 0 ? 0 : step;
		const act = s >= 1 && s <= 5 ? s - 1 : -1;
		const rowsIn = [0, 0, 0, 0, 0];
		const idx: number[] = [];
		CHIPS.forEach((c) => {
			idx.push(rowsIn[c[0]]++);
		});
		let H: number;
		if (!mobile) {
			const pad = 18, gapX = 12, colW = (W - 2 * pad - 4 * gapX) / 5, headY = 18, railY = 58, y0 = 74, ch = fitH(colW, 'chip', 64), cg = 10, mapH = y0 + 4 * (ch + cg), trayY = mapH + 6;
			H = trayY + 13 + pad;
			const cellW = (W - 2 * pad) / 5, cellH = (H - 2 * pad) / 3;
			let loose = 0;
			stage.style.height = H + 'px';
			heads.forEach((h, c) => {
				h.style.width = colW + 'px';
				h.style.transform = 'translate(' + Math.round(pad + c * (colW + gapX)) + 'px,' + headY + 'px)';
				h.className = 'head ' + (s === 0 ? '' : s === 6 || c < act ? 'done' : c === act ? 'active' : 'future');
			});
			rail.style.width = W - 2 * pad + 'px';
			rail.style.height = '3px';
			rail.style.transform = 'translate(' + pad + 'px,' + railY + 'px)';
			rail.className = 'rail' + (s > 0 ? ' show' : '');
			fill.style.height = '3px';
			fill.style.transform = 'translate(' + pad + 'px,' + railY + 'px)';
			fill.style.background = bands('right', [0, 1, 2, 3, 4].map((c) => (c < 4 ? (c + 1) * (colW + gapX) - gapX / 2 : W - 2 * pad)));
			fill.style.width = (s === 0 ? 0 : s === 6 ? W - 2 * pad : Math.round((act + 1) * (colW + gapX) - gapX)) + 'px';
			els.forEach((el, i) => {
				const c = CHIPS[i][0], r = idx[i];
				el.style.transitionDelay = (s > 0 && c === act ? r * 70 : 0) + 'ms';
				if (s === 0) {
					const p = PERM[i], cx = p % 5, cy = Math.floor(p / 5);
					place(el, pad + cx * cellW + (rnd(i, 1) - 0.5) * 14 + (cellW - colW) / 2, pad + cy * cellH + rnd(i, 2) * (cellH - ch), colW, ch);
					el.className = 'chip';
				} else if (s === 6 || c <= act) {
					place(el, pad + c * (colW + gapX), y0 + r * (ch + cg), colW, ch);
					el.className = 'chip ' + (c === act ? 'active' : 'placed');
				} else {
					place(el, pad + loose++ * 21, trayY, 13, 13);
					el.className = 'chip tray';
				}
			});
			place(gap, pad + 4 * (colW + gapX), y0 + 2 * (ch + cg), colW, ch);
		} else {
			const mp = 12, lab = 98, rowH = 36, cw = (W - 2 * mp - lab - 8) / 2, mch = fitH(cw, 'chip', 56), mg = 6;
			let y = 12;
			const ys: number[] = [];
			const expH = function (n: number) {
				return Math.max(rowH, Math.ceil(n / 2) * (mch + mg));
			};
			for (let c = 0; c < 5; c++) {
				ys.push(y);
				y += (c === act ? expH(rowsIn[c]) : rowH) + (c === act ? 8 : 0);
			}
			const endY = y;
			const mapBottom = 12 + 4 * rowH + expH(4) + 8, trayM = mapBottom + 6;
			let looseM = 0;
			const sw = (W - 2 * mp - 10) / 2 - 10, smh = fitH(sw, 'chip sm', 30);
			H = Math.max(trayM + 13 + mp, 20 + 7 * (smh + 10) + smh);
			const srow = (H - 20 - smh) / 6;
			stage.style.height = H + 'px';
			heads.forEach((h, c) => {
				h.style.width = lab - 14 + 'px';
				h.style.transform = 'translate(' + mp + 'px,' + (ys[c] + 7) + 'px)';
				h.className = 'head ' + (s === 0 ? '' : s === 6 || c < act ? 'done' : c === act ? 'active' : 'future');
			});
			const railX = mp + lab - 10;
			rail.style.width = '3px';
			rail.style.height = endY - 12 + 'px';
			rail.style.transform = 'translate(' + railX + 'px,12px)';
			rail.className = 'rail' + (s > 0 ? ' show' : '');
			fill.style.width = '3px';
			fill.style.transform = 'translate(' + railX + 'px,12px)';
			fill.style.background = bands('bottom', [0, 1, 2, 3, 4].map((c) => (c < 4 ? ys[c + 1] : endY) - 12));
			fill.style.height = (s === 0 ? 0 : s === 6 ? endY - 12 : Math.round(ys[act] + expH(rowsIn[act]) - 12)) + 'px';
			els.forEach((el, i) => {
				const c = CHIPS[i][0], r = idx[i];
				el.style.transitionDelay = (s > 0 && c === act ? r * 70 : 0) + 'ms';
				if (s === 0) {
					const q = PERM[i], qx = q % 2, qy = Math.floor(q / 2);
					place(el, mp + qx * (sw + 20) + rnd(i, 1) * 10, 10 + qy * srow + rnd(i, 2) * 3, sw, smh);
					el.className = 'chip sm';
				} else if (c === act) {
					place(el, mp + lab + (r % 2) * (cw + 8), ys[c] + Math.floor(r / 2) * (mch + mg), cw, mch);
					el.className = 'chip active';
				} else if (s === 6 || c < act) {
					place(el, mp + lab + r * 17, ys[c] + 10, 11, 11);
					el.className = 'chip dot';
				} else {
					place(el, mp + looseM++ * 19, trayM, 13, 13);
					el.className = 'chip tray';
				}
			});
			place(gap, mp + lab, endY + 10, W - 2 * mp - lab, mch);
		}
		fill.style.opacity = s === 0 ? '0' : '1';
		gap.className = 'chip gap' + (s === 6 ? ' show' : '');
		let placedN = 0;
		CHIPS.forEach((c) => {
			if (s === 6 || (s > 0 && c[0] <= act)) placedN++;
		});
		count.textContent = s === 0 ? CHIPS.length + ' loose pieces' : placedN + ' of ' + CHIPS.length + ' in place';
	}

	function setStep(n: number) {
		if (n === step) return;
		step = n;
		steps.forEach((el, i) => el.classList.toggle('on', i === n));
		render();
	}
	function pick() {
		if (!stage.clientWidth) return;
		const vh = window.innerHeight, sr = stage.getBoundingClientRect(), mobile = window.innerWidth <= 860;
		const line = mobile ? Math.min(vh * 0.9, sr.bottom + (vh - sr.bottom) * 0.45) : vh * 0.55;
		let n = 0;
		for (let i = 0; i < steps.length; i++) {
			if (steps[i].getBoundingClientRect().top < line) n = i;
		}
		setStep(n);
	}
	let tick = false;
	window.addEventListener(
		'scroll',
		() => {
			if (tick) return;
			tick = true;
			requestAnimationFrame(() => {
				tick = false;
				pick();
			});
		},
		{ passive: true, signal },
	);
	window.addEventListener('resize', () => { render(); pick(); }, { signal });
	if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => render());
	setStep(0);
	return {
		refresh() {
			render();
			pick();
		},
	};
}

onPage((signal) => {
	const stage = document.getElementById('stage');
	const stepsEl = document.getElementById('steps');
	const lm = document.getElementById('logic-model');
	if (!stage || !stepsEl || !lm) return;
	const walk = buildWalk(stage, stepsEl, signal);

	// On How I work the model waits behind a button. It has no size while it
	// is hidden, so it has to lay itself out again once it opens.
	const wrap = document.getElementById('lm-wrap');
	const button = document.getElementById('lm-open');
	function open() {
		if (!wrap || !wrap.hidden) return;
		wrap.hidden = false;
		if (button) {
			button.setAttribute('aria-expanded', 'true');
			if (button.parentElement) button.parentElement.hidden = true;
		}
		requestAnimationFrame(() => walk.refresh());
	}
	button?.addEventListener(
		'click',
		() => {
			open();
			requestAnimationFrame(() => lm.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' }));
		},
		{ signal },
	);

	// A link straight to the model, from the homepage for example, opens it.
	function fromHash() {
		if (location.hash !== '#logic-model' && location.hash !== '#see-it') return;
		open();
		const el = document.getElementById(location.hash.slice(1));
		if (el) requestAnimationFrame(() => { el.scrollIntoView(); walk.refresh(); });
	}
	window.addEventListener('hashchange', fromHash, { signal });
	fromHash();

	// "Skip ahead" jumps to whatever follows the model.
	lm.querySelectorAll<HTMLElement>('[data-skip-next]').forEach((b) => {
		b.addEventListener(
			'click',
			() => {
				const next = lm.nextElementSibling || lm.parentElement?.nextElementSibling;
				if (next) next.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' });
			},
			{ signal },
		);
	});
});
