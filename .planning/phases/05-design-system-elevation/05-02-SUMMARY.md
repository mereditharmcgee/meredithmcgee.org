---
phase: 05-design-system-elevation
plan: 02
subsystem: ui
tags: [animations, view-transitions, intersection-observer, css-keyframes, progressive-enhancement]

# Dependency graph
requires:
  - phase: 05-01
    provides: Evolved color tokens and typography foundation that animation classes build on
provides:
  - "@keyframes fadeRise CSS animation (opacity 0->1 + translateY 20px->0)"
  - ".will-animate and .will-animate.is-visible classes for scroll-triggered entrance"
  - ".stagger-1 through .stagger-6 animation delay utility classes"
  - "prefers-reduced-motion CSS overrides (both opacity and animation: none)"
  - "Astro ViewTransitions for page-to-page cross-fade navigation"
  - "IntersectionObserver script in BaseHead that converts .animate-on-scroll at runtime"
affects:
  - 05-03-page-animations
  - 05-04-component-polish
  - All pages (BaseHead included on every page)

# Tech tracking
tech-stack:
  added:
    - "astro:transitions ViewTransitions component (built-in Astro 5.x, zero npm cost)"
  patterns:
    - "Progressive enhancement: .will-animate is JS-only class; static HTML always shows content at full opacity"
    - "astro:page-load event (not DOMContentLoaded) required when ViewTransitions is enabled"
    - "IntersectionObserver with threshold 0.1 and rootMargin 0px 0px -50px 0px for 50px early trigger"
    - "One-time observe: observer.unobserve() after first intersection prevents re-triggering on scroll back"

key-files:
  created: []
  modified:
    - src/styles/global.css
    - src/components/BaseHead.astro

key-decisions:
  - "Used astro:page-load event instead of DOMContentLoaded so animations re-initialize after View Transitions navigations"
  - "JS converts .animate-on-scroll to .will-animate at runtime rather than hardcoding .will-animate in HTML — no-JS visitors always see content"
  - "ViewTransitions added to BaseHead (present on every page) rather than individual page layouts"
  - "prefers-reduced-motion handled in both CSS (sets opacity:1, transform:none) and JS (skips observer setup entirely)"

patterns-established:
  - "Animation layer separation: CSS defines keyframes, HTML adds .animate-on-scroll markers (done in 05-03), JS converts to .will-animate and observes"
  - "Stagger pattern: add .stagger-N class alongside .animate-on-scroll to delay cards/list items"

requirements-completed: [DSGN-03, DSGN-04]

# Metrics
duration: 4min
completed: 2026-03-01
---

# Phase 5 Plan 02: Animation Infrastructure Summary

**CSS scroll-triggered entrance animation system with @keyframes fadeRise, stagger utilities, and prefers-reduced-motion overrides, plus Astro ViewTransitions for page-to-page cross-fade navigation powered by an IntersectionObserver script in BaseHead**

## Performance

- **Duration:** ~4 min
- **Started:** 2026-03-01T07:26:06Z
- **Completed:** 2026-03-01T07:27:05Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Added @keyframes fadeRise (fade in + 20px upward slide) with .will-animate and .will-animate.is-visible trigger classes to global.css
- Added .stagger-1 through .stagger-6 animation delay utilities (0.1s to 0.6s) for staggered card and list entry
- Added prefers-reduced-motion CSS override block that resets .will-animate to fully visible and disables animation
- Imported ViewTransitions from astro:transitions and rendered it in BaseHead for page-to-page cross-fade navigation
- Added IntersectionObserver initAnimations() script in BaseHead with astro:page-load event listener
- Script checks prefers-reduced-motion before setting up any observers (dual-layer accessibility)
- Progressive enhancement confirmed: no-JS visitors see all content at full opacity since .will-animate is JS-only

## Task Commits

Each task was committed atomically:

1. **Task 1: Add animation CSS infrastructure to global.css** - `67cabc5` (feat)
2. **Task 2: Add ViewTransitions and IntersectionObserver script to BaseHead** - `ac062b8` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `src/styles/global.css` - Added @keyframes fadeRise, .will-animate, .will-animate.is-visible, .stagger-1 through .stagger-6, and @media (prefers-reduced-motion: reduce) block with overrides. Animation section inserted before the responsive media query block.
- `src/components/BaseHead.astro` - Added ViewTransitions import and component render, plus initAnimations() script with IntersectionObserver listening on astro:page-load

## Decisions Made

- Used `astro:page-load` rather than `DOMContentLoaded` because View Transitions suppress DOMContentLoaded on subsequent navigations; astro:page-load fires on both initial load and every transition
- Kept the animation JS in BaseHead rather than a separate layout file because BaseHead is already the universal single-inclusion point for every page
- prefers-reduced-motion is handled at two levels: CSS resets initial state (no layout shift for reduced-motion users), JS skips observer setup entirely (no unnecessary DOM queries)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- global.css now has full animation infrastructure: 05-03 can add .animate-on-scroll classes to any element and they will animate automatically
- Stagger utilities are ready: 05-03 adds .stagger-1 through .stagger-N classes alongside .animate-on-scroll on card grids and lists
- ViewTransitions is active on all pages for cross-page navigation polish
- Build passes clean with zero errors

---
*Phase: 05-design-system-elevation*
*Completed: 2026-03-01*

## Self-Check: PASSED

- [x] `src/styles/global.css` exists (250 lines, above 180-line minimum)
- [x] `src/styles/global.css` contains @keyframes fadeRise
- [x] `src/styles/global.css` contains .will-animate and .is-visible rules (5 occurrences)
- [x] `src/styles/global.css` contains .stagger-6 (stagger-1 through stagger-6 confirmed)
- [x] `src/styles/global.css` contains @media (prefers-reduced-motion: reduce) block
- [x] `src/components/BaseHead.astro` exists (78 lines, above 40-line minimum)
- [x] `src/components/BaseHead.astro` contains ViewTransitions (import + component = 2 occurrences)
- [x] `src/components/BaseHead.astro` contains astro:page-load event listener
- [x] `src/components/BaseHead.astro` contains prefers-reduced-motion check in JS
- [x] Commit 67cabc5 exists (Task 1: animation CSS)
- [x] Commit ac062b8 exists (Task 2: ViewTransitions + observer script)
- [x] Build passes with zero errors
