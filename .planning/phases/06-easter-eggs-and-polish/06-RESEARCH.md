# Phase 6: Easter Eggs and Polish — Research

**Phase:** 06-easter-eggs-and-polish
**Researched:** 2026-03-01
**Objective:** What do I need to know to plan this phase well?

---

## What This Phase Actually Is

Phase 6 adds three distinct Easter egg interactions on top of a complete design system. No new pages. No layout changes. No content restructuring. The entire surface area of change is:

1. **Ember click interaction** — wrapping "Ember" text in both `index.astro` and `about.astro` with a clickable element that triggers a photo popup and gold particle burst. Escalates on 3+ clicks to a sillier photo with a caption.
2. **About page footnotes** — 2-3 annotated phrases in `about.astro` gain tooltip popups on click/tap.
3. **Hidden footer message** — a nearly invisible line of text in `Footer.astro` that reveals on hover/tap.

All three must respect `prefers-reduced-motion` and work on touch. None may require hover as the only trigger.

---

## Codebase Audit: What Exists

### Where "Ember" Appears

There are three "Ember" occurrences across two pages:

**`src/pages/index.astro` — line 26:**
```
...a black lab named Ember who is scientifically proven to reduce my stress.
```
The text is inside a single `<p class="intro-copy">` element. "Ember" is not currently wrapped in anything; it's inline prose.

**`src/pages/about.astro` — line 43:**
```
I also got Ember during college, a black lab who has been my best friend ever since.
```
Inside `<p>` in `.essay-body`.

**`src/pages/about.astro` — line 74:**
```
I live with my partner, K, and Ember (the aforementioned black lab) in Boston.
```
Inside `<p>` in `.essay-body`.

To make each "Ember" clickable, the implementation must wrap each occurrence in a `<span class="ember-trigger">` (or similar). Since these are in `.astro` source files with static text, this is a simple text edit — no dynamic content involved.

### Photo Assets

Currently in `public/`:
- `family-photo.jpg` — exists, contains Ember alongside Meredith and K. This is the only Ember photo currently available.
- No solo Ember photo exists yet.

Per CONTEXT.md: placeholder images are acceptable during development. The user will supply `public/ember.jpg` (normal photo) and `public/ember-silly.jpg` (silly photo) before launch. During development, a placeholder strategy is needed — either use `family-photo.jpg` as a stand-in, or create a minimal placeholder (a colored rectangle with an "Ember placeholder" label via an inline SVG or a CSS-styled div).

### Existing Motion/Accessibility Infrastructure

**`src/components/BaseHead.astro`** already checks `prefers-reduced-motion` at script level:
```javascript
function initAnimations() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced) {
    // ... sets up IntersectionObserver for scroll animations
  }
}
document.addEventListener('astro:page-load', initAnimations);
```
This is the established project pattern: check at the top of any initialization function before running any animation. Phase 6 scripts must follow this same pattern.

**`src/styles/global.css`** already has:
```css
@keyframes fadeRise {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .will-animate {
    opacity: 1;
    transform: none;
  }
  .will-animate.is-visible {
    animation: none;
  }
}
```
A custom `@keyframes floatUp` for the Ember photo dismissal and a `@keyframes particleFade` for particles will follow the same CSS animation pattern and need matching `@media (prefers-reduced-motion: reduce)` overrides.

### Existing Click Event Pattern

**`src/components/Header.astro`** shows the project's vanilla JS pattern:
```javascript
const toggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

toggle?.addEventListener('click', () => {
  const isOpen = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!isOpen));
  navLinks?.classList.toggle('open');
});
```
Key points: direct `querySelector`, optional chaining (`?.`), no framework, no library. Phase 6 JS should match this style exactly.

### Existing CSS Color Tokens (Current Values After Phase 5)

```css
--color-dark: #2d3a1e;
--color-medium: #5a6e3c;
--color-light: #9baa7c;
--color-gold: #d4b968;
--color-cream: #ece6d0;
--color-cream-light: #f7f4ec;
--color-white: #ffffff;
--color-dark-overlay: rgba(45, 58, 30, 0.95);
--color-text-muted: rgba(236, 230, 208, 0.6);
```

Ember particles use `--color-gold` (`#d4b968`). Footnote tooltips use cream/gold tones. Footer hidden message uses a very low opacity of `--color-cream` as the hidden state.

### Existing Component Architecture

