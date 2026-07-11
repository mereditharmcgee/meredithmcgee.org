# Phase 3: Static Pages - Research

**Researched:** 2026-02-28
**Status:** Ready for planning

---

## What This Phase Does

Phase 3 transforms three existing page files (about.astro, work.astro, contact.astro) and creates one new page (work archive). No new components, no external data fetches, no new dependencies. Every component it needs already exists from Phase 1 and 2. The work is content restructuring, layout simplification, and writing that matches the voice rules.

---

## Existing Code: What Each File Looks Like Now

### about.astro

Current structure: 6 sections with named headers ("What Guides My Work," "How I Work," "What Got Me Here," "What Keeps Me Going," "What Brings Me Joy"), plus a hero section. The "What Got Me Here" section uses a `story-block` pattern with institution logos (Rochester, Lafayette, Lavender Lane, Yale, Bradbury-Sullivan, Parabola) displayed alongside biographical paragraphs.

The page container for hero is `max-width: 1100px` in a two-column grid. Text-only sections use `max-width: 800px` and the background section uses `max-width: 900px`. The joy section reverts to `max-width: 1100px` with a two-column layout.

Photos: `/meredith-headshot.jpg` (hero, left column) and `/family-photo.jpg` (joy section, right column). Both exist in `/public/`.

Section sequence: bg-dark (hero) > bg-light > bg-medium > bg-dark > bg-light > bg-medium.

The About page content is marked "FINAL" in STATE.md. The existing paragraphs in about.astro ARE that final content, just structured wrong. The copy itself does not need to be rewritten from scratch; it needs to be restructured from 6 sections + logos + headers into flowing paragraphs with no headers, no story-blocks, no logos.

Voice check on current copy: it mostly passes. A few places use "leverage" proximity ("utilizing" appears once). No em dashes found. No bullet points. Contractions are present but sparse.

### work.astro

Current structure: hero section, then 6 numbered service blocks (Grant Writing, Strategic Messaging, Research Translation, Content Strategy, Evaluation, Community Communications), then an "Areas of Focus" grid with 5 icon cards linking to `/portfolio#*` (those routes no longer exist), then a "Currently Interested In" tag cloud, then a CTA section "Let's Work Together."

The entire content must be replaced. None of the current content (service blocks, focus cards, interest tags, CTA) survives into Phase 3. What replaces it: a brief capabilities intro (1-2 paragraphs), then 4 WorkCard components (featured items from work.ts), then a plain text link to the archive.

`work.ts` has 8 items total: 4 with `featured: true`, 4 with `featured: false`. The Work page shows only featured items; the Archive shows all 8.

### contact.astro

Current structure: hero section + two-column layout. Left column: "Get in Touch" heading, two paragraphs, a bulleted interest list, then "Prefer email?" subheading with the email address. Right column: a dark-background form box containing name, email, subject dropdown (5 options), and message textarea.

The entire two-column layout must be replaced with a single centered column. The subject dropdown must be removed. The bulleted interest list must be removed. The tone must shift from corporate ("I welcome the conversation") to casual ("I'd love to hear from you").

Formspree endpoint: `https://formspree.io/f/xgooeagz` -- confirmed kept, simplified. The form fields that remain: name, email, message.

Email address: `meredith.ar.mcgee@gmail.com` (already in the file, confirmed correct).
LinkedIn: `https://www.linkedin.com/in/meredith-mcgee`
Substack: `https://meredithmcgee.substack.com`

Contact page current voice failures:
- "I welcome the conversation" -- corporate, no contractions
- "I'm particularly interested in opportunities involving" -- followed by bullet list
- "Prefer email?" heading -- slightly awkward framing

### WorkCard.astro (component to reuse)

Displays: category tag (small, uppercase, 0.6 opacity), title (linked if `link` prop present), description, "Read more" arrow link (if `link` prop present). Styled for a dark background -- colors use `var(--color-gold)` for title and link, `var(--color-cream)` for description, with `opacity: 0.6` on the category tag. Bottom border separator between cards, removed on last child.

