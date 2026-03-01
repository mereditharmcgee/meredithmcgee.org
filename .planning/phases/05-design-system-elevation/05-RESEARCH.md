# Phase 5: Design System Elevation — Research

**Phase:** 05-design-system-elevation
**Researched:** 2026-03-01
**Objective:** What do I need to know to plan this phase well?

---

## What This Phase Actually Is

Phase 5 is the layer that makes everything built in Phases 1-4 feel intentional rather than functional. The pages exist and are correctly structured. This phase does seven distinct things:

1. **Evolve the color palette** — warmer, richer, more organic. Sage and forest tones replace the current military-olive lean. No complete reinvention.
2. **Refine typography** — tune Playfair Display weights, sizes, and letter-spacing for headings; tune Source Sans 3 body weight and line-height for readability on dark backgrounds.
3. **Improve spacing and whitespace** — section padding, vertical rhythm, per-page breathing room adjustments.
4. **Add scroll-triggered entrance animations** — fade + slight rise (~20-30px), 400-600ms, `prefers-reduced-motion` respected.
5. **Polish hover states and page transitions** — extend existing CSS transitions to new elements; add any page-level transitions Astro supports without added complexity.
6. **Verify and fix mobile responsiveness** — confirm all six pages work on phones; tap targets, text size, nav behavior.
7. **SEO and OG metadata** — OG image, sitemap correctness, per-page meta descriptions, canonical URLs, remove "MPH" from SITE_TITLE.

These are seven distinct areas but share a single file as the center of gravity: `src/styles/global.css`. The plan should treat that file as the keystone — almost every other change flows from the `:root` token updates there.

---

## Codebase Audit: What Exists

### The Current Color Tokens (in `global.css` `:root`)

```css
--color-dark: #3d4a2a;          /* Main bg — dark olive green */
--color-medium: #6b7c4c;        /* Section bg — medium olive */
--color-light: #a8b18f;         /* Section bg — light olive (used on About, Contact) */
--color-gold: #d4c98e;          /* Headings, links, buttons */
--color-cream: #e8e4d0;         /* Body text */
--color-cream-light: #f5f3eb;   /* Hover, highlights */
--color-white: #ffffff;
--color-dark-overlay: rgba(61, 74, 42, 0.95);  /* Header blur bg */

/* DEAD TOKENS — Three Audiences era, lines 18-22 */
--color-journalist: #d4c98e;
--color-staffer: #7fb3b3;
--color-researcher: #b39ddb;
--highlight-transition: 350ms ease;
```

The dead Three Audiences tokens are still in the file and should be removed. They're unused since ThreeAudiences was deleted in Phase 1, but no cleanup pass has run yet.

