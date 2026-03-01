# Phase 5: Design System Elevation - Context

**Gathered:** 2026-03-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Evolve the visual identity across all 6 pages: refine the color palette, tune typography, adjust spacing, add scroll-triggered entrance animations, ensure mobile responsiveness, and configure SEO (OG images, sitemap, canonical URLs). Every page should benefit from the refinements without any feeling cramped or generic.

</domain>

<decisions>
## Implementation Decisions

### Color Palette Direction
- **Warmer shift** — move the current olive greens toward sage, forest, and moss tones with warmer golds and tans. Less military olive, more natural warmth.
- The overall direction is warmer and more organic, not a complete reinvention

### Claude's Discretion: Palette Details
- Natural reference/mood for the specific color values (forest floor, herb garden, library, etc.) — pick what fits the "person first" tone
- Whether to keep the 3-tier section background system (bg-dark/bg-medium/bg-light) or simplify
- Whether to keep, evolve, or drop the botanical SVG pattern overlay (.bg-pattern)
- Specific hex values for the evolved palette

### Scroll Animations
- **Fade + slight rise** — content fades in while shifting up ~20-30px as user scrolls to it. Feels like content settling into place.
- **Medium/natural timing** — 400-600ms transitions. Noticeable but doesn't make you wait.
- All animations MUST respect `prefers-reduced-motion` (show static version or no animation)

### Claude's Discretion: Animation Details
- Hover effects for links and buttons (current .btn fill transition is the baseline)
- Page-to-page transitions (pick what Astro supports without added complexity)
- Which specific elements animate on scroll (entire sections, individual headings, cards, etc.)
- Easing curves and exact durations within the 400-600ms range

### Typography
- Playfair Display headings + Source Sans 3 body fonts stay (already loaded)

### Claude's Discretion: Typography Details
- Heading weight direction (bolder, lighter, italic accents)
- Body text size and line-height tuning
- Letter-spacing on headings
- Metadata/date styling (size, weight, case)
- All typographic details — pick what pairs best with the evolved palette

### Spacing
### Claude's Discretion: Spacing
- Section padding and vertical rhythm (currently 5rem on desktop, 3rem mobile)
- Per-page spacing optimization based on content density
- Overall direction: generous but responsive to content type

### SEO and Social Sharing
- **Site title: "Meredith McGee"** — drop the "MPH" from SITE_TITLE in consts.ts. Matches the homepage h1.

### Claude's Discretion: SEO Details
- OG image approach (designed card, per-page, text-on-color — pick what gives best result with least maintenance)
- Sitemap configuration (standard SEO-optimal approach)
- Per-page meta descriptions (Claude writes them during implementation)
- Canonical URL configuration

### Mobile Responsiveness
- Site must look good on phone screens
- Tap targets adequate, text readable without zooming, nav works on mobile

### Claude's Discretion: Mobile Details
- Breakpoint strategy (currently single 768px breakpoint)
- Mobile-specific spacing adjustments
- Touch target sizing approach

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/styles/global.css`: All CSS custom properties, section backgrounds, button styles, responsive base
- `src/components/BaseHead.astro`: Handles `<head>` with title, description, OG metadata — needs OG image and per-page description updates
- `src/consts.ts`: SITE_TITLE (needs MPH removal), SITE_DESCRIPTION, SUBSTACK_FEED_URL, SUBSTACK_URL
- `.bg-dark`, `.bg-medium`, `.bg-light`: Section background utility classes used across all pages
- `.bg-pattern`: Botanical SVG overlay used on some sections
- `.btn`, `.btn-small`: Button styles with hover fill transition
- `.container`: Max-width 1200px wrapper
- `clamp()` already used for fluid heading sizes

### Established Patterns
- CSS custom properties for all colors — change `:root` variables and everything updates
- Scoped styles in each `.astro` component supplement global.css
- Mobile-first with `@media (max-width: 768px)` breakpoint
- No animation infrastructure exists — this is greenfield
- No build-time image processing — OG images would be static files in `public/`

### Integration Points
- `global.css` `:root` variables affect every page and component
- `BaseHead.astro` controls all `<head>` metadata across all 6 pages
- `consts.ts` SITE_TITLE used in BaseHead for browser tab titles
- Dead CSS variables from ThreeAudiences (lines 18-22) should be cleaned up
- `astro.config.mjs` needs sitemap integration added

### Pages Affected (all 6)
- `src/pages/index.astro` (157 lines) — homepage with 3 sections
- `src/pages/about.astro` (154 lines) — essay page with inline photos
- `src/pages/work.astro` (106 lines) — 4 featured work cards
- `src/pages/work/archive.astro` (102 lines) — all 8 work cards
- `src/pages/contact.astro` (231 lines) — form + social links
- `src/pages/ground-level.astro` (89 lines) — Substack feed page

</code_context>

<specifics>
## Specific Ideas

- The palette shift should feel like an evolution of the existing site, not a redesign — visitors who saw the old version should recognize it
- "Person first" tone: warm, approachable, not corporate or cold
- The scroll animations should feel like content is naturally settling into view, not performing

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 05-design-system-elevation*
*Context gathered: 2026-03-01*