The component is designed for dark section backgrounds. The Work and Archive pages need to use a dark background section to match what WorkCard expects, or the card styles will need adjustment (but context says this is left to Claude's discretion).

---

## New Page: Work Archive

**Does not exist yet.** Must be created.

Route options (left to Claude's discretion per CONTEXT.md):
- `src/pages/work/archive.astro` -- results in URL `/work/archive`
- `src/pages/work-archive.astro` -- results in URL `/work-archive`

The `/work/archive` route is cleaner and hierarchically correct. No reason to prefer the hyphenated version. Choosing `/work/archive` is the clear call.

Creating `src/pages/work/archive.astro` requires creating a `work/` subdirectory under `src/pages/`. This is standard Astro file-based routing; no configuration needed.

The archive shows all 8 work items (featured + non-featured) as a flat list. No grouping by category. Uses WorkCard for each item. The Work page link at the bottom must point to `/work/archive`.

---

## Established Patterns to Follow

From CONVENTIONS.md and the existing page files:

**Page structure:** Pages are self-contained Astro files -- no layout wrapper. Each imports `BaseHead`, `Header`, `Footer`, `SITE_TITLE` directly. The pattern is consistent across about.astro, work.astro, contact.astro, and must be followed in the new archive page.

**CSS scoping:** Page-specific styles go in a scoped `<style>` block at the bottom of the file. Global utilities (`.container`, `.bg-dark`, `.bg-light`, `.bg-medium`, `.bg-pattern`, `.btn`) come from `global.css` -- do not duplicate them.

**Container max-widths:** 800px for text-heavy content (used in guides, how-i-work, keeps-going sections). 1100px for wider layouts. The About essay must use `max-width: 65ch` or `max-width: 700px` / `max-width: 800px` to satisfy ABUT-02 (comfortably readable line-length). The current 800px container is reasonable; the key is ensuring the container is not overridden wider.

**Section backgrounds:** Alternating `bg-dark`, `bg-light`, `bg-medium`. The WorkCard component is styled for dark backgrounds -- using a `bg-dark` section for the work list is correct.

**Responsive breakpoints:** 968px and 768px. Both must be handled in any new layout.

**Import path:** WorkCard import in the new archive page: `import WorkCard from '../../components/WorkCard.astro'` (two levels up from `src/pages/work/`).

Work data import in the archive page: `import { work } from '../../data/work.ts'`.

---

## Content Analysis by Page

### About Page: What to Keep and What to Cut

**Keep:** All the biographical content -- Rochester, Lafayette, Lavender Lane/OUT Lafayette/AIDS Quilt, Yale (MPH, CBT trial, cannabis BRFSS analysis, program evaluation research), Bradbury-Sullivan (development role, $1M+ grants), Parabola (cannabis policy, qualitative study in development). Personal content: K, Ember, theater, painting, reading, nature.

**Cut:** All 6 section headers. The story-block layout (logos + text). The `story-conclusion` italic paragraph at the bottom of the background section. The segmented section backgrounds -- the essay should flow as fewer, larger sections or even a single section. The hero's two-column photo/text layout -- the photo can be placed differently in the essay.

**Reshape:** All biographical content becomes flowing paragraphs. Photos (headshot and family photo) are placed inline within the essay as visual breaks. The suggested arc: open with who she is now > Rochester + Lafayette > Lavender Lane/AIDS Quilt > stepping back from track (briefly) > Yale > Bradbury-Sullivan > Parabola/Boston > K, Ember, theater, painting. End warm.

**Paragraph spacing (ABUT-03):** The current `.text-content p` has `margin-bottom: 1rem`. For a personal essay feel, this should be increased to something like `margin-bottom: 1.75rem` or `margin-bottom: 2rem`. The requirement is "generous spacing" that "feels like reading a personal essay."

**Reading width (ABUT-02):** Current max-width for text sections is 800px. At `font-size: 18px` (the global body size), 800px is approximately 60-70 characters per line depending on the font. This is within the acceptable range for readability. The key thing to avoid is the 1100px wide sections used in the hero and joy layouts -- those must not apply to the essay body.

### Work Page: What the New Structure Is

1. Page header / intro section (bg-dark bg-pattern): brief heading, 1-2 paragraph capabilities intro
2. Featured work section (bg-dark): 4 WorkCard components, one for each featured item in work.ts
3. Archive link (same section or its own): plain text link -- "See full archive" or similar -- understated, not a button

The featured items from work.ts:
1. Cannabis and Psychiatric Risk: A Two-Study Analysis (RESEARCH, has Substack link)
2. Parabola Center Content Strategy (WRITING, has parabolacenter.com link)
3. Bradbury-Sullivan LGBT Community Center Grant Portfolio (GRANTS, no link)
4. Yale School of Public Health Program Evaluation (EVALUATION, has ysph.yale.edu link)

These are placeholder entries per WORK-03 -- the requirement explicitly says to use placeholder entries with real descriptive text until final content is provided. The existing entries in work.ts already meet this bar.

### Contact Page: New Layout

Single centered column. Warm intro text (1-2 sentences, conversational). Email address displayed plainly (as a mailto link). LinkedIn and Substack links. Then the simplified form below.

The form keeps Formspree. Fields: name, email, message. Subject dropdown removed. The dark form box styling from the current version can be adapted or simplified.

One casual sentence about interests (public health, writing, community work) -- not a bulleted list, per CNTC-03.

Voice target: "Like talking to someone at a coffee shop." Reference from CONTEXT.md: "I'd love to hear from you. Here's my email. Let's talk." Not "I welcome the conversation."

Contractions throughout. No em dashes. No corporate language. LinkedIn and Substack links must be present (CNTC-02).

---

## Risk Areas and Judgment Calls

### Voice Drift on About Page

The existing copy in about.astro passes most voice rules. The restructuring itself does not require wholesale rewriting. However, merging content from 6 sections into flowing paragraphs will require some connective tissue sentences. Those new sentences are where voice drift can creep in. Any connective writing must use contractions, avoid em dashes, and lead with concrete rather than thesis.

Watch in particular for: the transition from the professional/biographical content to the personal (Ember, K, theater, painting). The current "What Brings Me Joy" section opens "Outside of my work, I am still drawn to many of the things..." -- this has no contraction ("I am" instead of "I'm") and is a bit stiff. A rewrite should tighten this.

### WorkCard on Light vs. Dark Backgrounds

WorkCard.astro uses `var(--color-gold)` for titles and `var(--color-cream)` for description text, with `opacity: 0.6` on the category tag. These colors are designed for dark backgrounds. If the Work page or Archive uses a light background section (`bg-light`), the WorkCard text will be nearly invisible.

The safe choice: use `bg-dark` or `bg-medium` for any section containing WorkCards. This matches the existing global CSS where `.bg-light p` and `.bg-light h*` override to `var(--color-dark)`, which would conflict with WorkCard's hardcoded color values.

### Archive Page Route

Using `src/pages/work/archive.astro` creates the URL `/work/archive`. This is clean and correct. The sitemap integration (from Phase 5) will pick it up automatically. No special configuration needed in `astro.config.mjs`.

The Work page link to the archive should use `href="/work/archive"` -- a plain anchor, not a button.

### Formspree Form Simplification

The subject dropdown removal is straightforward: delete the `<div class="form-group">` block containing `<select id="subject">`. The Formspree endpoint stays the same. The `name`, `email`, and `message` fields remain and still work with the existing Formspree form ID.

### STATE.md Research Flag

STATE.md has this open flag: "Before Phase 3: Confirm Formspree form decision: keep, simplify, or remove." The CONTEXT.md has resolved this: keep the form, simplify it to name/email/message only. This flag can be marked resolved when Phase 3 begins.

---

## Plan Structure Recommendation

Phase 3 has 4 distinct deliverables. Given that each page is self-contained and the archive page is new, this maps cleanly to 3 plans:

**Plan 03-01: About Page** -- Full content restructuring into essay format. This is the most work because it requires the most content judgment. It has the clearest success criteria (ABUT-01, ABUT-02, ABUT-03).

**Plan 03-02: Work Page + Work Archive** -- Restructure work.astro and create the new archive.astro. These two belong together because the archive depends on how the Work page links to it. Both use WorkCard and work.ts. Requirements: WORK-01 through WORK-06.

**Plan 03-03: Contact Page** -- Simplest of the three. Layout restructure, form simplification, voice rewrite. Requirements: CNTC-01, CNTC-02, CNTC-03.

Alternative: 2 plans (About | Work+Archive+Contact). But Contact has its own distinct requirements and voice concerns that benefit from dedicated focus. 3 plans is the right call.

---

## Pre-Implementation Checklist

Before coding begins on any plan, confirm:

- [ ] The About essay content from about.astro is the FINAL content (STATE.md says "FINAL (provided by user)" -- confirmed, the copy in the file is what should be restructured)
- [ ] work.ts placeholder entries are acceptable for Phase 3 (yes -- WORK-03 explicitly allows placeholder entries)
- [ ] Formspree decision resolved: keep and simplify (confirmed per CONTEXT.md)
- [ ] Archive URL: `/work/archive` via `src/pages/work/archive.astro` (Claude's discretion call, decided here)
- [ ] Photos to use: `/meredith-headshot.jpg` and `/family-photo.jpg` -- both exist in `/public/`, both kept

---

## Key Files for Implementation

| File | Action | Notes |
|------|--------|-------|
| `src/pages/about.astro` | Full rewrite | Keep content, change structure |
| `src/pages/work.astro` | Full rewrite | Replace services/focus/CTA with WorkCard list |
| `src/pages/contact.astro` | Full rewrite | Single column, simplified form, casual voice |
| `src/pages/work/archive.astro` | Create new | All 8 work items via WorkCard |
| `src/data/work.ts` | No changes | Already correct |
| `src/components/WorkCard.astro` | No changes | Already correct |
| `src/styles/global.css` | No changes | Already has needed utilities |

---

*Phase: 03-static-pages*
*Research completed: 2026-02-28*
