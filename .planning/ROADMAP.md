# Roadmap: meredithmcgee.org Rebuild

**Project:** meredithmcgee.org — personal website rebuild
**Milestone:** v1
**Created:** 2026-02-28
**Depth:** Comprehensive
**Coverage:** 40/40 v1 requirements mapped

---

## Phases

- [x] **Phase 1: Foundation Cleanup** - Remove old structure, establish nav, wire redirects for old routes
- [x] **Phase 2: Shared Components** - Build SubstackFeed, WorkCard, updated Header/Footer, and data layer (2/2 plans complete)
- [x] **Phase 3: Static Pages** - Build About, Work, Work Archive, and Contact without external dependencies
- [x] **Phase 4: RSS-Dependent Pages** - Build Homepage and Ground Level using the SubstackFeed component
- [x] **Phase 5: Design System Elevation** - Evolve palette, typography, spacing, scroll animations, SEO (all 5 plans complete)
- [ ] **Phase 6: Easter Eggs and Polish** - Add Ember click, micro-delights, accessibility verification

---

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation Cleanup | 2/2 | Complete | 2026-03-01 |
| 2. Shared Components | 2/2 | Complete | 2026-03-01 |
| 3. Static Pages | 3/3 | Complete | 2026-03-01 |
| 4. RSS-Dependent Pages | 2/2 | Complete | 2026-03-01 |
| 5. Design System Elevation | 5/5 | Complete | 2026-03-01 |
| 6. Easter Eggs and Polish | 0/2 | Not started | - |

---

## Phase Details

### Phase 1: Foundation Cleanup
**Goal**: The codebase is a clean slate with old structure gone, new nav in place, and no orphaned routes that would 404 existing inbound links.
**Depends on**: Nothing (first phase)
**Requirements**: STRC-01, STRC-02, STRC-03, STRC-04, STRC-05
**Success Criteria** (what must be TRUE):
  1. The site navigation shows exactly five items: Home, About, Work, Ground Level, Contact — nothing else, in that order
  2. Visiting /portfolio, /blog, or /resume redirects the visitor to an appropriate new page rather than showing a 404
  3. The ThreeAudiences component is gone from the codebase and from the built site — no trace of the interactive demo renders anywhere
  4. Blog and portfolio content collections, their schemas, and their associated page routes are fully deleted and the build succeeds
  5. The footer displays LinkedIn and Substack links plus the contact email
**Plans**: TBD

### Phase 2: Shared Components
**Goal**: Every reusable component and the data layer exist and work correctly in isolation, so that pages in later phases can import and use them without reinventing fetch logic or data structures.
**Depends on**: Phase 1
**Requirements**: GRLV-04
**Success Criteria** (what must be TRUE):
  1. Running `npm run build` fetches Substack posts at build time with no client-side fetch and no CORS error
  2. If the Substack RSS feed is unavailable, the build still completes and renders a graceful fallback link instead of throwing an error
  3. Work items rendered via WorkCard display title, description, category tag, and an optional link — all from a single `src/data/work.ts` source
  4. The updated Header and Footer pass visual inspection with the new nav structure and social links from Phase 1
**Plans**: TBD

### Phase 3: Static Pages
**Goal**: About, Work, Work Archive, and Contact are complete, correctly voiced, and readable — with no external data dependencies that could block verification.
**Depends on**: Phase 1, Phase 2
**Requirements**: ABUT-01, ABUT-02, ABUT-03, WORK-01, WORK-02, WORK-03, WORK-04, WORK-05, WORK-06, CNTC-01, CNTC-02, CNTC-03
**Success Criteria** (what must be TRUE):
  1. The About page reads as a continuous personal essay — no section headers, no bullet lists, no CV structure, and every paragraph has generous spacing around it
  2. The body text column on the About page is comfortably readable and not stretched to full browser width on desktop
  3. The Work page shows curated entries organized by individual pieces of work, each with a title, short description, and link or note; category tags are visible but subtle
  4. A Work Archive page exists and is reachable from a link at the bottom of the Work page — it is not in the main nav
  5. The Contact page gives the email address plainly, includes LinkedIn and Substack links, uses contractions, and contains zero corporate language or em dashes
**Plans**: 3 plans
Plans:
- [x] 03-01-PLAN.md -- About page essay transformation (ABUT-01, ABUT-02, ABUT-03) — COMPLETE
- [x] 03-02-PLAN.md -- Work page restructure + Work Archive creation (WORK-01 through WORK-06) — COMPLETE
- [x] 03-03-PLAN.md -- Contact page simplification (CNTC-01, CNTC-02, CNTC-03) — COMPLETE (user approved)