Every interactive component in the project is a self-contained `.astro` file with scoped `<style>` and a `<script>` block. There are no React islands or JavaScript framework components. There is no shared JS utility module — scripts are inline per-component. Phase 6 should continue this pattern.

**View Transitions:** `BaseHead.astro` already includes `<ViewTransitions />` from Astro, which means page navigation uses client-side transitions. Any JS initialized on `astro:page-load` (the established pattern) will re-run on each navigation. The Ember click handler and footnote handlers must be registered via `document.addEventListener('astro:page-load', ...)` so they work after View Transition navigations, not just on initial load.

### `about.astro` Essay Body Candidates for Footnotes

The full About essay text has been read. Good candidate phrases for footnote annotations (per the warm-and-understated tone brief):

- **"competing in Division I track and field, throwing the hammer"** — a specific, surprising biographical detail that warrants a brief aside ("the hammer throw requires more patience than it looks — and much more equipment than I could fit in a dorm room" or similar)
- **"studied how people actually experience legal cannabis markets"** — could have a footnote pointing to Ground Level as where this continues
- **"a Substack about cannabis, public health, and the gap between policy and practice"** — could link the footnote more personally to why she started it
- **"building the first gender-inclusive housing at my college"** — warm aside about what Lavender Lane became

Claude picks the exact phrases and drafts the aside text during execution. The research job is to confirm the phrases exist and are good candidates. They are.

### Footer Structure

