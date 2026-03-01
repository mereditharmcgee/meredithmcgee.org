---
phase: 02-shared-components
plan: 01
subsystem: ui
tags: [astro, rss, xml, substack, typescript, data-layer]

# Dependency graph
requires:
  - phase: 01-foundation-cleanup
    provides: Cleaned codebase, consts.ts baseline, site structure
provides:
  - SubstackFeed.astro component with build-time RSS fetch and graceful fallback
  - src/data/work.ts with WorkItem interface and 8 placeholder entries
  - SUBSTACK_FEED_URL and SUBSTACK_URL constants in consts.ts
  - fast-xml-parser as explicit package.json dependency
affects: [02-02-shared-components, 04-rss-dependent-pages]

# Tech tracking
tech-stack:
  added: [fast-xml-parser@5.4.1]
  patterns: [build-time-rss-fetch, typed-data-layer, graceful-fallback-component]

key-files:
  created:
    - src/components/SubstackFeed.astro
    - src/data/work.ts
  modified:
    - src/consts.ts
    - package.json
    - package-lock.json

key-decisions:
  - "fast-xml-parser v5.x XMLParser named export used — confirmed compatible before writing component"
  - "SUBSTACK_FEED_URL uses meredithwritespublichealth.substack.com/feed (old publication slug returns RSS XML); SUBSTACK_URL uses meredithmcgee.substack.com (user-facing profile)"
  - "cdataPropName: __cdata option used with getField() helper to handle variable CDATA wrapping across RSS fields"
  - "Single-item edge case handled: fast-xml-parser returns object instead of array when only one item in feed"

patterns-established:
  - "Build-time RSS: all fetch() calls in Astro frontmatter (---) block only, never in <script> tags"
  - "Graceful fallback: try/catch wraps entire fetch+parse pipeline; empty posts array renders fallback link"
  - "Data layer: typed TypeScript interfaces in src/data/ for all structured content; no markdown bodies needed for short entries"

requirements-completed: [GRLV-04]

# Metrics
duration: 2min
completed: 2026-02-28
---

# Phase 2 Plan 1: Build SubstackFeed Component, Work Data Layer, and Update Consts Summary

**Build-time Substack RSS component using fast-xml-parser with CDATA handling, single-item normalization, and graceful fallback, plus typed work data layer with 8 placeholder entries**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-28T19:57:39Z
- **Completed:** 2026-02-28T19:59:58Z
- **Tasks:** 4
- **Files modified:** 5

## Accomplishments
- SubstackFeed.astro fetches Substack RSS at build time with no client-side fetch, handling CDATA-wrapped fields and single-item edge cases
- src/data/work.ts establishes typed WorkItem data layer with 8 placeholder entries (4 featured) covering RESEARCH, WRITING, GRANTS, EVALUATION, POLICY categories
- consts.ts extended with SUBSTACK_FEED_URL (RSS XML endpoint) and SUBSTACK_URL (user-facing Substack profile), which are different URLs serving different purposes
- fast-xml-parser promoted from transitive to explicit dependency in package.json

## Task Commits

Each task was committed atomically:

1. **Task A1: Add fast-xml-parser to package.json and install** - `45cf931` (chore)
2. **Task A2: Add Substack URL constants to consts.ts** - `3db9a92` (chore)
3. **Task A3: Create src/data/work.ts with WorkItem interface and placeholder data** - `9bd8fb0` (feat)
4. **Task A4: Create src/components/SubstackFeed.astro** - `105fcce` (feat)

**Plan metadata:** committed with docs(02-01) after SUMMARY.md creation

## Files Created/Modified
- `src/components/SubstackFeed.astro` - Build-time RSS component with CDATA handling, single-item normalization, graceful fallback, and scoped styles using CSS custom property tokens
- `src/data/work.ts` - WorkItem interface and 8 placeholder work entries; final curated content comes from user before Phase 3
- `src/consts.ts` - Added SUBSTACK_FEED_URL and SUBSTACK_URL constants
- `package.json` - Added fast-xml-parser@^5.4.1 as explicit dependency
- `package-lock.json` - Updated lockfile

## Decisions Made
- SUBSTACK_FEED_URL uses `meredithwritespublichealth.substack.com/feed` (the old publication slug that returns valid RSS XML). The meredithmcgee.substack.com/feed URL redirects to an HTML profile page, not RSS XML.
- fast-xml-parser v5.x `cdataPropName: '__cdata'` option used together with a `getField()` helper that handles both plain string and `{ __cdata: string }` formats, since behavior varies by field.
- Single-item normalization added: `Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : []` handles the edge case where fast-xml-parser returns an object instead of array for one-item feeds.
- Work items use placeholder data referencing real organizations from existing site. Per WORK-03, final curated content is provided by user before Phase 3.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None. Build succeeded with exit code 0. No CORS errors (fetch is build-time only). No TypeScript errors.

## User Setup Required

None - no external service configuration required. The Substack RSS feed is publicly available and fetched at build time.

## Next Phase Readiness
- SubstackFeed.astro is ready to be imported in any Astro page (Plan 02-02 wires it into ground-level.astro)
- WorkItem data layer is importable from src/data/work.ts for WorkCard and work pages (Plan 02-02 and Phase 3)
- Both Substack constants are available from src/consts.ts for any component needing them
- No blockers for Plan 02-02

---
*Phase: 02-shared-components*
*Completed: 2026-02-28*