### Current Font Import

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Source+Sans+3:wght@300;400;500;600&display=swap');
```

Both fonts load all the weights that will be needed. No new font imports are required.

### Current Typography Scale

```css
body { font-size: 18px; line-height: 1.7; }  /* mobile: 16px */
h1   { font-size: clamp(2.5rem, 5vw, 4rem); }
h2   { font-size: clamp(2rem, 4vw, 3rem); }
h3   { font-size: clamp(1.5rem, 3vw, 2rem); }
h4   { font-size: 1.25rem; }
all headings: font-weight: 500; color: var(--color-gold); line-height: 1.2;
```

The scale is reasonable but h1-h2 max sizes are large (4rem, 3rem) for a personal site with intimate, essay-style content. The heading weight (500) is the correct Playfair Display middle-ground — neither too thin nor too heavy.

### Current Section Backgrounds in Use

| Page | Sections | Backgrounds |
|------|----------|-------------|
| index.astro | Intro, Working On, Selected Work | `bg-dark bg-pattern`, `bg-medium`, `bg-dark` |
| about.astro | Heading, Essay | `bg-dark bg-pattern`, `bg-light` |
| work.astro | Hero, Work List | `bg-dark bg-pattern`, `bg-dark` |
| work/archive.astro | Hero, Archive List | `bg-dark bg-pattern`, `bg-dark` |
| contact.astro | Hero, Content | `bg-dark bg-pattern`, `bg-light` |
| ground-level.astro | Intro, Posts | `bg-dark bg-pattern`, `bg-dark` |

Key observations:
- `bg-light` only appears on About (essay body) and Contact (content section). The `.bg-light` overrides for headings and body text target `var(--color-dark)`, which works on the lighter olive surface.
- `bg-medium` is used only in the homepage "Working On" section for contrast between two `bg-dark` sections.
- `bg-pattern` (botanical SVG overlay, 5% opacity) appears only on hero/intro sections of every page.
- `.bg-dark` is the dominant background across all pages — it IS the site's color.

### The Botanical Pattern

The `.bg-pattern::before` SVG is inline in global.css. It's a 4-point star/snowflake shape at `fill-opacity: 0.05` using `--color-medium`. At 5% opacity it's extremely subtle — barely visible. The decision on whether to keep, evolve, or remove it is left to implementation.

### Animation Infrastructure

Zero animation infrastructure exists. No `motion` library installed. No CSS keyframe animations beyond the mobile nav slide-in. No Intersection Observer usage anywhere. This is fully greenfield.

The existing CSS transitions are:
- `a { transition: color 0.3s ease; }` — global links
- `.btn { transition: all 0.3s ease; }` — buttons
- `.nav-links a { transition: color 0.3s ease; }` — nav items
- `.nav-links a::after { transition: width 0.3s ease; }` — active underline
- `.nav-links { transition: right 0.3s ease; }` — mobile slide-in

### BaseHead and OG Setup

`BaseHead.astro` has complete OG metadata wiring — title, description, image, canonical URL, Twitter card. The default OG image falls back to `/meredith-headshot.jpg` (a string path to `public/`). The canonical URL is computed from `Astro.site` + `Astro.url.pathname`.

Two issues to fix:
1. The `<link rel="preload">` tags reference Atkinson fonts that exist in `public/fonts/` (both woff files are present) but are NEVER referenced in any CSS `@font-face` rule or `font-family` declaration. The site uses Google Fonts (Playfair Display + Source Sans 3) loaded via `@import` in `global.css`. The Atkinson preload tags trigger a browser request for fonts that are never used — they are dead weight and should be removed.
2. The `image` prop defaults to `/meredith-headshot.jpg` — this is fine for OG but the image was designed for portrait use, not social-card use. A custom OG card image would improve social sharing previews.

### consts.ts

```typescript
export const SITE_TITLE = 'Meredith McGee, MPH';         // needs "MPH" removed
export const SITE_DESCRIPTION = 'Public health writer, evaluator, and researcher. Connecting community needs and data through writing.';
export const SUBSTACK_FEED_URL = 'https://meredithwritespublichealth.substack.com/feed';
export const SUBSTACK_URL = 'https://meredithmcgee.substack.com';
```

SITE_TITLE change is user-decided: remove ", MPH" → `'Meredith McGee'`.

### astro.config.mjs

```javascript
export default defineConfig({
  site: 'https://meredithmcgee.org',
  integrations: [mdx(), sitemap()],
  redirects: { '/portfolio': '/work', '/resume': '/about', '/blog': '/ground-level' },
});
```

`@astrojs/sitemap` is already installed and integrated. The sitemap will auto-generate from routes. The only action needed: verify the generated sitemap includes the six live routes and excludes removed routes, then confirm the `<link rel="sitemap">` in BaseHead is pointing to the right file (it currently references `/sitemap-index.xml`, which is what the sitemap integration generates).

### Per-Page Meta Descriptions (Current State)

| Page | Current meta description |
|------|--------------------------|
| index.astro | "Public health writer, evaluator, and researcher based in Boston." |
| about.astro | "Learn about Meredith McGee, MPH — a public health writer, researcher, and evaluator driven by community needs and meaningful impact." |
| work.astro | "A selection of research, writing, grants, and evaluation work from Meredith McGee, MPH." |
| work/archive.astro | "A complete list of selected projects, publications, and work from Meredith McGee, MPH." |
| contact.astro | "Get in touch with Meredith McGee. I'd love to hear from you." |
| ground-level.astro | "Ground Level is Meredith McGee's Substack about cannabis, public health, and the gap between policy and practice." |

All four pages with "MPH" need updating. The about/work/archive descriptions also feel corporate. Per-page rewrites are implementation-time decisions.

### Mobile Responsiveness (Current State)

The site has one breakpoint at `768px`. The Header's mobile nav is already implemented and functional. Section padding reduces from 5rem to 3rem on mobile. Container padding reduces from 2rem to 1.5rem.

Known mobile gaps to assess during planning:
- The `.btn` tap target (`0.75rem 2rem` padding) — minimum recommended tap target is 44x44px; needs verification
- Hero photos (`max-width: 350px` desktop, `280px` mobile) — fine
- Typography — `clamp()` is already in use, which handles fluid scaling well
- Nav — mobile hamburger is functional

### Package Versions

```json
{
  "astro": "^5.16.8",
  "fast-xml-parser": "^5.4.1",
  "@astrojs/sitemap": "^3.6.1",
  "@astrojs/mdx": "^4.3.13"
}
```

`motion` is NOT installed. Current version from npm registry: `12.34.3` (latest). Note: previous research documents referenced `^10.x` as current, but the actual current version is `12.x`. This matters for API verification — the `inView` API pattern from research notes should be verified against v12 docs before implementation.

---

## Key Technical Decisions to Make During Planning

### 1. Animation Library: motion vs. CSS-Only

**The situation:** Research recommends the `motion` npm package (vanilla JS, framework-agnostic, ~4kb core) for scroll-triggered entrance animations via its `inView` API. The library is at v12.x (not v10.x as the previous research note assumed).

**For planning:** The plan should decide whether to use `motion` or use pure CSS `@starting-style` + `Intersection Observer`. The trade-off:

- **`motion` library (install `npm install motion`):** Cleaner declarative API, handles reduced-motion check internally, stagger animations. Cost: 4-15kb added to bundle, extra `npm install` step, API needs verification against v12.
- **Native CSS approach:** Zero dependency, no bundle cost, widely supported in 2026 (Chrome 117+, Firefox 129+, Safari 17.5+). Cost: more verbose, manual `@media (prefers-reduced-motion: reduce)` handling, Intersection Observer setup in vanilla JS.

**Recommendation:** Given the project's "no added complexity" preference and the fact that motion's version changed significantly since research was written, use a native CSS + Intersection Observer approach with vanilla JS in Astro `<script>` blocks. The animation needs here are simple (fade + y-shift, 1-2 elements per section). This avoids an npm install with an unverified v12 API.

If `motion` is chosen anyway, the install command is `npm install motion` and the API to use is:
```javascript
import { inView, animate } from "motion";
inView(".animate-on-scroll", ({ target }) => {
  animate(target, { opacity: [0, 1], y: [20, 0] }, { duration: 0.5, easing: "ease-out" });
});
```
Verify this API against https://motion.dev/docs before writing.

### 2. Scroll Animation Target Strategy

**The choice:** Animate entire sections, or animate individual headings and cards within sections?

Animating **entire sections** is simpler (one Intersection Observer per section) but results in large content blocks popping in. It feels closer to a "page load" than a "scroll" animation.

Animating **individual elements within sections** (headings first, then cards/paragraphs staggered) is more refined but requires more observers and more CSS classes.

**Recommendation for planning:** Hybrid. Section headings and intro paragraphs animate as a unit (one observer, one trigger). Cards and post items animate with a small stagger (each card gets a delay of `index * 100ms`). This gives the "content settling into place" feel described in CONTEXT.md without over-engineering.

**Practical targets per page:**
- Homepage Beat 1 (intro): h1 + hero photo + intro paragraph → one animation unit
- Homepage Beat 2 (working on): h2 + each SubstackFeed post item staggered
- Homepage Beat 3 (selected work): h2 + each WorkCard staggered
- About: Heading section → one unit; essay paragraphs → do NOT animate (reading should not be interrupted by settling text)
- Work/Archive: Hero → one unit; each WorkCard staggered
- Ground Level: Hero → one unit; each post staggered
- Contact: Hero → one unit; contact content block → one unit

### 3. OG Image Approach

**Options:**
- **Static single image in `public/`:** Create one designed card (e.g., 1200x630px, Meredith's name in Playfair Display on the evolved palette background, site URL). Use it as the default for all pages. Low maintenance.
- **Per-page static images:** Design a separate OG card for each of the 6 pages. More differentiated social sharing. Higher up-front cost, zero maintenance cost afterward.
- **Text-on-color generated at build time:** Astro has no built-in image generation. Would require a library like `satori` or `@resvg/resvg-js`. Adds complexity; overkill for this site.

**Recommendation:** One static designed card (option 1), stored in `public/og-image.jpg`. Design it with Playfair Display "Meredith McGee" on the evolved dark palette background. All six pages use it via the BaseHead default. If per-page differentiation is wanted later, it's a one-line change per page to pass a different `image` prop to `<BaseHead>`. This is the lowest maintenance path.

**The image does not exist yet.** The current default OG image is `meredith-headshot.jpg` — a portrait photo, not a designed social card. Creating the OG image file is implementation work.

### 4. `.bg-pattern` Decision

The botanical SVG pattern is currently at 5% opacity — functionally invisible. Keep it if evolving (increase to 7-8% so it's faintly visible), or remove it to clean up the CSS. This is left to Claude's discretion per CONTEXT.md.

**Planning consideration:** If the pattern is kept and evolved, the SVG fill color in the data URI should be updated when the palette tokens change. The current fill references `#6b7c4c` (the old `--color-medium` value) hardcoded in the data URI, not via CSS variable (CSS variables can't be used inside SVG data URIs in `::before` pseudo-elements). This is a known limitation — updating the pattern means re-encoding the SVG with the new hex color.

