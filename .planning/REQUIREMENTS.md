# Requirements: meredithmcgee.org Rebuild

**Defined:** 2026-02-28
**Core Value:** The site makes visitors think "this person is interesting, I want to keep reading." Person first, work second.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Structure

- [x] **STRC-01**: Site navigation displays exactly 5 items: Home, About, Work, Ground Level, Contact
- [x] **STRC-02**: Old routes (/portfolio, /blog, /resume, /blog/*) redirect to appropriate new pages instead of 404ing
- [x] **STRC-03**: ThreeAudiences interactive demo component is removed
- [x] **STRC-04**: Blog and portfolio content collections, schemas, and associated pages are removed
- [x] **STRC-05**: Footer displays LinkedIn and Substack social links plus email

### Homepage

- [x] **HOME-01**: Homepage opens with Meredith's name and hero photo, no "MPH" in the main display
- [x] **HOME-02**: Homepage displays final intro copy as the first thing visitors read after the name
- [x] **HOME-03**: Homepage "What I'm Working On" section shows 3 most recent Substack posts with title, date, excerpt, and link to Substack
- [x] **HOME-04**: Homepage "Selected Work" section displays 3-4 highlighted pieces with title, description, and link
- [x] **HOME-05**: Homepage has a "See more" link from Selected Work to the full Work page

### About

- [ ] **ABUT-01**: About page displays the full narrative essay copy in a continuous, essay-style layout
- [ ] **ABUT-02**: About page has good reading line-length (not full-width text)
- [ ] **ABUT-03**: About page has generous spacing between paragraphs, feels like reading a personal essay

### Ground Level

- [ ] **GRLV-01**: Ground Level page displays brief description of what Ground Level is
- [ ] **GRLV-02**: Ground Level page includes Substack subscribe CTA
- [ ] **GRLV-03**: Ground Level page shows 5-6 most recent Substack posts with title, date, excerpt, and link
- [x] **GRLV-04**: Substack RSS is fetched at build time (not client-side) to avoid CORS issues

### Work

- [x] **WORK-01**: Work page displays curated highlights organized by actual pieces of work, not abstract categories
- [x] **WORK-02**: Each work piece shows title, short description of what it is and what it did, and link if available
- [x] **WORK-03**: Work page uses placeholder entries with real descriptive text until final content is provided
- [x] **WORK-04**: Work page has subtle category tags (research, grants, writing, projects) for visual context
- [x] **WORK-05**: Work Archive subpage linked from bottom of Work page, not in main nav
- [x] **WORK-06**: Work Archive is a comprehensive, utilitarian listing

### Contact

- [x] **CNTC-01**: Contact page is warm, human, and direct with email address displayed
- [x] **CNTC-02**: Contact page includes LinkedIn and Substack links
- [x] **CNTC-03**: Contact page copy follows voice rules (no em dashes, contractions, no corporate language)

### Design

- [ ] **DSGN-01**: Color palette evolves existing greens/browns/warm tones to feel more professional and cohesive
- [ ] **DSGN-02**: Typography refines Playfair Display + Source Sans 3 with tuned weights, sizes, and spacing
- [ ] **DSGN-03**: Layout has generous whitespace throughout, nothing feels cramped
- [ ] **DSGN-04**: Subtle scroll-triggered entrance animations on key sections
- [ ] **DSGN-05**: Smooth page transitions and hover states feel alive but not flashy
- [ ] **DSGN-06**: Site is mobile-responsive and looks great on a phone
- [ ] **DSGN-07**: All copy follows voice rules: no em dashes, no bullet points in prose, contractions always, no corporate buzzwords

### Delight

- [ ] **DLGT-01**: Clicking Ember's name anywhere on the site triggers a photo popup or small animation
- [ ] **DLGT-02**: 2-3 additional micro-delights spread throughout the site (hover surprises, hidden elements, playful moments)
- [ ] **DLGT-03**: Easter eggs feel personal to Meredith, not generic web magic
- [ ] **DLGT-04**: All interactions respect prefers-reduced-motion and work on touch devices

### SEO

- [ ] **SEO-01**: Open Graph images updated to reflect new design for correct social sharing previews
- [ ] **SEO-02**: Sitemap regenerated for new page structure
- [ ] **SEO-03**: Canonical URLs correct for all new pages

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Content

- **CONT-01**: Work page populated with final curated content (once provided)
- **CONT-02**: Work Archive populated with comprehensive listing
- **CONT-03**: Updated photos (hero, headshot, Ember) if new ones are provided

### Automation

- **AUTO-01**: Scheduled GitHub Actions rebuild (daily cron) to keep Substack posts fresh
- **AUTO-02**: Automated Lighthouse CI checks on deploy

## Out of Scope

| Feature | Reason |
|---------|--------|
| Dark mode toggle | Splits design attention; commit to one warm palette done well |
| Blog with internal publishing | Ground Level on Substack is the writing home; site just surfaces it |
| Service offerings or rates page | Transforms personal site into vendor site |
| Skills lists or competency grids | "Show, don't list" via Work page |
| Testimonials or logos section | Social proof widgets signal agency, not person |
| Newsletter signup popup | Universally disliked; inline Substack CTA is sufficient |
| Social media feed embeds | Slow, fragile, clutters layout |
| Case study deep-dives with metrics | Consulting portfolio language, wrong for this site |
| Resume in primary nav | Wrong signal for established professional's home base |
| Mobile app | Web only |
| CMS or admin panel | Content managed via files |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| STRC-01 | Phase 1 | Pending |
| STRC-02 | Phase 1 | Pending |
| STRC-03 | Phase 1 | Pending |
| STRC-04 | Phase 1 | Pending |
| STRC-05 | Phase 1 | Pending |
| HOME-01 | Phase 4 | Pending |
| HOME-02 | Phase 4 | Pending |
| HOME-03 | Phase 4 | Pending |
| HOME-04 | Phase 4 | Pending |
| HOME-05 | Phase 4 | Pending |
| ABUT-01 | Phase 3 | Pending |
| ABUT-02 | Phase 3 | Pending |
| ABUT-03 | Phase 3 | Pending |
| GRLV-01 | Phase 4 | Pending |
| GRLV-02 | Phase 4 | Pending |
| GRLV-03 | Phase 4 | Pending |
| GRLV-04 | Phase 2 | Complete |
| WORK-01 | Phase 3 | Complete |
| WORK-02 | Phase 3 | Complete |
| WORK-03 | Phase 3 | Complete |
| WORK-04 | Phase 3 | Complete |
| WORK-05 | Phase 3 | Complete |
| WORK-06 | Phase 3 | Complete |
| CNTC-01 | Phase 3 | Complete |
| CNTC-02 | Phase 3 | Complete |
| CNTC-03 | Phase 3 | Complete |
| DSGN-01 | Phase 5 | Pending |
| DSGN-02 | Phase 5 | Pending |
| DSGN-03 | Phase 5 | Pending |
| DSGN-04 | Phase 5 | Pending |
| DSGN-05 | Phase 5 | Pending |
| DSGN-06 | Phase 5 | Pending |
| DSGN-07 | Phase 5 | Pending |
| DLGT-01 | Phase 6 | Pending |
| DLGT-02 | Phase 6 | Pending |
| DLGT-03 | Phase 6 | Pending |
| DLGT-04 | Phase 6 | Pending |
| SEO-01 | Phase 5 | Pending |
| SEO-02 | Phase 5 | Pending |
| SEO-03 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 40 total
- Mapped to phases: 40
- Unmapped: 0

---
*Requirements defined: 2026-02-28*
*Last updated: 2026-02-28 after roadmap creation — all 40 requirements mapped*