`src/components/Footer.astro` contains:
```html
<div class="footer-bottom">
  <p>&copy; {currentYear} Meredith McGee. All rights reserved.</p>
</div>
```
The hidden message would go after this line, inside `.footer-bottom` or directly below it, still within the `<footer>`. It would use very low contrast (`color: rgba(236, 230, 208, 0.08)` or similar — matching `--color-dark` background so it's effectively invisible) with a transition to full contrast on `:hover` and a `click` event listener to reveal on tap.

---

## Key Technical Decisions to Make During Planning

### 1. Ember Click: How to Wrap the Trigger Text

The "Ember" text is inline prose in `.astro` source files. The simplest approach is a direct edit to both files:

```html
<!-- Before -->
a black lab named Ember who is...

<!-- After -->
a black lab named <span class="ember-trigger" tabindex="0" role="button" aria-label="Click to meet Ember">Ember</span> who is...
```

The `tabindex="0"` and `role="button"` are needed for keyboard accessibility. The `aria-label` lets screen readers announce the purpose without just reading "Ember." The CSS on `.ember-trigger` will add the gold dotted underline and `cursor: pointer`.

**Alternative: A reusable Astro component.** An `<EmberTrigger>` component could encapsulate all styling and behavior in one place, imported into both `index.astro` and `about.astro`. This is cleaner for the JS (one script block, one class), but adds one new file. Either works; the component approach is slightly more organized for this case since the same behavior appears in three places.

**Recommendation for planning:** Create a self-contained `src/components/EmberClick.astro` component that wraps the trigger logic and also injects the popup overlay into the page. Import it in both `index.astro` and `about.astro` around each "Ember" occurrence. The three `<span>` elements in the DOM can all be found via `document.querySelectorAll('.ember-trigger')` and share one event handler setup.

### 2. Ember Click: Photo Popup Positioning

The popup photo needs to appear "near the click point." Since "Ember" appears inline in long prose paragraphs, the popup cannot be a sibling of the trigger element in the normal flow (it would push content down). It must be absolutely positioned relative to the viewport or a fixed ancestor.

**Best approach:** A single shared overlay element injected once at the `<body>` level, positioned `fixed` so it appears near the click coordinates without affecting document flow. The JS captures `event.clientX` and `event.clientY`, then positions the overlay near that point — offset up and left to avoid going off-screen.

Edge cases to handle:
- Click near right edge: position popup to the left of the click
- Click near bottom: position popup above the click
- Mobile tap: same coordinates via touch events (`event.touches[0].clientX`)

The popup photo is an `<img>` tag pointing to `/ember.jpg` (or placeholder during development), enclosed in a fixed-positioned `<div>` with `z-index` above the header (which is `z-index: 1000`, so popup needs `z-index: 1001` or higher).

### 3. Ember Particle Animation: CSS vs. JS

CONTEXT.md specifies: "CSS animation, no JS animation library." Particles are created via JS (each particle is a dynamically created DOM element) but animated via CSS.

**Implementation approach:**
1. JS creates 6-8 `<span>` elements with class `ember-particle` and appends them to the overlay or body.
2. Each particle gets random inline styles for direction (a random angle translated into `--dx` and `--dy` CSS custom property values on the element itself, or randomized transform values set inline).
3. CSS `@keyframes` defines the fade + float animation; particles play it immediately on append.
4. After the animation duration, JS removes the particle elements via a `animationend` event listener or a `setTimeout`.

```css
@keyframes particleBurst {
  0%   { opacity: 1; transform: translate(0, 0) scale(1); }
  100% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(0.3); }
}

.ember-particle {
  position: fixed;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-gold);
  pointer-events: none;
  animation: particleBurst 0.8s ease-out forwards;
  z-index: 1002;
}
```

Each particle's `--dx` and `--dy` are set inline by JS to random values (e.g., `Math.random() * 80 - 40` pixels in x, `Math.random() * -80 - 20` pixels in y — biased upward).

**Reduced motion:** When `prefers-reduced-motion` is true, skip creating particle elements entirely. The photo can still appear (static, no float-up animation).

### 4. Ember Click: Click Counter and Escalation

The CONTEXT.md decision is: after 3 or more clicks, show a different, sillier photo with a caption. This requires a click counter scoped to the current page visit (not persisted across sessions — no localStorage needed, just a module-level variable).

```javascript
let emberClickCount = 0;

document.querySelectorAll('.ember-trigger').forEach(trigger => {
  trigger.addEventListener('click', (e) => {
    emberClickCount++;
    const isSilly = emberClickCount >= 3;
    showEmberPopup(e.clientX, e.clientY, isSilly);
  });
});
```

The `showEmberPopup` function switches between `/ember.jpg` and `/ember-silly.jpg` based on `isSilly`, and conditionally shows a caption element.

Caption rotation: CONTEXT.md suggests rotating among "she says hi", "good girl", "best dog". A simple array and modulo:
```javascript
const captions = ['she says hi', 'good girl', 'best dog'];
const caption = captions[(emberClickCount - 3) % captions.length];
```

### 5. Photo Dismissal Animation

CONTEXT.md: "Photo gently floats upward while fading out... Whimsical, not abrupt."

A CSS `@keyframes floatDismiss` on the popup container:
```css
@keyframes floatDismiss {
  0%   { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-40px); }
}

.ember-popup.dismissing {
  animation: floatDismiss 0.6s ease-in forwards;
}
```

JS adds the `.dismissing` class on a timer or on a second click. `animationend` event listener removes the popup element from the DOM.

**Reduced motion:** If `prefers-reduced-motion` is true, set `display: none` directly (no animation).

### 6. About Page Footnotes: Tooltip Approach

2-3 phrases in `about.astro` get annotated. Each annotated phrase is wrapped in a `<span class="footnote-trigger" data-aside="...">` element. The aside content lives in the `data-aside` attribute. On click, JS creates (or reveals) a tooltip element near the trigger.

**Positioning choices:**
- **Absolute within `.essay-body`:** Simpler positioning math, but requires `.essay-body` to be `position: relative`. The tooltip position relative to the trigger text would use `getBoundingClientRect()` to find the trigger's position, then offset within the scrolled document.
- **Fixed to viewport:** Simpler for mobile. Position near tap point.

**Recommendation:** Fixed positioning (same approach as Ember popup), derived from `event.clientX / clientY`. One tooltip element shared across all triggers, updated content on each click.

```javascript
const tooltip = document.getElementById('footnote-tooltip');

document.querySelectorAll('.footnote-trigger').forEach(trigger => {
  trigger.addEventListener('click', (e) => {
    tooltip.textContent = trigger.dataset.aside;
    tooltip.style.left = `${e.clientX}px`;
    tooltip.style.top = `${e.clientY - 60}px`;  // above click point
    tooltip.classList.add('visible');
    e.stopPropagation();
  });
});

document.addEventListener('click', () => {
  tooltip.classList.remove('visible');
});
```

**Dismissal:** Click anywhere else dismisses. The `document.addEventListener('click', ...)` handles this; `e.stopPropagation()` on the trigger click prevents immediate dismissal.

**Reduced motion:** Tooltip shows/hides instantly (no fade transition).

**Accessibility:** The tooltip should have `role="tooltip"` or `role="dialog"`. The trigger should have `aria-describedby` pointing to the tooltip ID when visible. A minimal approach: `role="tooltip"` on the tooltip, `tabindex="0"` on the trigger, and a keyboard handler (`keydown Enter/Space`) to open, `Escape` to close.

### 7. Hidden Footer Message: Technique

CONTEXT.md: "Very low contrast text that becomes full contrast on interaction. Fully hidden — no affordance, no hint."

The cleanest CSS approach: the message sits in the DOM always but with a color nearly identical to the background. On `:hover` (desktop) or programmatic toggle via click (mobile), a class or pseudo-state reveals it.

```html
<p class="footer-secret">made with love, coffee, and a black lab at my feet</p>
```

```css
.footer-secret {
  color: rgba(45, 58, 30, 0.01);  /* essentially invisible on dark bg */
  font-size: 0.7rem;
  margin-top: 0.5rem;
  cursor: default;
  transition: color 0.4s ease;
  user-select: none;
}

.footer-secret:hover,
.footer-secret.revealed {
  color: rgba(236, 230, 208, 0.4);  /* muted but legible */
}
```

JS adds `.revealed` class on `click` event for touch devices. Since `:hover` doesn't work reliably on mobile, the `click` is the touch fallback.

**Exact text:** Claude drafts this during execution, matching the site's warm, personal voice. The example from CONTEXT.md ("made with love, coffee, and a black lab at my feet") is the exact right tone. Claude's discretion per CONTEXT.md.

**Reduced motion:** No animation concern here — the color transition is not motion-sensitive, but the `prefers-reduced-motion` media query should set `transition: none` on the element for completeness. The reveal effect itself (color change) is not animation in the meaningful sense.

### 8. View Transitions Compatibility

Because the site uses Astro's `<ViewTransitions />`, page navigations are client-side and do NOT fire `DOMContentLoaded` again. All Phase 6 JS must be initialized inside `document.addEventListener('astro:page-load', ...)`, not `DOMContentLoaded`. This is the established pattern in `BaseHead.astro` and is critical to get right.

The Ember click counter (`emberClickCount`) should reset on each page load (it's a module-level variable initialized to 0, which will be re-evaluated on each `astro:page-load` since the script re-runs).

---

## Scope Boundaries

### In Scope for Phase 6

- Wrap each "Ember" occurrence in `index.astro` (1) and `about.astro` (2) with a clickable trigger
- Create or extend a component to handle Ember photo popup, particle burst, escalation logic
- Create 2-3 annotated footnote phrases in `about.astro` with tooltip popups
- Add hidden message to `Footer.astro`
- All three interactions fully respect `prefers-reduced-motion`
- All three interactions work on iOS Safari and Android Chrome via tap
- Placeholder images during development; instructions for user to supply real photos

### Out of Scope for Phase 6

- Konami code or keyboard combos (explicitly deferred)
- Contact page post-submit animation (explicitly deferred)
- Sound effects (explicitly excluded)
- New pages, routes, or layout changes
- Changes to existing animations or scroll infrastructure
- Changes to fonts, color tokens, or global CSS (unless adding Phase 6-specific keyframes/classes)

---

## Per-Requirement Notes

**DLGT-01 (Ember click trigger):** Three wrapping edits (`<span class="ember-trigger">` around each "Ember" in index.astro x1 and about.astro x2). One shared interaction layer — either as an `EmberClick.astro` component imported into both pages, or inline scripts with `document.querySelectorAll('.ember-trigger')`. Photo popup (fixed-positioned overlay), particle burst (6-8 CSS-animated dots in gold), escalation on click #3+ (different photo + caption). Gold dotted underline affordance on hover; cursor pointer.

**DLGT-02 (2+ additional micro-delights):** Two interactions: (a) About page footnote tooltips on 2-3 annotated phrases — warm personal asides in cream/gold tooltip cards. (b) Hidden footer message — near-invisible text revealed by hover/tap.

**DLGT-03 (feels personal to Meredith, not generic):** The Ember interaction is inherently personal (her dog, her photos). The footnote content (once drafted) will be specific biographical color that only Meredith could write. The footer message should reference her specific life, not a generic "built with Astro" line. These are implementation-time content decisions; the structural scaffolding makes them possible.

**DLGT-04 (prefers-reduced-motion + touch parity):** Every interaction checks `window.matchMedia('(prefers-reduced-motion: reduce)').matches` before running animations. Animations disabled: particle burst, photo float-up, photo float-dismiss. Static fallbacks: Ember photo still appears (no animation), tooltip shows/hides (no fade), footer message reveals (no transition). Touch parity: all triggers use `click` events (which fire on tap). No hover-only triggers.

---

## Pitfalls Specific to Phase 6

### Pitfall 1: Popup Positioning Going Off-Screen

Positioning a popup at `event.clientX + 20px` without checking viewport edges will cause the popup to overflow on small screens or near-edge clicks. The JS must clamp the position:

```javascript
const POPUP_WIDTH = 200;
const POPUP_HEIGHT = 250;
const x = Math.min(e.clientX + 15, window.innerWidth - POPUP_WIDTH - 15);
const y = Math.max(e.clientY - POPUP_HEIGHT - 15, 80);  // 80 = header height
```

This applies to both the Ember popup and the footnote tooltip.

### Pitfall 2: Particles Left in DOM on Fast Repeated Clicks

If the user clicks Ember rapidly, particles from earlier bursts may not have finished their `animationend` cleanup before new particles are added. This is not a crash risk, but can leave stale DOM nodes. A simple fix: track a maximum particle cap (no more than 30 at once), or clear all existing particles before creating new ones.

### Pitfall 3: Tooltip Visible During Page Transition

If a footnote tooltip is open when the user navigates away via View Transitions, the tooltip may persist on the next page's DOM. Ensure the `astro:page-load` handler cleans up any open tooltips and resets the Ember click counter:

```javascript
document.addEventListener('astro:page-load', () => {
  // Reset state
  emberClickCount = 0;
  document.getElementById('footnote-tooltip')?.classList.remove('visible');

  // Re-initialize handlers
  initEmberClick();
  initFootnotes();
});
```

### Pitfall 4: The Footer Hidden Message Getting Indexed by Search Engines

A near-invisible text element with `color: rgba(45, 58, 30, 0.01)` is still in the DOM and technically readable by crawlers. Google's guidelines flag hidden text as a potential spam signal. To avoid this, the element should NOT contain keywords — it should be a personal, human message that would read as clearly human if a crawler found it. "made with love, coffee, and a black lab at my feet" passes this test. Do not hide something keyword-dense.

Also consider: `user-select: none` so accidental text selection doesn't reveal it visually during normal browsing. But do NOT use `aria-hidden="true"` — if a screen reader user discovers it, they should be able to read it.

### Pitfall 5: Ember Photo `<img>` Without Dimensions Causing Layout Shift

A dynamically inserted `<img>` without explicit `width` and `height` attributes will cause layout shift as it loads, which is visually jarring. The popup container should have fixed dimensions:

```css
.ember-popup {
  width: 200px;
  height: 200px;
  overflow: hidden;
}
.ember-popup img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

This ensures the popup area is sized before the image loads, preventing any layout jank.

### Pitfall 6: `astro:page-load` Script Scope vs. Inline `<script>`

In Astro, inline `<script>` blocks in `.astro` components are module-scoped and bundled. When a component is used multiple times on a page (e.g., if `EmberClick.astro` were ever duplicated), the script runs once per component instance. For the Ember interaction, a single script that queries all `.ember-trigger` elements via `querySelectorAll` is more reliable than per-instance setup. Keep the JS in one place.

### Pitfall 7: Touch vs. Click Event Handling

On iOS Safari, `click` events fire on touch (with a 300ms delay in older versions). Modern iOS Safari (12+) with `touch-action: manipulation` on the element eliminates this delay without needing `touchstart`. Add `touch-action: manipulation` to `.ember-trigger`, `.footnote-trigger`, and `.footer-secret` elements. This is a small CSS addition that improves touch response on all these interactive elements.

---

## Files That Will Change

| File | Change Type | What Changes |
|------|-------------|--------------|
| `src/pages/index.astro` | MODIFY | Wrap "Ember" in `<span class="ember-trigger">` |
| `src/pages/about.astro` | MODIFY | Wrap 2x "Ember" + 2-3 footnote phrases |
| `src/components/Footer.astro` | MODIFY | Add hidden message element |
| `src/components/EmberClick.astro` | CREATE | Ember popup overlay, particle script, and scoped CSS |
| `src/styles/global.css` | MODIFY (possibly) | New `@keyframes` for particles and float-dismiss if not scoped to component |
| `public/ember.jpg` | USER-PROVIDED | Placeholder during development; real photo from user before launch |
| `public/ember-silly.jpg` | USER-PROVIDED | Placeholder during development; real photo from user before launch |

If footnote tooltip logic is complex enough to warrant its own component, `src/components/FootnoteTooltip.astro` may also be created. If not, it can live as an inline script in `about.astro`.

---

## Plan Shape Recommendation

Phase 6 splits into two logical plans:

**06-01: Ember Click Interaction (DLGT-01)**
- Create `src/components/EmberClick.astro` with popup overlay, particle system, escalation logic
- Edit `index.astro` to wrap "Ember" and import the component
- Edit `about.astro` to wrap both "Ember" occurrences
- Full reduced-motion and touch testing

**06-02: Footnotes and Footer (DLGT-02, DLGT-03, DLGT-04)**
- Draft footnote phrases and aside text for About essay
- Wrap 2-3 phrases in `about.astro` with tooltip triggers
- Build tooltip popup (shared tooltip element, positioned near click)
- Add hidden message to `Footer.astro`
- Verify all three new interactions on mobile and with `prefers-reduced-motion`

This split works because the Ember interaction is the most complex (photo assets, particle system, escalation state) and benefits from being developed and verified in isolation before the simpler footnote/footer work begins.

---

## Confidence Levels

| Area | Confidence | Notes |
|------|------------|-------|
| Wrapping "Ember" text in trigger spans | HIGH | Direct static text edit; two files, three locations |
| Fixed-position popup overlay | HIGH | Standard pattern; viewport clamping is well-understood |
| CSS-animated particles (no library) | HIGH | Custom properties for direction + CSS keyframes |
| Click counter and escalation logic | HIGH | Simple JS counter with modulo for caption rotation |
| `astro:page-load` re-initialization | HIGH | Established pattern in BaseHead; must apply here too |
| Footnote tooltip positioning | MEDIUM | Viewport clamping needed; mobile tap coordinates may need touch event handling |
| Footer hidden message reveal | HIGH | Low-contrast CSS + transition; well-understood technique |
| Placeholder image strategy | HIGH | Use a CSS-only placeholder (colored div) to avoid blocking on real photos |
| prefers-reduced-motion compliance | HIGH | Known pattern; check at top of each init function |
| Touch parity (iOS/Android) | MEDIUM | `click` fires on tap in modern browsers; `touch-action: manipulation` reduces delay |
| Photo placeholder before user supplies images | HIGH | CSS-styled div with dimensions prevents layout shift; swap to `<img>` when real photos land |

---

## Pre-Planning Verifications Completed

1. **All three "Ember" text occurrences located.** index.astro line 26 (one), about.astro line 43 (one), about.astro line 74 (one). All are in plain prose `<p>` elements — no existing wrappers to work around.

2. **`prefers-reduced-motion` check pattern confirmed.** `BaseHead.astro` uses `window.matchMedia('(prefers-reduced-motion: reduce)').matches` in a function called from `astro:page-load`. This exact pattern should be used in Phase 6 scripts.

3. **No solo Ember photo exists.** `family-photo.jpg` is the only Ember image in `public/`. A placeholder approach is required for development. The plan must specify what placeholder to use so development is not blocked.

4. **`astro:page-load` is the correct lifecycle event.** `DOMContentLoaded` does not re-fire after View Transition navigations. All Phase 6 script init must use `astro:page-load`. This is confirmed by the BaseHead animation code and the Phase 5 STATE.md decision log.

5. **Footer z-index stack.** The Header is `z-index: 1000`. Any popup element (Ember photo, tooltip) needs `z-index: 1001` or higher to appear over the header if the trigger is near the top of the page (unlikely, but defensively important).

6. **About essay footnote candidate phrases confirmed.** The full essay has been read. Good candidates exist: the hammer throw detail, the Lavender Lane founding moment, the cannabis research, the Ground Level founding. Claude picks and drafts during execution.

7. **Footer.astro DOM structure confirmed.** The hidden message can be added inside `.footer-bottom` after the copyright `<p>`, or as a separate element at the very end of `.footer-content`. Placement below the copyright line in `.footer-bottom` keeps it within the visual footprint of the footer without adding new layout.

---

*Phase: 06-easter-eggs-and-polish*
*Research completed: 2026-03-01*