### 5. `prefers-reduced-motion` Implementation

All animations must be absent when this user preference is set. There are two correct patterns:

**Pattern A — CSS media query (recommended for CSS-driven animations):**
```css
@keyframes fadeRise {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.animate-on-scroll {
  animation: fadeRise 0.5s ease-out both;
}

@media (prefers-reduced-motion: reduce) {
  .animate-on-scroll {
    animation: none;
  }
}
```

**Pattern B — JS check before animating (for Intersection Observer approach):**
```javascript
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReduced) {
  // set up observers and animate
}
```

The plan should use Pattern B when animations are triggered by Intersection Observer — it's one check, early, that prevents all observers from ever firing. Pattern A is needed as a fallback for any CSS-only animations.

---

## Scope Boundaries

### In Scope for Phase 5

- Remove dead Three Audiences CSS tokens from `global.css`
- Remove Atkinson font preload links from `BaseHead.astro` (they reference fonts that don't exist)
- Evolve color tokens in `:root` (darker/richer dark, warmer golds, muted text token)
- Refine typography: heading weights, letter-spacing, body size/line-height on dark backgrounds
- Improve section padding and whitespace consistency across all 6 pages
- Add scroll-triggered entrance animations on key sections of all 6 pages
- Polish hover states on WorkCard titles, SubstackFeed post titles, and links
- Add page transitions if Astro supports them without added complexity (View Transitions API)
- Mobile responsiveness audit and fixes across all 6 pages
- Update SITE_TITLE in `consts.ts` (remove "MPH")
- Rewrite per-page meta descriptions (remove "MPH", improve voice)
- Create OG image static file in `public/og-image.jpg`
- Update BaseHead to use the new OG image as default
- Verify sitemap output includes all 6 live pages
- Verify canonical URL is correct for all pages
- DSGN-07: Voice rule audit pass on all pages (already satisfied by Phase 3/4 work, but verify)

### Out of Scope for Phase 5

- Easter eggs (Phase 6)
- Ember click interaction (Phase 6)
- New pages or new routes
- Changing the overall page structure or section layout
- Switching fonts (Playfair Display + Source Sans 3 stay)
- Dark mode (explicitly anti-feature)
- Work data content changes (placeholder content stays until user provides final)
- Formspree form changes

---

## Per-Requirement Notes

**DSGN-01 (color palette evolved):** Update `:root` tokens in `global.css`. The test is visual: side-by-side comparison should read as "same site, better palette" not "different site." Key changes: move `--color-dark` toward a richer, deeper forest green (less gray-green, more forest); shift `--color-medium` toward sage; add `--color-gold-warm` amber accent; add `--color-text-muted` for dates and metadata.

**DSGN-02 (typography refined):** Three adjustments in `global.css`: (a) add `letter-spacing: -0.02em` to h1/h2 in Playfair Display for a more editorial feel, (b) increase body line-height from 1.7 to 1.75-1.8 for dark-background readability, (c) use `font-optical-sizing: auto` on body. Also refine the `.work-card__category` styling and the SubstackFeed `time` element styling, which currently look like afterthoughts.

**DSGN-03 (generous whitespace):** Audit current section padding per page. The work/archive pages use `2.5rem 0 3rem` for the list section — this is tight. All pages should target `4rem 0 5rem` minimum for content sections, `5rem 0 3rem` for hero sections. The intro-copy container width (currently `max-width: 800px`) is already good for reading line-length.

**DSGN-04 (scroll animations):** Greenfield work. Implementation approach: add `.animate-on-scroll` class to target elements; in a `<script>` block in a shared location (BaseHead or a new `AnimationInit.astro` component), set up Intersection Observer with `prefers-reduced-motion` check. Set elements to `opacity: 0; transform: translateY(20px)` initially, transition to visible state on intersection.

**DSGN-05 (hover states and page transitions):** Extend hover transitions on WorkCard titles (currently `0.3s ease` — already good) and nav items (already has underline animation). Astro supports the View Transitions API natively via `<ViewTransitions />` component — this gives page-to-page fade transitions with zero JS overhead. This is the "page transition" to use.

**DSGN-06 (mobile responsiveness):** Full audit pass. Key things to check: (a) tap target size on `.btn` buttons — current padding `0.75rem 2rem` should produce adequate height, but verify; (b) the About page essay body on narrow screens; (c) WorkCard layout on mobile; (d) SubstackFeed post layout on mobile; (e) Contact form on mobile.

**DSGN-07 (voice rules):** Pages already went through Phase 3/4 voice review. This is a verification pass, not a rewrite. Check for any voice violations introduced during Phase 5 implementation (e.g., animation class names leaking into visible text, or meta description copy slipping).

**SEO-01 (OG images):** Create `public/og-image.jpg` (1200x630px). Update `BaseHead.astro` default image from `'/meredith-headshot.jpg'` to `'/og-image.jpg'`. Test via browser dev tools + og:image validator or social media preview tool.

**SEO-02 (sitemap):** `@astrojs/sitemap` is already installed and integrated in `astro.config.mjs`. Run `npm run build` and check `dist/sitemap-index.xml` and `dist/sitemap-0.xml`. Confirm: 6 pages present (`/`, `/about`, `/work`, `/work/archive`, `/contact`, `/ground-level`), no orphaned old routes.

**SEO-03 (canonical URLs):** `BaseHead.astro` already computes `canonicalURL = new URL(Astro.url.pathname, Astro.site)` and emits `<link rel="canonical">`. This is already correct. Verification only — check that `Astro.site` is set in `astro.config.mjs` (it is: `https://meredithmcgee.org`). No code changes needed unless the verification reveals issues.

---

## Pitfalls Specific to Phase 5

### Pitfall 1: Animating to a Flash of Invisible Content

If elements are set to `opacity: 0` in CSS but the Intersection Observer fires after the JS loads (which it always does), elements below the fold that the user never scrolls to will be invisible permanently if the observer fails.

**Prevention:** Set initial `opacity: 0; transform: translateY(20px)` via a JS-added class, not in the base CSS. Only elements that have been observed (or that already started in view) should animate. Elements that are already in the viewport on page load should either (a) animate immediately on load, or (b) start visible. A simple pattern: add the `.will-animate` class via JS, so SSR/no-JS visitors always see content fully visible.

### Pitfall 2: Over-Animating the About Page Essay

The About page is a continuous reading experience. Animating individual paragraphs as the user scrolls through the essay would be jarring — content would appear as they're trying to read. The essay body should not have scroll-triggered animations. Only the section heading and the hero area above the essay should animate.

### Pitfall 3: CSS Variable Updates Not Propagating to SVG Pattern

The `.bg-pattern::before` SVG data URI hardcodes `#6b7c4c` (the old `--color-medium` value). When the palette tokens update, this SVG will not update automatically — CSS variables cannot be used inside `url()` data URIs in pseudo-elements. Remember to either regenerate the SVG data URI with the new color, or remove the pattern entirely.

### Pitfall 4: The Atkinson Font Preloads in BaseHead

`BaseHead.astro` currently has:
```html
<link rel="preload" href="/fonts/atkinson-regular.woff" as="font" type="font/woff" crossorigin />
<link rel="preload" href="/fonts/atkinson-bold.woff" as="font" type="font/woff" crossorigin />
```

The font files DO exist in `public/fonts/` (confirmed). However, no CSS anywhere references `font-family: Atkinson` or any `@font-face` rule for these fonts. The site uses Playfair Display + Source Sans 3 from Google Fonts, not Atkinson. These preload tags cause the browser to fetch font files it never uses — wasted network requests on every page load. They should be removed in Phase 5 when touching `BaseHead.astro` for the OG image update.

### Pitfall 5: Astro View Transitions Breaking Scroll Position

Astro's `<ViewTransitions />` component (which enables page-to-page transitions) can sometimes reset scroll position unexpectedly on mobile Safari. This is a known edge case. If View Transitions are added, test on iOS Safari specifically before marking the phase complete.

### Pitfall 6: Evolving the Palette Too Far from the Current Site

CONTEXT.md is explicit: "visitors who saw the old version should recognize it." The palette shift should be in warmth and richness, not in hue. Going from olive-green to forest-green stays in the family. Going from olive-green to terracotta would break the visual continuity. The `--color-dark` token is the identity of the site — keep it in the deep green family.

---

## Plan Shape Recommendation

Phase 5 splits naturally into three plans based on what blocks what:

**05-01: Design Tokens and Typography**
- Remove dead Three Audiences tokens
- Evolve `:root` color variables
- Refine typography scale and body text
- Remove Atkinson font preloads from BaseHead
- Update SITE_TITLE ("MPH" removal)
- First milestone that can be visually verified in browser

**05-02: Spacing, Animations, and Mobile**
- Section padding adjustments across all 6 pages
- Scroll-triggered entrance animations (Intersection Observer + CSS)
- Hover state refinements
- Astro View Transitions (if chosen)
- Mobile responsiveness audit and fixes

**05-03: SEO, OG Image, and Meta**
- Create OG image file (`public/og-image.jpg`)
- Update BaseHead default OG image path
- Rewrite per-page meta descriptions
- Verify sitemap output
- Verify canonical URLs

This split is sequential: 05-01 first (tokens must be settled before spacing work), then 05-02 (layout work before SEO which should reflect final design), then 05-03 (SEO caps the phase).

---

## Confidence Levels

| Area | Confidence | Notes |
|------|------------|-------|
| Color token update approach | HIGH | Direct `:root` edit in `global.css`; all pages inherit automatically |
| Typography refinements | HIGH | Well-understood CSS properties on existing font stack |
| Spacing improvements | HIGH | Standard padding/margin CSS work |
| Scroll animations (CSS + Intersection Observer) | HIGH | Native browser APIs, no library needed |
| `motion` library v12 API | MEDIUM | Version jumped significantly from research notes (v10 → v12); verify before using |
| `prefers-reduced-motion` patterns | HIGH | W3C standard, well-documented |
| Astro View Transitions | MEDIUM | Available in Astro 5.x as `<ViewTransitions />` component; mobile Safari edge cases known |
| Sitemap correctness | HIGH | `@astrojs/sitemap` handles this automatically; just verify output |
| OG image creation | LOW (implementation) | Designing the image itself requires visual judgment outside of code; the code wiring is simple |
| Canonical URL correctness | HIGH | Already implemented correctly in BaseHead; just needs verification |
| `.bg-pattern` SVG data URI update | MEDIUM | Easy if keeping the pattern, but easy to forget that CSS variables don't work inside data URIs |

---

## Files That Will Change

| File | Change Type | What Changes |
|------|-------------|--------------|
| `src/styles/global.css` | MODIFY | Remove dead tokens, evolve `:root` colors, refine typography, add animation CSS |
| `src/components/BaseHead.astro` | MODIFY | Remove Atkinson preloads, update default OG image path |
| `src/consts.ts` | MODIFY | SITE_TITLE: remove "MPH" |
| `src/pages/index.astro` | MODIFY | Add animation classes, spacing tweaks, mobile fixes |
| `src/pages/about.astro` | MODIFY | Animation classes (hero only), spacing, meta description |
| `src/pages/work.astro` | MODIFY | Animation classes, spacing, meta description |
| `src/pages/work/archive.astro` | MODIFY | Animation classes, spacing, meta description |
| `src/pages/contact.astro` | MODIFY | Animation classes, spacing, mobile tap target check, meta description |
| `src/pages/ground-level.astro` | MODIFY | Animation classes, spacing, meta description |
| `src/components/WorkCard.astro` | MODIFY | Typography/spacing refinements |
| `src/components/SubstackFeed.astro` | MODIFY | Date styling refinement (muted text token), spacing |
| `public/og-image.jpg` | CREATE | New designed OG social card image |
| `astro.config.mjs` | VERIFY ONLY | Confirm sitemap integration is correct; no changes expected |

---

## Pre-Research Verifications (Completed)

These were verified as part of the research process:

1. **Sitemap is correct.** `npm run build` ran successfully. `dist/sitemap-0.xml` contains exactly the 6 expected routes: `/`, `/about/`, `/contact/`, `/ground-level/`, `/work/`, `/work/archive/`. No orphaned old routes appear. `@astrojs/sitemap` is working correctly — SEO-02 will just require a verification pass, not a fix.

2. **Atkinson font files exist but are unused.** `public/fonts/` contains both `atkinson-regular.woff` and `atkinson-bold.woff`. However, no CSS anywhere uses these fonts. The `@import` in `global.css` loads Playfair Display + Source Sans 3 from Google Fonts CDN only. The preload tags in `BaseHead.astro` are dead requests that should be removed.

3. **`meredith-headshot.jpg` is the current OG default.** The file exists in `public/`. As a portrait photo of Meredith, it will not display well as a 1200x630 social card — it will be cropped in unexpected ways by LinkedIn and Twitter. A purpose-designed OG image should be created.

4. **Build is healthy.** No errors, warnings are minimal (the Atkinson preload is among them). The site builds in ~1s with RSS fetching working correctly.

---

*Phase: 05-design-system-elevation*
*Research completed: 2026-03-01*
