# Project State: meredithmcgee.org Rebuild

**Project:** meredithmcgee.org — personal website rebuild
**Core Value:** The site makes visitors think "this person is interesting, I want to keep reading." Person first, work second.
**Milestone:** v1
**Last Updated:** 2026-02-28

---

## Current Position

**Phase:** 1 - Foundation Cleanup
**Plan:** Not started
**Status:** Roadmap complete, ready to begin

```
Progress: [----------] 0% complete
Phase 1 of 6
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
| 1 - Foundation Cleanup | Clean codebase, new nav, redirects | Not started |
| 2 - Shared Components | SubstackFeed, WorkCard, Header, Footer, data layer | Not started |
| 3 - Static Pages | About, Work, Work Archive, Contact | Not started |
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

### Critical Pitfalls to Avoid

1. **Voice drift** — voice rules must be checked on every page before marking it done; warning signs: "leverage," "cross-disciplinary," any em dash
2. **Substack RSS client-side fetch** — any `fetch()` in a `<script>` tag hitting Substack URL will CORS-fail at runtime; build-time only
3. **Orphaned routes** — /portfolio, /blog, /resume have inbound links; GitHub Pages has no server-side redirects; use meta refresh redirects
4. **Unfocused person failure mode** — Work page must be curated to 4-5 items, not comprehensive; About must be essay, not resume
5. **Easter egg accessibility** — click-triggered only (works on touch); `prefers-reduced-motion` check on all animations

### Research Flags (Resolve Before Relevant Phase)

- **Before Phase 2:** Fetch `https://meredithwritespublichealth.substack.com/feed` and inspect raw XML to confirm RSS 2.0 vs Atom format before writing the parser
- **Before Phase 2:** Verify `motion` package version via `npm show motion version` — do not assume training-data version is current
- **Before Phase 3:** Confirm Formspree form decision: keep, simplify, or remove (spec says simplify but not resolved)
- **Before Phase 3:** Work page curated content is not finalized — use placeholder entries per WORK-03; flag to user
- **Before Phase 4:** Test build-time RSS fetch in a GitHub Actions dry run before merging — CI network restrictions may affect external fetches
- **After Phase 5:** Verify OG images and BaseHead still correct after design system changes

### Content Status

| Content | Status |
|---------|--------|
| Homepage intro copy | FINAL (in WEBSITE-SPEC.md) |
| About page copy | FINAL (provided by user) |
| Work page content | TBD — placeholder structure for now |
| Contact page | Adapt existing, simplify |
| Photos | Use existing assets, assess during implementation |

---

## Todos

- [ ] Read WEBSITE-SPEC.md for final homepage intro copy before Phase 4
- [ ] Fetch Substack RSS feed and inspect XML format before Phase 2
- [ ] Confirm Formspree decision before Phase 3
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
*Last updated: 2026-02-28 after roadmap creation*