### Phase 4: RSS-Dependent Pages
**Goal**: The Homepage and Ground Level page are complete and live — showing real Substack content pulled at build time, with the homepage landing experience matching the "person first" brief.
**Depends on**: Phase 2, Phase 3
**Requirements**: HOME-01, HOME-02, HOME-03, HOME-04, HOME-05, GRLV-01, GRLV-02, GRLV-03
**Success Criteria** (what must be TRUE):
  1. The homepage opens with Meredith's name and hero photo — the intro copy is the first thing a visitor reads after the name, and "MPH" does not appear in the main display
  2. The "What I'm Working On" section shows exactly 3 recent Substack posts, each with a title, date, excerpt, and link that opens the actual Substack post
  3. The "Selected Work" section shows 3 to 4 highlighted pieces with a visible "See more" link leading to the full Work page
  4. The Ground Level page has an intro paragraph explaining what Ground Level is, a Substack subscribe CTA, and 5 to 6 recent posts with title, date, excerpt, and link
**Plans**: 2 plans
Plans:
- [x] 04-01-PLAN.md -- Homepage three-beat rewrite (HOME-01, HOME-02, HOME-03, HOME-04, HOME-05) — COMPLETE 2026-03-01
- [x] 04-02-PLAN.md -- Ground Level page rewrite + visual verification (GRLV-01, GRLV-02, GRLV-03) — COMPLETE 2026-03-01

### Phase 5: Design System Elevation
**Goal**: The visual identity is cohesive, warm, and professional — every page benefits from the refined palette, typography, spacing, and entrance animations without any page feeling cramped or generic.
**Depends on**: Phase 3, Phase 4
**Requirements**: DSGN-01, DSGN-02, DSGN-03, DSGN-04, DSGN-05, DSGN-06, DSGN-07, SEO-01, SEO-02, SEO-03
**Success Criteria** (what must be TRUE):
  1. The color palette reads as a deliberate, evolved version of the existing greens and warm tones — not a replacement and not the old version unchanged
  2. Headings and body text use refined Playfair Display and Source Sans 3 weights and sizes that feel distinctive without being decorative
  3. Every section on every page has breathing room — nothing feels packed or cramped on desktop or mobile
  4. Scrolling down any page triggers subtle entrance animations on key sections; all animations respect `prefers-reduced-motion` and are absent for users who have that preference set
  5. The site renders correctly and looks good on a phone screen — tap targets are adequate, text is readable without zooming, nav works
  6. Social sharing previews show correct OG images and metadata reflecting the new design; the sitemap includes all new pages and excludes all removed routes
**Plans**: 5 plans
Plans:
- [x] 05-01-PLAN.md -- Design token foundation: color palette evolution, typography refinement, dead token cleanup, SITE_TITLE update (DSGN-01, DSGN-02, DSGN-07) — COMPLETE 2026-03-01
- [x] 05-02-PLAN.md -- Animation infrastructure: @keyframes fadeRise, .will-animate classes, stagger utilities, prefers-reduced-motion, ViewTransitions, IntersectionObserver (DSGN-03, DSGN-04) — COMPLETE 2026-03-01
- [x] 05-03-PLAN.md -- Page animations and spacing: .animate-on-scroll on all 6 pages, spacing uplift (DSGN-03, DSGN-05) — COMPLETE 2026-03-01
- [x] 05-04-PLAN.md -- Component polish: WorkCard and SubstackFeed refined hover states, --color-text-muted metadata tokens, user visual approval (DSGN-05, DSGN-06) — COMPLETE 2026-03-01
- [x] 05-05-PLAN.md -- SEO: OG image, BaseHead default, meta description rewrites, sitemap + canonical verification (SEO-01, SEO-02, SEO-03) — COMPLETE 2026-03-01

### Phase 6: Easter Eggs and Polish
**Goal**: The site has personality beyond content — Ember's click interaction and 2 additional micro-delights are working, accessible on touch, and feel specific to Meredith rather than generic web magic.
**Depends on**: Phase 5
**Requirements**: DLGT-01, DLGT-02, DLGT-03, DLGT-04
**Success Criteria** (what must be TRUE):
  1. Clicking any mention of "Ember" on the site triggers a visible, delightful reaction — a photo popup, particle animation, or similar — that works on both desktop click and mobile tap
  2. At least 2 additional micro-delight moments exist somewhere on the site — hover surprises, hidden elements, or playful interactions that feel specific to Meredith
  3. All Easter egg interactions have zero effect when `prefers-reduced-motion` is enabled — they either show a static version or do nothing
  4. All Easter egg interactions work correctly on iOS Safari and Android Chrome — no hover-only triggers, no interactions that require a mouse
