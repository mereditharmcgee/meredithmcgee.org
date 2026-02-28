# Stack Research

**Domain:** Personal website rebuild — Astro 5.x SSG with RSS feed display, typography refinement, animations, Easter eggs
**Researched:** 2026-02-28
**Confidence:** MEDIUM overall (Context7/WebSearch unavailable; findings based on existing project analysis, official docs knowledge, and training data with explicit confidence flagging)

---

## Existing Stack (Keep — No Change Needed)

| Technology | Version | Purpose | Status |
|------------|---------|---------|--------|
| Astro | ^5.16.8 | Static site generation, file-based routing | Keep as-is |
| @astrojs/mdx | ^4.3.13 | MDX support for content | Keep, low use |
| @astrojs/rss | ^4.0.14 | RSS feed generation (outbound) | Keep for site's own RSS |
| @astrojs/sitemap | ^3.6.1 | Sitemap generation | Keep as-is |
| sharp | ^0.34.3 | Image optimization | Keep as-is |

The existing stack is clean and correctly minimal. No framework bloat. All additions are additive.

---

## Recommended Stack (New Additions)

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Astro | ^5.16.8 | SSG framework | Already installed; no change needed |
| Tailwind CSS | 4.x | Utility-first styling | NOT recommended (see below) |
| Native CSS custom properties | N/A | Design tokens, color palette | Already in use in global.css; extend it, don't replace it |

**Decision: Do NOT add Tailwind.** The existing site uses hand-crafted CSS with custom properties. Migrating to Tailwind mid-project creates churn with no benefit. The CSS architecture is already good. Extend global.css.

### Supporting Libraries — RSS Feed

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| None (native fetch) | N/A | Fetch Substack RSS at build time | PRIMARY approach — use Astro's built-in fetch in `.astro` frontmatter |
| fast-xml-parser | ^4.x | Parse RSS XML to JS object | Use if native DOMParser is unavailable in Astro's Node runtime |

**Rationale for RSS approach:**

Astro SSG allows `fetch()` calls in component frontmatter at build time. Substack exposes a standard RSS/Atom feed at `https://meredithwritespublichealth.substack.com/feed`. The pattern is:

```javascript
// In any .astro file frontmatter
const response = await fetch('https://meredithwritespublichealth.substack.com/feed');
const xml = await response.text();
// Parse XML with fast-xml-parser or DOMParser
```

**Confidence: MEDIUM.** Astro's build-time fetch is documented and stable in 5.x. Substack's RSS feed URL pattern (`/feed`) is a Substack convention confirmed in their help docs. The XML parsing approach is well-established.

**Why not `@astrojs/rss` for inbound feeds:** `@astrojs/rss` is for *generating* an RSS feed for your own site. It does not parse external feeds. The project already uses it for the site's own RSS output and should keep it for that purpose.

**Why not a dedicated RSS parsing library like `rss-parser`:**
`rss-parser` (npm) is a Node.js-first library that works well in SSR contexts. In Astro SSG at build time, it works too, but `fast-xml-parser` is lighter, more actively maintained, and handles the Substack Atom/RSS hybrid correctly. However, if the feed XML is simple enough, a regex or manual XML parse is acceptable for a 3-6 item display. Start with `fast-xml-parser`; fall back to manual parsing only if the feed structure is unusual.

**Confidence for fast-xml-parser: MEDIUM.** Version 4.x is current as of early 2026 per npm package history. It is the most-downloaded XML parser in the npm ecosystem for this use case.

### Supporting Libraries — Animations

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Native CSS transitions | N/A | Hover states, button transitions | Already in use — extend for cards, nav |
| @web-animations/polyfill | N/A | NOT needed | Web Animations API is widely supported; skip polyfill |
| Motion One (motion) | ^10.x | Scroll-triggered entrance animations, Easter egg trigger animations | Use for scroll-into-view animations and JavaScript-driven interactions |
| AOS (Animate on Scroll) | ^2.3.4 | Alternative to Motion for scroll entrance | Lower confidence; see alternatives below |

