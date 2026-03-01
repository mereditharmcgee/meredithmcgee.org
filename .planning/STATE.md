---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: completed
last_updated: "2026-03-01T01:10:32.906Z"
progress:
  total_phases: 2
  completed_phases: 2
  total_plans: 4
  completed_plans: 4
---

# Project State: meredithmcgee.org Rebuild

**Project:** meredithmcgee.org — personal website rebuild
**Core Value:** The site makes visitors think "this person is interesting, I want to keep reading." Person first, work second.
**Milestone:** v1
**Last Updated:** 2026-03-01

---

## Current Position

**Phase:** 3 - Static Pages
**Plan:** 03-02 COMPLETE; 03-03 COMPLETE (checkpoint approved)
**Status:** In progress

```
Progress: [####------] 33% complete
Phase 3 of 6 (03-02 done; 03-03 done — Contact page fully verified; 03-01 About page remaining)
```

---

## Project Reference

**Stack:** Astro 5.x SSG, GitHub Pages via GitHub Actions, native CSS custom properties
**Repository:** meredithmcgee/my-website (GitHub Pages)
**Live URL:** meredithmcgee.org
**Planning Dir:** `.planning/`

**Voice Rules (non-negotiable):**
- No em dashes
- No bullet points in prose
- Always use contractions
- No empty hedging
- No corporate buzzwords
- Lead with concrete
- Vary sentence length

**Design Constraints:**
- Evolve existing greens/browns/warm palette — do not replace it
- Keep Playfair Display + Source Sans 3 — refine weights and usage
- Reference site: hankgreen.com (primary)

---

## Phase Summary

| Phase | Goal | Status |
|-------|------|--------|
| 1 - Foundation Cleanup | Clean codebase, new nav, redirects | Complete |
| 2 - Shared Components | SubstackFeed, WorkCard, Header, Footer, data layer | Complete |
| 3 - Static Pages | About, Work, Work Archive, Contact | In progress (03-03 complete; 03-01 About remaining) |
| 4 - RSS-Dependent Pages | Homepage, Ground Level | Not started |
| 5 - Design System Elevation | Palette, typography, spacing, animations, SEO | Not started |
| 6 - Easter Eggs and Polish | Ember click, micro-delights, accessibility | Not started |

---

## Accumulated Context

### Key Decisions Made

| Decision | Rationale |
|----------|-----------|
| Keep Astro SSG | Existing framework, works well for static site |
| Evolve palette, don't replace | User likes current greens/browns/warm, wants it elevated |
| Substack RSS fetched at build time | Avoids CORS failure; RSS-fetching pages depend on SubstackFeed component |
| `fast-xml-parser` for RSS | Lighter and more maintained than rss-parser; handles RSS 2.0 and Atom |
| `motion` for animations | Vanilla JS, framework-agnostic, 4kb core |
| No Tailwind CSS | Mid-project migration creates churn; existing CSS architecture is good |
| Work items in `src/data/work.ts` | Short metadata entries, no markdown bodies needed |
| LinkedIn + Substack as only social links | Only platforms Meredith actively uses |
| Easter eggs included in v1 | User wants playful elements from the start |
| Substack URL: https://meredithmcgee.substack.com | Confirmed URL for Ground Level newsletter (01-02) |
| LinkedIn URL: https://www.linkedin.com/in/meredith-mcgee | Confirmed URL for footer social link (01-02) |
| Inline SVG icons for footer social links | Zero icon library dependencies; icons follow CSS color tokens (01-02) |
| Wildcard redirect patterns omitted from astro.config.mjs | Astro SSG requires getStaticPaths() for wildcard redirects; root-level redirects sufficient since individual slugs no longer exist (01-01) |
| BaseHead OG image uses string path to public/ | Imported ImageMetadata from src/assets/ no longer valid after asset deletion; public/ path avoids import churn (01-01) |
| SUBSTACK_FEED_URL uses meredithwritespublichealth.substack.com/feed | Old publication slug returns valid RSS XML; meredithmcgee.substack.com/feed redirects to HTML profile page, not RSS (02-01) |
| cdataPropName: '__cdata' + getField() helper | fast-xml-parser CDATA handling varies by field; helper normalizes both plain string and {__cdata: string} formats (02-01) |
| Single-item normalization in SubstackFeed | fast-xml-parser returns object instead of array when feed has only one item; Array.isArray check handles edge case (02-01) |
| Work data: 8 placeholder entries in src/data/work.ts | Final curated content provided by user before Phase 3; placeholder references real orgs from existing site (02-01) |
| Header required no changes in Phase 2 | Already correct from Phase 1 with 5-item nav, logo, active state, and mobile hamburger (02-02) |
| Footer collapsed to centered single column | Removing tagline, button, and location left too little content to justify two-column layout (02-02) |
| WorkCard has two link affordances | Linked title plus Read more arrow when link prop present gives two clear interaction points (02-02) |
| Work page intro uses contractions, leads with concrete | Voice rules enforced: "I work at the intersection..." frames the page without corporate language (03-02) |
| Archive page not in main nav — reachable via /work text link only | Keeps nav clean; archive is supplementary, not primary destination (03-02) |
| Both Work pages use bg-dark to match WorkCard design contract | WorkCard styles use gold/cream tokens designed for dark backgrounds (03-02) |
| Formspree form kept and simplified to 3 fields | Subject dropdown removed; name/email/message only keeps contact friction low (03-03) |
| Contact hero heading only, no intro paragraph | Clean direct hero; warm copy lives in the content section below where it's easier to read (03-03) |
| Contact email displayed as standalone prominent link | Email not buried in body text; own paragraph block between intro and social links (03-03) |

