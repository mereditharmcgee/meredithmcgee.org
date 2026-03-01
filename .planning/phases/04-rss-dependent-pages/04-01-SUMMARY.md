---
phase: 04-rss-dependent-pages
plan: 01
subsystem: ui
tags: [astro, rss, substack, homepage, workcard]

# Dependency graph
requires:
  - phase: 02-shared-components
    provides: SubstackFeed.astro, WorkCard.astro, src/data/work.ts
  - phase: 03-static-pages
    provides: work.astro structural pattern (standalone .astro, alternating bg sections)
provides:
  - Three-beat homepage at src/pages/index.astro
  - Intro section with h1 "Meredith McGee", hero photo, and FINAL verbatim intro copy
  - What I'm Working On section with 3 live Substack posts via SubstackFeed
  - Selected Work section with 4 featured WorkCards and "See all work" link to /work
affects: [05-design-system-elevation, 06-easter-eggs-polish]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Three-beat homepage: Intro (bg-dark bg-pattern) > Working On (bg-medium) > Selected Work (bg-dark)"
    - "featuredWork.map() over work.filter(item => item.featured) for homepage work items"
    - "see-more div pattern matching archive-link from work.astro"

key-files:
  created: []
  modified:
    - src/pages/index.astro

key-decisions:
  - "Homepage h1 is 'Meredith McGee' only — SITE_TITLE (with MPH) only appears in BaseHead meta title"
  - "Beat 2 uses bg-medium for visual contrast from bg-dark intro; SubstackFeed gold/cream tokens remain legible"
  - "Hero photo placed below h1 and above intro copy, centered at max-width 350px"
  - "All 4 featured work items shown (no .slice) — plan specified show all 4"

patterns-established:
  - "Homepage sections use no <main> wrapper — <section> elements directly between Header and Footer"
  - "see-more link mirrors archive-link pattern from work.astro for visual consistency"
  - "Scoped <style> block at bottom of page file"

requirements-completed: [HOME-01, HOME-02, HOME-03, HOME-04, HOME-05]

# Metrics
duration: 8min
completed: 2026-03-01
---

# Phase 4 Plan 01: Homepage Summary

**Three-beat homepage with verbatim intro copy, live Substack RSS (3 posts), and 4 featured WorkCards replacing the old four-section credential layout**

## Performance

- **Duration:** 8 min
- **Started:** 2026-03-01T06:00:59Z
- **Completed:** 2026-03-01T06:08:53Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments

- Deleted the old homepage (hero, approach-cards, featured-cards, about-preview sections) and replaced with clean three-beat layout
- Beat 1: Intro section with centered h1 "Meredith McGee", headshot photo, and FINAL copy verbatim (single paragraph, no edits)
- Beat 2: "What I'm working on" section on bg-medium with SubstackFeed rendering 3 live posts from meredithwritespublichealth.substack.com
- Beat 3: "Selected work" section on bg-dark with all 4 featured WorkCards plus "See all work" link to /work
- Build succeeds (6 pages) with zero errors; SubstackFeed fetched real posts at build time

## Task Commits

Each task was committed atomically:

1. **Task 1: Rewrite index.astro as three-beat homepage** - `9c61d01` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `src/pages/index.astro` - Complete homepage rewrite: three beats, FINAL copy, SubstackFeed limit=3, 4 WorkCards, see-more link

## Decisions Made

- h1 is "Meredith McGee" with no "MPH" — SITE_TITLE constant (which has MPH) is only used for the BaseHead `<title>` meta tag, not the visible h1
- Beat 2 background is bg-medium (#6b7c4c) to create contrast from the bg-dark Beat 1 and Beat 3; SubstackFeed gold/cream tokens remain legible on this darker green
- Hero photo placed below h1 and above intro copy, centered at max-width 350px on desktop / 280px on mobile
- All 4 featured items displayed (no slice) per plan spec

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Homepage complete and ready for visual review
- Phase 4 Plan 02 (Ground Level page) is next: SubstackFeed with limit higher, subscribe CTA, brief description
- No blockers

---
*Phase: 04-rss-dependent-pages*
*Completed: 2026-03-01*

## Self-Check: PASSED

- FOUND: src/pages/index.astro
- FOUND: .planning/phases/04-rss-dependent-pages/04-01-SUMMARY.md
- FOUND: commit 9c61d01 (feat(04-01): rewrite homepage as three-beat layout)
