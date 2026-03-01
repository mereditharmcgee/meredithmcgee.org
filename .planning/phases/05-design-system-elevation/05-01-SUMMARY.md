---
phase: 05-design-system-elevation
plan: 01
subsystem: ui
tags: [css-custom-properties, typography, playfair-display, source-sans-3, design-tokens]

# Dependency graph
requires:
  - phase: 04-rss-dependent-pages
    provides: All pages built on the color token and typography foundation updated here
provides:
  - Evolved :root CSS color palette (warmer forest green, sage, amber-gold, parchment cream)
  - New --color-text-muted token for metadata and secondary text
  - Editorial letter-spacing (-0.02em) on all Playfair Display headings
  - Improved body line-height (1.75) and font-optical-sizing on Source Sans 3
  - Cleaned :root block with no Three Audiences dead tokens
  - Cleaned BaseHead.astro with no Atkinson font preloads
  - SITE_TITLE 'Meredith McGee' without MPH
affects:
  - 05-02-spacing-rhythm
  - 05-03-seo-meta
  - 05-04-animations
  - All pages and components (cascade from :root)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "CSS custom properties as the single source of truth for palette; all components inherit via :root cascade"
    - "SVG data URI fill colors must be hardcoded hex (URL-encoded with %23 prefix), not CSS custom properties"
    - "font-optical-sizing: auto on body enables Source Sans 3 optical size optimization"

key-files:
  created: []
  modified:
    - src/styles/global.css
    - src/components/BaseHead.astro
    - src/consts.ts

key-decisions:
  - "New --color-dark is #2d3a1e (deeper forest green), --color-medium is #5a6e3c (warmer sage) — richer and more organic than the old gray-olive tones"
  - "Added --color-text-muted token (cream at 60% opacity) for dates, metadata, and secondary UI text"
  - "Increased .bg-pattern SVG fill-opacity from 0.05 to 0.07 so the texture is faintly visible rather than invisible"
  - "SITE_TITLE dropped MPH suffix — matches homepage h1 and person-first design brief"
  - "Removed Atkinson font preloads — font files exist in public/fonts/ but no CSS references them; removing saves wasted network requests on every page load"

patterns-established:
  - "Palette evolution pattern: update :root tokens, update any hardcoded hex values in SVG data URIs to match"
  - "Typography pattern: Playfair Display headings at letter-spacing -0.02em, Source Sans 3 body at 1.75 line-height"

requirements-completed: [DSGN-01, DSGN-02, DSGN-07]

# Metrics
duration: 2min
completed: 2026-03-01
---

# Phase 5 Plan 01: Design Token Foundation Summary

**Warmer, richer CSS color palette (#2d3a1e forest green, #5a6e3c sage, #d4b968 amber-gold) with editorial Playfair Display letter-spacing, cleaned dead Three Audiences tokens, and a new --color-text-muted utility token**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-03-01T07:21:08Z
- **Completed:** 2026-03-01T07:23:10Z
- **Tasks:** 4
- **Files modified:** 3

## Accomplishments

- Evolved the :root color palette from flat gray-olive tones to warmer, deeper forest greens and amber-gold — same green/warm family, meaningfully richer
- Removed 4 dead Three Audiences tokens (--color-journalist, --color-staffer, --color-researcher, --highlight-transition) that had no live CSS references
- Added editorial letter-spacing (-0.02em) to all h1-h6 and improved body line-height from 1.7 to 1.75 with font-optical-sizing enabled
- Removed wasted Atkinson font preload network requests from every page load
- Updated SITE_TITLE to 'Meredith McGee' matching the homepage h1

## Task Commits

Each task was committed atomically:

1. **Task 1: Evolve color tokens and clean dead variables** - `55ce2d6` (feat)
2. **Task 2: Refine typography scale** - `6463586` (feat)
3. **Task 3: Remove Atkinson font preloads from BaseHead.astro** - `5642c4c` (feat)
4. **Task 4: Update SITE_TITLE in consts.ts** - `d14c383` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `src/styles/global.css` - Updated :root palette tokens, removed dead Three Audiences variables, added --color-text-muted, updated .bg-pattern SVG fill to #5a6e3c at 0.07 opacity, added letter-spacing to headings, increased body line-height and added font-optical-sizing
- `src/components/BaseHead.astro` - Removed two Atkinson font preload link tags and the "Font preloads" comment
- `src/consts.ts` - Changed SITE_TITLE from 'Meredith McGee, MPH' to 'Meredith McGee'

## Decisions Made

- Chose #2d3a1e for --color-dark (deeper forest green, more organic than the old #3d4a2a gray-olive), with rgba(45, 58, 30, 0.95) for --color-dark-overlay to match exactly
- Chose #5a6e3c for --color-medium (warmer sage, less gray) and updated the .bg-pattern SVG data URI fill from %236b7c4c to %235a6e3c
- Increased SVG fill-opacity from 0.05 to 0.07 so the botanical pattern is subtly visible as texture rather than invisible
- Added --color-text-muted as a new utility token (rgba(236, 230, 208, 0.6)) since subsequent plans will need it for dates and metadata

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All :root color tokens are in their final evolved state — Plans 05-02 through 05-05 can use them immediately
- The new --color-text-muted token is available for spacing, animation, and SEO plans
- Typography scale is final — heading letter-spacing and body line-height are set
- Build passes clean with zero errors across all 6 pages

---
*Phase: 05-design-system-elevation*
*Completed: 2026-03-01*

## Self-Check: PASSED

- [x] `src/styles/global.css` exists and has 210 lines
- [x] `src/components/BaseHead.astro` exists with no Atkinson references
- [x] `src/consts.ts` contains 'Meredith McGee' without MPH
- [x] Commit 55ce2d6 exists (Task 1)
- [x] Commit 6463586 exists (Task 2)
- [x] Commit 5642c4c exists (Task 3)
- [x] Commit d14c383 exists (Task 4)
- [x] Build passes with zero errors
