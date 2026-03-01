---
phase: 06-easter-eggs-and-polish
plan: 01
subsystem: ui
tags: [easter-egg, animation, css-keyframes, astro, particles, accessibility, prefers-reduced-motion]

# Dependency graph
requires:
  - phase: 05-design-system-elevation
    provides: CSS color tokens (--color-gold, --color-cream), astro:page-load pattern, prefers-reduced-motion pattern

provides:
  - EmberClick.astro component with popup overlay, particle system, click escalation, and dismissal animation
  - .ember-trigger spans on index.astro (1) and about.astro (2) with ARIA attributes
  - Gold dotted underline affordance on all "Ember" text mentions

affects:
  - 06-02-PLAN (About footnotes — follows same component pattern)
  - 06-03-PLAN (Footer hidden message — same accessibility approach)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Self-contained .astro component with :global() CSS for cross-page element styling"
    - "astro:page-load event for script initialization (View Transitions compatible)"
    - "CSS custom properties (--dx, --dy) for per-particle animation randomization"
    - "animationend + setTimeout fallback for cleanup reliability"
    - "prefersReduced flag gates all particle and float-up animations"

key-files:
  created:
    - src/components/EmberClick.astro
  modified:
    - src/pages/index.astro
    - src/pages/about.astro

key-decisions:
  - "Used :global(.ember-trigger) CSS modifier since trigger spans live in page files, not inside the component"
  - "Click counter persists per astro:page-load invocation — resets on navigation (acceptable; escalation resets on page transition)"
  - "Keyboard accessibility added via keydown handler for Enter/Space — not in plan spec but necessary for role=button spans"
  - "setTimeout fallback alongside animationend event for particle and dismissal cleanup"

patterns-established:
  - "Easter egg component pattern: self-contained .astro file, no props, injected hidden overlay, astro:page-load initialization"

requirements-completed:
  - DLGT-01
  - DLGT-03
  - DLGT-04

# Metrics
duration: 3min
completed: 2026-03-01
---

# Phase 6 Plan 01: Ember Click Easter Egg Summary

**Self-contained EmberClick.astro component with CSS particle burst, viewport-clamped popup, and click escalation to silly photo with rotating captions across all three "Ember" mentions on the site**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-03-01T09:33:15Z
- **Completed:** 2026-03-01T09:36:49Z
- **Tasks:** 3 of 3 complete (Task 3 human-verified and approved)
- **Files modified:** 3

## Accomplishments
- Created EmberClick.astro as a zero-prop, self-contained component with fixed-position overlay, 180x180px gold-bordered popup, and CSS @keyframes particle system
- Wrapped all three "Ember" text occurrences (index.astro line 27, about.astro lines 44 and 76) in accessible .ember-trigger spans with gold dotted underline affordance
- Click escalation logic: clicks 1-2 show /ember.jpg, clicks 3+ show /ember-silly.jpg with rotating caption ("she says hi" / "good girl" / "best dog")
- Full prefers-reduced-motion support: skips particle creation and dismissal animation entirely
- Keyboard accessibility via Enter/Space keydown handler on trigger spans (role="button" + tabindex="0")
- Viewport-clamped popup positioning prevents off-screen overflow (header clearance 80px, right/bottom margins 15px)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create EmberClick.astro component** - `219ed14` (feat)
2. **Task 2: Wrap Ember text in trigger spans and import component** - `03718c9` (feat)
3. **Task 3: Verify interaction in browser** - human-verified (checkpoint:human-verify approved by user)

## Files Created/Modified
- `src/components/EmberClick.astro` - Full Easter egg component: overlay HTML, particle CSS keyframes, floatDismiss animation, click handler with escalation, astro:page-load initialization
- `src/pages/index.astro` - EmberClick import, one .ember-trigger span around "Ember" in intro copy, EmberClick component placed before Footer
- `src/pages/about.astro` - EmberClick import, two .ember-trigger spans (lines 44 and 76), EmberClick component placed before Footer

## Decisions Made
- Used `:global(.ember-trigger)` CSS modifier so scoped component styles can reach trigger spans defined in page files
- Added keyboard Enter/Space handler beyond the plan spec — required for correct `role="button"` accessibility behavior
- setTimeout fallback alongside animationend for cleanup reliability across browsers
- Click count does not persist across page navigations (resets on astro:page-load) — acceptable tradeoff; escalation resets on navigation

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added keyboard Enter/Space handler for trigger spans**
- **Found during:** Task 1 (EmberClick.astro component creation)
- **Issue:** Plan specified tabindex="0" and role="button" on trigger spans but did not include a keydown handler. Without keydown handling, keyboard users pressing Enter/Space would not trigger the interaction despite the element advertising itself as a button via ARIA
- **Fix:** Added keydown event listener checking for Enter and Space keys, with preventDefault on Space to avoid page scroll, positioning popup at element center
- **Files modified:** src/components/EmberClick.astro
- **Verification:** Spans are now keyboard-accessible in line with their ARIA role
- **Committed in:** 219ed14 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 missing critical — accessibility)
**Impact on plan:** Auto-fix necessary for correct ARIA semantics. No scope creep.

## Issues Encountered
- Line 75 in about.astro (original numbering) had slightly different indentation than expected — used grep/Read to locate exact text before editing. No impact.

## User Setup Required
- Drop `public/ember.jpg` (normal Ember photo) and `public/ember-silly.jpg` (silly Ember photo) into the public/ directory before launch. Until then, the popup appears with a broken image icon, which is acceptable for development verification.

## Next Phase Readiness
- EmberClick pattern established — future easter egg components should follow the same self-contained .astro + astro:page-load pattern
- Plan 06-02 (About page personal footnotes) can proceed once this checkpoint is approved
- User visually verified the Ember click interaction in browser and approved on 2026-03-01

---
*Phase: 06-easter-eggs-and-polish*
*Completed: 2026-03-01*