**Primary animation recommendation: Extend existing CSS + add Motion (motion) selectively.**

The site already uses `transition: all 0.3s ease` correctly on hover states. The pattern works. For the new requirements:

1. **Page transitions and hover refinements:** Pure CSS. Add `transition` to new elements; add `@starting-style` for native CSS entry animations where browser support is sufficient (Chrome 117+, Firefox 129+, Safari 17.5+). For a personal site in 2026, this coverage is acceptable.

2. **Scroll-triggered entrance animations:** Use Motion (formerly Motion One, the successor to Framer Motion's vanilla JS layer). It is framework-agnostic, works in Astro `.astro` files via `<script>` tags, is tiny (4kb for the core), and is the standard for non-React scroll animations in 2026.

```javascript
// In an Astro component <script> block
import { animate, inView } from "motion";

inView(".fade-in", ({ target }) => {
  animate(target, { opacity: [0, 1], y: [20, 0] }, { duration: 0.5 });
});
```

**Confidence: MEDIUM.** Motion (the library formerly at `@motionone/animation`, now published as `motion`) is the successor to Framer Motion's vanilla JS API. As of 2025, the npm package is `motion`. The exact API may have changed slightly from training data; verify against `motion` npm page before implementing.

3. **Easter egg interactions:** Vanilla JavaScript inside Astro `<script>` tags. No library needed. Click handlers, CSS class toggles, and CSS keyframe animations handle the Ember popup and scatter effects cleanly.

**Do NOT use:** GSAP (requires paid license for many features; overkill for a personal site), Framer Motion (React-only dependency; site has no React islands), Three.js (no 3D needed), AOS (works but is unmaintained since 2022 and uses a different paradigm than Motion).

### Supporting Libraries — Typography

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Google Fonts (existing import) | N/A | Playfair Display + Source Sans 3 | Already loaded; refine weights and usage |
| Lora (Google Fonts) | N/A | Optional body text upgrade | Consider as Source Sans 3 replacement for warmer prose feel |

**Typography recommendation: Evolve what exists, don't replace it.**

The existing font stack (Playfair Display serif + Source Sans 3 sans) is a good editorial pairing. The problem is not the fonts — it's the weight, sizing, and usage patterns. Specifically:

- Playfair Display at weight 500 for headings is correct. Add weight 400 italic for pull quotes and the intro paragraph on the homepage.
- Source Sans 3 at weight 300/400 for body is correct but feels light at 18px on dark backgrounds. Increase body to 400 base, use 300 only for captions/metadata.
- The existing Google Fonts import already includes the needed weights. No new fonts need to be added to the import.

**If a body font upgrade is desired:** Replace Source Sans 3 with Lora (Google Fonts). Lora is a serif designed for long-form reading, warm and editorial, pairs exceptionally well with Playfair Display, and gives the "personal essay" feel the About page needs. This is an evolution, not a replacement of direction.

**If keeping Source Sans 3:** Consider adding font-feature-settings for ligatures and optical sizing. CSS `font-optical-sizing: auto` was added to major browsers in 2022 and is a free quality improvement.

**Confidence: HIGH for keeping Playfair Display. MEDIUM for Lora recommendation (personal taste but well-supported pairing logic). LOW for specific weight recommendations without testing on the actual dark-background palette.**

### Supporting Libraries — Color Palette Refinement

No library needed. Color work is in `global.css` custom properties. The recommendation is to evolve the tokens.

**Current tokens:**
```css
--color-dark: #3d4a2a;      /* Dark olive green — body background */
--color-medium: #6b7c4c;    /* Medium olive — section backgrounds */
--color-light: #a8b18f;     /* Light olive — light section bg */
--color-gold: #d4c98e;      /* Gold/cream — headings, links */
--color-cream: #e8e4d0;     /* Cream — body text */
--color-cream-light: #f5f3eb; /* Light cream — hover, highlights */
```

**Proposed palette evolution:**

The current palette is already good. The "elevation" needed is contrast and warmth tuning, not hue replacement.

```css
/* Evolved tokens — proposed values, verify visually */
--color-dark: #2d3820;        /* Slightly deeper, richer green-black */
--color-dark-surface: #3d4a2a; /* Existing dark, now used for card surfaces */
--color-medium: #5a6b3e;      /* Slightly richer/more saturated */
--color-light: #98a87e;       /* Slightly deeper for better contrast on white text */
--color-gold: #c8bb7a;        /* Slightly less washed-out, richer gold */
--color-gold-warm: #d4a853;   /* New warm amber/gold for accents */
--color-cream: #ede8d8;       /* Slightly warmer cream */
--color-cream-light: #f8f5ec; /* Lighter, airier */
--color-text-muted: #9ba87f;  /* New — for dates, captions, metadata */
```

**Key additions:** A `--color-gold-warm` (amber rather than yellow-gold) and `--color-text-muted` for the RSS post dates and card metadata. These are the two most visually needed additions for the new pages.

**Confidence: LOW on specific hex values (need visual testing). HIGH on the pattern (add 1-2 new tokens rather than replace the palette).**

---

## Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| TypeScript | Type safety | Already configured in tsconfig.json; use it for RSS parsing types |
| Astro dev server | Local development | `npm run dev` — no change |
| GitHub Actions (existing) | CI/CD to GitHub Pages | Already configured; no change needed |

---

## Installation

```bash
# RSS parsing (only if native fetch + manual XML handling is insufficient)
npm install fast-xml-parser

# Scroll animations + Easter egg JS animations
npm install motion
```

No other new dependencies. The rest is CSS-only work or uses Astro's built-in capabilities.

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Native fetch + fast-xml-parser for RSS | `rss-parser` npm package | If the project moves to SSR (Cloudflare/Node adapter); rss-parser has better SSR story |
| Motion (motion npm) for scroll animations | AOS (Animate On Scroll) | AOS is simpler but unmaintained since 2022; avoid |
| Motion for scroll animations | GSAP | GSAP only if complex timeline sequences are needed; overkill here |
| CSS @starting-style for entry animations | Motion for all animations | Use @starting-style where browser support is sufficient; saves JS |
| Extending global.css | Tailwind CSS | Tailwind only if starting a new project from scratch; migrating mid-project wastes time |
| Playfair Display (keep) + Lora (optional swap) | DM Serif Display, Cormorant Garant | These are valid; Lora is warmer. Cormorant is more elegant/thin — valid alternative if Lora feels too heavy |
| Google Fonts CDN import (existing) | Self-hosted fonts | Self-host only if performance becomes a priority (reduces external requests). Current approach is fine for personal site |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Framer Motion | Requires React; site has no React islands | Motion (vanilla JS API from the same team) |
| GSAP | Paid license for business use; API complexity overkill for 2-3 animations | Motion or CSS keyframes |
| AOS | Unmaintained since 2022; intersection observer polyfill pattern is outdated | Motion's `inView` API |
| React / Preact islands | No interactivity need that requires a component framework; Easter eggs work with vanilla JS | Astro `<script>` blocks with vanilla JS |
| Tailwind CSS | Mid-project migration creates CSS churn; existing CSS architecture is already good | Extend global.css CSS custom properties |
| `rss-parser` npm package | Adds 25kb+ to build; has a quirk with Atom feeds (which Substack may emit) | Native fetch + fast-xml-parser |
| Font Awesome or icon libraries | Overkill for a personal site with minimal icon needs | Inline SVGs (already used in ThreeAudiences.astro) |
| Headless CMS (Sanity, Contentful) | Out of scope; content is file-based | Astro content collections (existing) |

---

## Stack Patterns by Variant

**For RSS display (build-time fetch):**
- Fetch Substack feed in `.astro` frontmatter
- Parse with fast-xml-parser
- Extract: `title`, `pubDate`, `description` (first 150 chars), `link`
- Render as static HTML cards
- No client-side JavaScript needed for RSS display

**For scroll animations:**
- Import Motion's `inView` in a `<script>` tag in the relevant layout or page component
- Target elements with a `.fade-in` or `.animate-on-scroll` class
- Keep animations subtle: `opacity 0→1`, `y 15→0`, `duration 0.4s`, `easing ease-out`
- Stagger multiple cards using Motion's `delay` option

**For Easter eggs (Ember click):**
- Vanilla JS click handler on any element containing the word "Ember"
- CSS keyframe animation for the popup/scatter effect
- A small dog photo stored in `/public/`
- No library needed

**For Easter eggs (hidden page/mode):**
- Create a secret route, e.g., `/ember` or use a Konami code listener
- The "hidden page" pattern is standard Astro (just a page file in `src/pages/`)
- Trigger via Easter egg interaction elsewhere on the site

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| astro ^5.16.8 | fast-xml-parser ^4.x | No conflicts; fast-xml-parser is a pure JS utility |
| astro ^5.16.8 | motion ^10.x | No conflicts; Motion is a vanilla JS library |
| @astrojs/rss ^4.0.14 | fast-xml-parser ^4.x | These do different things; no interaction |
| motion ^10.x | CSS transitions (existing) | Safe to use together; Motion does not override CSS transitions |

**Confidence: MEDIUM.** Astro 5.x compatibility with Motion and fast-xml-parser is based on documented patterns and npm package standards. Verify exact motion version on install — the package name changed from `@motionone/animation` to `motion` and the current major version should be confirmed via `npm show motion version`.

---

## Substack RSS Feed — Specific Notes

Substack's RSS feed URL pattern: `https://[publication-slug].substack.com/feed`

For this project: `https://meredithwritespublichealth.substack.com/feed`

**What the feed typically includes:**
- `<item>` elements with `<title>`, `<link>`, `<pubDate>`, `<description>` (HTML excerpt)
- Substack includes the first ~150 words as a description
- Full content is behind the paywall on Substack; the RSS feed shows the teaser

**CORS note:** Fetching Substack's RSS from the browser would fail (CORS). Fetching at Astro build time (Node.js environment) works fine because it's a server-side fetch. This is why build-time fetch is the correct approach.

**Build-time staleness:** The RSS content will only update when the site rebuilds. For a personal site with a manually-triggered GitHub Actions workflow, this is acceptable. Posts will appear on the site after the next rebuild. If more real-time display is needed, a scheduled GitHub Actions rebuild (e.g., weekly) can be added. This is not a blocker.

**Confidence: HIGH on CORS reasoning (build-time Node.js fetch bypasses CORS). MEDIUM on Substack feed contents (based on Substack's documented RSS support, verified in multiple public sources pre-training-cutoff). LOW on whether Substack's feed is Atom or RSS2 format (affects XML parsing; fast-xml-parser handles both).**

---

## Sources

- Existing project `package.json` and `package-lock.json` — confirmed Astro 5.16.8 and current dependencies
- Existing `src/styles/global.css` — confirmed current CSS architecture and color tokens
- Existing `src/pages/rss.xml.js` — confirmed @astrojs/rss usage pattern for outbound feed
- `WEBSITE-SPEC.md` — project requirements: Substack URL, Easter egg patterns, typography direction
- `.planning/PROJECT.md` — confirmed constraints: SSG, GitHub Pages, no React islands
- Astro 5.x data fetching documentation (training data, HIGH confidence for build-time fetch pattern)
- Motion library (motion.dev) — vanilla JS animation API (training data, MEDIUM confidence; verify version)
- fast-xml-parser (github.com/NaturalIntelligence/fast-xml-parser) — XML parsing (training data, MEDIUM confidence)
- Substack RSS feed conventions — training data + community documentation, MEDIUM confidence

---

*Stack research for: meredithmcgee.org personal site rebuild*
*Researched: 2026-02-28*