### Critical Pitfalls to Avoid

1. **Voice drift** — voice rules must be checked on every page before marking it done; warning signs: "leverage," "cross-disciplinary," any em dash
2. **Substack RSS client-side fetch** — any `fetch()` in a `<script>` tag hitting Substack URL will CORS-fail at runtime; build-time only
3. **Orphaned routes** — /portfolio, /blog, /resume have inbound links; GitHub Pages has no server-side redirects; use meta refresh redirects
4. **Unfocused person failure mode** — Work page must be curated to 4-5 items, not comprehensive; About must be essay, not resume
5. **Easter egg accessibility** — click-triggered only (works on touch); `prefers-reduced-motion` check on all animations

### Research Flags (Resolve Before Relevant Phase)

- ~~**Before Phase 2:** Fetch `https://meredithwritespublichealth.substack.com/feed` and inspect raw XML to confirm RSS 2.0 vs Atom format before writing the parser~~ RESOLVED: RSS 2.0 confirmed; parser implemented in 02-01
- ~~**Before Phase 2 Plan 02:** Verify `motion` package version via `npm show motion version` — do not assume training-data version is current~~ Deferred — motion not used in 02-02; verify before Phase 5 (animations)
- ~~**Before Phase 3:** Confirm Formspree form decision: keep, simplify, or remove (spec says simplify but not resolved)~~ RESOLVED: Kept and simplified to 3 fields in 03-03
- **Before Phase 3:** Work page curated content is not finalized — use placeholder entries per WORK-03; flag to user
- **Before Phase 4:** Test build-time RSS fetch in a GitHub Actions dry run before merging — CI network restrictions may affect external fetches
- **After Phase 5:** Verify OG images and BaseHead still correct after design system changes

### Content Status

| Content | Status |
|---------|--------|
| Homepage intro copy | FINAL (in WEBSITE-SPEC.md) |
| About page copy | FINAL (provided by user) |
| Work page content | PLACEHOLDER — 8 entries from work.ts; user to confirm before launch |
| Contact page | COMPLETE (03-03) |
| Photos | Use existing assets, assess during implementation |

---

## Todos

- [ ] Read WEBSITE-SPEC.md for final homepage intro copy before Phase 4
- [x] Fetch Substack RSS feed and inspect XML format before Phase 2 — COMPLETE (02-01)
- [x] Confirm Formspree decision before Phase 3 — RESOLVED: kept and simplified to 3 fields (03-03)
- [ ] Get Work page curated content from user or confirm placeholder approach before Phase 3

---

## Blockers

None currently.

---

## Session Continuity

To resume work in a new session:
1. Read `.planning/STATE.md` (this file) for current position
2. Read `.planning/ROADMAP.md` for phase goals and success criteria
3. Read `.planning/REQUIREMENTS.md` for requirement details
4. Check which phase is "In progress" and continue from active plan

---

*State initialized: 2026-02-28*
*Last updated: 2026-03-01 after 03-03 completion (Contact page — user approved visual checkpoint)*