**Plans**: 2 plans
Plans:
- [ ] 06-01-PLAN.md -- Ember click interaction: photo popup, gold particle burst, click escalation (DLGT-01, DLGT-03, DLGT-04)
- [ ] 06-02-PLAN.md -- About page footnote tooltips + hidden footer message (DLGT-02, DLGT-03, DLGT-04)

---

## Requirement Coverage

| Requirement | Phase | Description |
|-------------|-------|-------------|
| STRC-01 | Phase 1 | Nav shows exactly 5 items |
| STRC-02 | Phase 1 | Old routes redirect instead of 404 |
| STRC-03 | Phase 1 | ThreeAudiences component removed |
| STRC-04 | Phase 1 | Blog/portfolio collections removed |
| STRC-05 | Phase 1 | Footer has LinkedIn, Substack, email |
| HOME-01 | Phase 4 | Homepage name + hero photo, no MPH |
| HOME-02 | Phase 4 | Homepage final intro copy |
| HOME-03 | Phase 4 | Homepage 3 recent Substack posts |
| HOME-04 | Phase 4 | Homepage 3-4 selected work pieces |
| HOME-05 | Phase 4 | Homepage "See more" link to Work |
| ABUT-01 | Phase 3 | About page full essay narrative |
| ABUT-02 | Phase 3 | About page reading line-length |
| ABUT-03 | Phase 3 | About page paragraph spacing |
| GRLV-01 | Phase 4 | Ground Level description paragraph |
| GRLV-02 | Phase 4 | Ground Level Substack subscribe CTA |
| GRLV-03 | Phase 4 | Ground Level 5-6 recent posts |
| GRLV-04 | Phase 2 | RSS fetched at build time (not client-side) |
| WORK-01 | Phase 3 | Work page curated by actual pieces |
| WORK-02 | Phase 3 | Work entries show title, description, link |
| WORK-03 | Phase 3 | Work page uses placeholder entries |
| WORK-04 | Phase 3 | Work page has subtle category tags |
| WORK-05 | Phase 3 | Work Archive linked from Work, not nav |
| WORK-06 | Phase 3 | Work Archive is comprehensive listing |
| CNTC-01 | Phase 3 | Contact page warm, human, email shown |
| CNTC-02 | Phase 3 | Contact page LinkedIn and Substack links |
| CNTC-03 | Phase 3 | Contact page follows voice rules |
| DSGN-01 | Phase 5 | Color palette evolved, not replaced |
| DSGN-02 | Phase 5 | Typography refined Playfair + Source Sans |
| DSGN-03 | Phase 5 | Generous whitespace throughout |
| DSGN-04 | Phase 5 | Scroll-triggered entrance animations |
| DSGN-05 | Phase 5 | Smooth page transitions and hover states |
| DSGN-06 | Phase 5 | Mobile-responsive across all pages |
| DSGN-07 | Phase 5 | All copy follows voice rules |
| DLGT-01 | Phase 6 | Ember click interaction |
| DLGT-02 | Phase 6 | 2-3 additional micro-delights |
| DLGT-03 | Phase 6 | Easter eggs feel personal, not generic |
| DLGT-04 | Phase 6 | All interactions respect reduced-motion + touch |
| SEO-01 | Phase 5 | OG images updated for new design |
| SEO-02 | Phase 5 | Sitemap regenerated for new structure |
| SEO-03 | Phase 5 | Canonical URLs correct for all new pages |

**Total v1 requirements:** 40
**Mapped:** 40
**Unmapped:** 0
**Coverage:** 100%

---

## Dependencies

```
Phase 1 (Foundation Cleanup)
    |
    v
Phase 2 (Shared Components)
    |
    v
Phase 3 (Static Pages) ----+
    |                      |
    v                      v
Phase 4 (RSS-Dependent Pages)
    |
    v
Phase 5 (Design System Elevation)
    |
    v
Phase 6 (Easter Eggs and Polish)
```

---

*Roadmap created: 2026-02-28*
*Last updated: 2026-03-01 after 05-05 completion (SEO — OG social card, MPH-free meta descriptions, sitemap + canonical verification; Phase 5 complete)*
