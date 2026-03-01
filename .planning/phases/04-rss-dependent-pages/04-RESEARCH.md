# Phase 4: RSS-Dependent Pages - Research

**Researched:** 2026-03-01
**Domain:** Astro page composition, SubstackFeed integration, work data filtering
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Homepage structure is three beats: Intro (name, photo, copy), What I'm Working On (3 recent Substack posts), Selected Work (3-4 featured work items + "See more" link)
- No "MPH" in the main homepage display
- Homepage intro copy is FINAL (verbatim from CONTEXT.md and WEBSITE-SPEC.md)
- SubstackFeed component used for both pages — no new fetch logic
- Ground Level page: short description paragraph, subscribe CTA (link only, no embedded form), 5-6 recent posts via SubstackFeed
- No new external dependencies

### Claude's Discretion
- Hero photo sizing and placement
- Exact layout of the three beats (spacing, background sections)
- Ground Level page styling and subscribe CTA implementation
- How many work items to show in Beat 3 (3 or 4)
- Whether to show SubstackFeed excerpts as HTML or plain text

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| HOME-01 | Homepage opens with name and hero photo, no "MPH" in main display | Hero section rewrite: h1 is just "Meredith McGee", photo from /meredith-headshot.jpg |
| HOME-02 | Homepage displays final intro copy as the first thing visitors read after the name | Full FINAL copy confirmed in CONTEXT.md and WEBSITE-SPEC.md — verbatim paragraph |
| HOME-03 | "What I'm Working On" shows 3 most recent Substack posts with title, date, excerpt, link | SubstackFeed with `limit={3}` — component already handles everything |
| HOME-04 | "Selected Work" shows 3-4 highlighted pieces with title, description, link | Filter `work` array by `featured: true`, pass each to WorkCard — exactly 4 featured items in work.ts |
| HOME-05 | "See more" link from Selected Work to /work | Plain anchor `<a href="/work">` styled to match existing archive-link pattern |
| GRLV-01 | Ground Level page displays brief description of what Ground Level is | One paragraph, copy locked: "Ground Level is my Substack about cannabis, public health, and the gap between policy and practice." |
| GRLV-02 | Ground Level page includes Substack subscribe CTA | Link to https://meredithmcgee.substack.com (SUBSTACK_URL from consts.ts), styled as .btn |
| GRLV-03 | Ground Level shows 5-6 most recent posts with title, date, excerpt, link | SubstackFeed with `limit={6}` — same component, different count |
</phase_requirements>

---

## Summary

Phase 4 is almost entirely composition work. Both pages are built entirely from components and data sources that already exist and have been verified working. SubstackFeed (built in Phase 2) handles all RSS fetching with a `limit` prop that controls post count. WorkCard (built in Phase 2) handles work item rendering. The work data layer (`src/data/work.ts`) already has a `featured` boolean field with exactly 4 items marked `featured: true`.

The current `src/pages/index.astro` is a full rewrite — the old structure (three approach cards, three featured-card divs, about preview section) is entirely gone and replaced with the three-beat layout. The current `src/pages/ground-level.astro` exists but is a stub with no SubstackFeed integration — it needs to be rewritten with the feed added and the CTA made prominent.

**Primary recommendation:** Write index.astro from scratch following the about.astro and work.astro structural pattern (no layout wrapper, scoped styles, bg-dark / bg-light / bg-medium alternating sections). Rewrite ground-level.astro to add SubstackFeed with `limit={6}` and a properly styled subscribe CTA.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 5.x (existing) | Page framework | Project framework — no change |
| fast-xml-parser | existing (in SubstackFeed) | RSS parsing | Already installed and tested in Phase 2 |

### Reused Components
| Component | File | Props | Notes |
|-----------|------|-------|-------|
| SubstackFeed | `src/components/SubstackFeed.astro` | `limit?: number` (default 3) | Fetches RSS at build time, renders post cards |
| WorkCard | `src/components/WorkCard.astro` | `title`, `description`, `category`, `link?` | Designed for dark backgrounds |
| Header | `src/components/Header.astro` | none | Fixed nav, already has all 5 links |
| Footer | `src/components/Footer.astro` | none | Already complete from Phase 1/2 |
| BaseHead | `src/components/BaseHead.astro` | `title`, `description` | SEO head tags |

### Data Sources
| Source | File | Key Fields | Notes |
|--------|------|-----------|-------|
| work.ts | `src/data/work.ts` | `title`, `description`, `category`, `link?`, `featured` | 4 featured items (filter `item.featured`) |
| consts.ts | `src/consts.ts` | `SITE_TITLE`, `SUBSTACK_URL`, `SUBSTACK_FEED_URL` | SUBSTACK_URL is the subscribe base URL |

### No New Dependencies
No new packages needed. This phase is pure composition.

---

## Architecture Patterns

### Page Structure Pattern (from existing pages)

All pages in this codebase follow the same pattern — no layout wrapper. Each page is a standalone `.astro` file that includes `<html>`, `<head>`, `<body>`, and a scoped `<style>` block.

```astro
---
import BaseHead from '../components/BaseHead.astro';
import Footer from '../components/Footer.astro';
import Header from '../components/Header.astro';
// other imports
---

<!doctype html>
<html lang="en">
  <head>
    <BaseHead title="..." description="..." />
  </head>
  <body>
    <Header />
    <!-- sections here -->
    <Footer />
  </body>
</html>

<style>
  /* scoped styles */
</style>
```

### Section Background Pattern (from global.css)

The design system uses alternating section backgrounds via CSS classes. The utility classes affect heading and text color automatically:

```css
.bg-dark   /* #3d4a2a — headings gold, text cream — WorkCard designed for this */
.bg-medium /* #6b7c4c */
.bg-light  /* #a8b18f — headings and text flip to dark */
.bg-pattern /* adds subtle botanical SVG overlay via ::before pseudo-element */
```

WorkCard explicitly uses `var(--color-gold)` and `var(--color-cream)` — it MUST be rendered on a dark background. SubstackFeed also uses gold/cream tokens. Beat 2 and Beat 3 on the homepage, and the post feed section on Ground Level, must use `bg-dark` (or similarly dark section) for the components to render correctly.

### Section Padding

Global CSS sets `section { padding: 5rem 0; }` — all `<section>` elements get this by default. Override with scoped styles if a section needs more or less breathing room. Mobile breakpoint reduces to `3rem 0`.

### Container Widths in Use

| Context | Max-width | Usage |
|---------|-----------|-------|
| Wide content (cards, hero) | 1100px | Work hero, current index.astro hero |
| Text content (readable) | 800px | Work list, about essay, ground-level stub |
| Extra narrow | 700px | current ground-level stub |

For the homepage hero/intro: 800px text column centered is the established readable-content pattern. The hero can use a wider container if the photo sits beside the text, or stack to 800px if the photo is above/below on desktop.

### WorkCard Iteration Pattern (from work.astro)

```astro
---
import { work } from '../data/work';
import WorkCard from '../components/WorkCard.astro';

const featuredWork = work.filter(item => item.featured);
---

{featuredWork.map(item => (
  <WorkCard
    title={item.title}
    description={item.description}
    category={item.category}
    link={item.link}
  />
))}
```

The `work.ts` file currently has exactly 4 items with `featured: true`. The planner can limit to 3 with `.slice(0, 3)` or show all 4 — both are within the user's stated discretion range.

### SubstackFeed Usage Pattern

```astro
---
import SubstackFeed from '../components/SubstackFeed.astro';
---

<!-- 3 posts (homepage Beat 2) -->
<SubstackFeed limit={3} />

<!-- 6 posts (Ground Level page) -->
<SubstackFeed limit={6} />
```

The component defaults to `limit={3}` if the prop is omitted. For Ground Level's 5-6 post requirement, `limit={6}` is the correct value — it will show up to 6 posts, fewer if the feed has fewer.

### "See More" / Archive Link Pattern (from work.astro)

```astro
<div class="archive-link">
  <a href="/work">See all work &rarr;</a>
</div>
```

```css
.archive-link {
  margin-top: 2rem;
  text-align: center;
}
.archive-link a {
  font-family: 'Source Sans 3', 'Source Sans Pro', sans-serif;
  font-size: 0.95rem;
  color: var(--color-gold);
  text-decoration: none;
  letter-spacing: 0.02em;
  transition: color 0.2s ease;
}
.archive-link a:hover {
  color: var(--color-cream);
}
```

Reuse this exact pattern on the homepage Beat 3 "See more" link to /work.

### Subscribe CTA Pattern (Ground Level)

Use a `.btn` anchor link to the Substack subscribe page. The existing `.btn` class from global.css handles all styling:

```astro
---
import { SUBSTACK_URL } from '../consts';
---

<a href={SUBSTACK_URL} target="_blank" rel="noopener noreferrer" class="btn">
  Subscribe on Substack
</a>
```

No embedded form, no popup. SUBSTACK_URL is `https://meredithmcgee.substack.com`. Substack's subscribe page is accessible directly at that URL.

### Anti-Patterns to Avoid

- **Client-side fetch for Substack:** Any `<script>` tag that `fetch()`es the Substack URL will CORS-fail at runtime. SubstackFeed does the fetch in the frontmatter (build time). Never move it to a `<script>` block.
- **"MPH" in the h1:** The new homepage h1 must be "Meredith McGee" — no title. The old `index.astro` h1 is "Meredith McGee, MPH" — this needs to be changed.
- **Retaining old index.astro sections:** The entire body of the current `index.astro` (approach cards, featured-card divs, about-preview section) is removed. There's no selective edit here — it's a full rewrite.
- **WorkCard on light backgrounds:** WorkCard uses `var(--color-gold)` for titles and `var(--color-cream)` for text. On `.bg-light` sections these become invisible. Beat 3 must use `.bg-dark`.
- **SubstackFeed on light backgrounds:** Same constraint as WorkCard — the component's styles use gold/cream tokens that require a dark background.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| RSS fetch + parse | Custom fetch/parse in page frontmatter | Import SubstackFeed component | Already handles edge cases: CDATA wrapping, single-item normalization, fetch failure fallback |
| Post card UI | Custom article/div structure in page | SubstackFeed's built-in rendering | Component already renders time, h3+a, p with correct tokens |
| Work card UI | Custom card markup | Import WorkCard component | Component handles title link, category tag, description, read-more arrow |
| Work data filter | Hardcoded items in page | `work.filter(i => i.featured)` | Single source of truth in work.ts |
| Nav + Footer | Copy-paste markup | Import Header and Footer | Already correct and complete from Phase 1/2 |

**Key insight:** This phase is assembly, not construction. Every building block exists. The planner's job is connecting them in the right order with the right props.

---

## Common Pitfalls

### Pitfall 1: Keeping Any Part of the Old index.astro Structure
**What goes wrong:** The old approach cards, featured-card divs, and about-preview section use classes and markup that conflict with or duplicate the new three-beat layout. Partial edits leave orphaned CSS.
**Why it happens:** Temptation to "reuse" existing sections that look similar
**How to avoid:** Full rewrite. Start from the work.astro structure as a template — blank sections, new class names, new scoped styles.
**Warning signs:** Any reference to `.approach-card`, `.featured-card`, `.about-preview`, `.hero-subtitle`, `.hero-buttons` in the new file

### Pitfall 2: SubstackFeed Renders as Empty on bg-light
**What goes wrong:** If SubstackFeed or WorkCard is placed inside a `.bg-light` section, the post titles (gold) and text (cream) become nearly invisible against the light olive background.
**Why it happens:** Components use dark-background color tokens baked into their scoped styles
**How to avoid:** Always wrap SubstackFeed and WorkCard in `.bg-dark` sections on the homepage
**Warning signs:** Post titles not visible after build

### Pitfall 3: excerpt Contains Raw HTML
**What goes wrong:** Substack RSS descriptions sometimes contain HTML tags (`<p>`, `<a>`, etc). Rendering `{post.excerpt}` as text shows raw HTML tags to the user.
**Why it happens:** The SubstackFeed component renders `<p>{post.excerpt}</p>` — Astro escapes HTML by default so tags appear as literal text
**How to avoid:** This is actually the SAFE behavior for user-generated content. Excerpts showing some HTML characters are acceptable for a static site without sanitization. The current SubstackFeed behavior (plain text rendering via `{post.excerpt}`) is correct and intentional per project decisions. Do not switch to `set:html` without sanitization.
**Warning signs:** Visible `&lt;p&gt;` or `&lt;a&gt;` strings in post previews — acceptable tradeoff

### Pitfall 4: Voice Drift on Section Headings
**What goes wrong:** Section headings like "What I'm Working On Right Now" or "Selected Work" can drift into corporate language if reworded during implementation.
**Why it happens:** Copy written quickly during implementation
**How to avoid:** Use contractions, be concrete, check against voice rules before marking plan done
**Warning signs:** Any of: "leverage," "cross-disciplinary," em dash, bullet points in prose, "explore our," "dynamic"

### Pitfall 5: Ground Level Page Missing Sections
**What goes wrong:** The existing ground-level.astro is a stub with only a title and two paragraphs. It has no SubstackFeed, no styled subscribe CTA, and no section structure. Easy to miss how much is actually missing.
**Why it happens:** It looks like a "nearly done" page but is actually almost entirely unbuilt for GRLV requirements.
**How to avoid:** Treat ground-level.astro as a rewrite, not a patch. Add: structured sections, SubstackFeed with limit={6}, .btn CTA, proper bg-dark sections.
**Warning signs:** Build output for /ground-level has no `.substack-feed` element

---

## Code Examples

Verified patterns from existing codebase source files:

### Minimal Page Shell (from work.astro pattern)
```astro
---
import BaseHead from '../components/BaseHead.astro';
import Footer from '../components/Footer.astro';
import Header from '../components/Header.astro';
import WorkCard from '../components/WorkCard.astro';
import SubstackFeed from '../components/SubstackFeed.astro';
import { SITE_TITLE, SUBSTACK_URL } from '../consts';
import { work } from '../data/work';

const featuredWork = work.filter(item => item.featured);
---

<!doctype html>
<html lang="en">
  <head>
    <BaseHead title={SITE_TITLE} description="..." />
  </head>
  <body>
    <Header />
    <!-- sections -->
    <Footer />
  </body>
</html>

<style>
  /* scoped styles */
</style>
```

### Three-Beat Homepage Section Structure
```astro
<!-- Beat 1: Intro — bg-dark bg-pattern for botanical texture -->
<section class="intro bg-dark bg-pattern">
  <div class="container">
    <h1>Meredith McGee</h1>
    <!-- hero photo -->
    <!-- intro copy paragraph -->
  </div>
</section>

<!-- Beat 2: What I'm Working On — bg-medium for visual contrast -->
<section class="working-on bg-medium">
  <div class="container">
    <h2>What I'm working on</h2>
    <SubstackFeed limit={3} />
  </div>
</section>

<!-- Beat 3: Selected Work — bg-dark (WorkCard requires dark bg) -->
<section class="selected-work bg-dark">
  <div class="container">
    <h2>Selected work</h2>
    {featuredWork.slice(0, 4).map(item => (
      <WorkCard
        title={item.title}
        description={item.description}
        category={item.category}
        link={item.link}
      />
    ))}
    <div class="see-more">
      <a href="/work">See all work &rarr;</a>
    </div>
  </div>
</section>
```

### Ground Level Page Structure
```astro
<!-- Hero/description — bg-dark bg-pattern -->
<section class="gl-intro bg-dark bg-pattern">
  <div class="container">
    <h1>Ground Level</h1>
    <p>Ground Level is my Substack about cannabis, public health, and the gap between policy and practice.</p>
    <a href={SUBSTACK_URL} target="_blank" rel="noopener noreferrer" class="btn">
      Subscribe on Substack
    </a>
  </div>
</section>

<!-- Post feed — bg-dark (SubstackFeed requires dark bg) -->
<section class="gl-posts bg-dark">
  <div class="container">
    <SubstackFeed limit={6} />
  </div>
</section>
```

### SubstackFeed Component Interface (from SubstackFeed.astro)
```typescript
interface Props {
  limit?: number;  // defaults to 3 if omitted
}
// Usage:
// <SubstackFeed />          → 3 posts
// <SubstackFeed limit={3} /> → 3 posts (explicit)
// <SubstackFeed limit={6} /> → 6 posts (Ground Level)
```

### WorkCard Component Interface (from WorkCard.astro)
```typescript
interface Props {
  title: string;
  description: string;
  category: string;
  link?: string;  // if present, adds linked title + "Read more →" arrow
}
```

### WorkItem featured filter (from work.ts + work.astro pattern)
```typescript
// In page frontmatter:
import { work } from '../data/work';
const featuredWork = work.filter(item => item.featured);
// Returns exactly 4 items (all 4 featured: true entries in current work.ts)
// Use .slice(0, 3) or .slice(0, 4) depending on final count decision
```

---

## Current State Inventory

### What Exists and Is Correct

| File | Status | Notes |
|------|--------|-------|
| `src/components/SubstackFeed.astro` | Complete and tested | limit prop works, fallback works, CDATA handling works |
| `src/components/WorkCard.astro` | Complete | Two link affordances, dark-bg tokens |
| `src/data/work.ts` | Complete (placeholder content) | 4 featured items, 4 non-featured |
| `src/consts.ts` | Complete | SUBSTACK_URL, SUBSTACK_FEED_URL both present |
| `src/components/Header.astro` | Complete | All 5 nav links including /ground-level |
| `src/components/Footer.astro` | Complete | LinkedIn, Substack, email |
| `public/meredith-headshot.jpg` | Exists | Confirmed in /public/ — use for hero photo |

### What Needs a Full Rewrite

| File | Current State | What Changes |
|------|--------------|-------------|
| `src/pages/index.astro` | Old 4-section layout (approach cards, featured cards, about preview, hero with MPH) | Full rewrite to three-beat layout per CONTEXT.md decisions |
| `src/pages/ground-level.astro` | Stub (title + 2 paragraphs, no SubstackFeed, no sections) | Full rewrite with sections, SubstackFeed limit={6}, .btn CTA |

### Available Photos in /public/
```
meredith-headshot.jpg   ← confirmed exists, use for homepage hero
family-photo.jpg        ← used in about.astro (K and Ember)
hero-image.jpg          ← current homepage hero (presenting research)
logo-m.png              ← used in Header nav logo
logo-m-new.png          ← available alternate
```
The CONTEXT.md confirmed `/meredith-headshot.jpg` is the photo for the homepage hero.

### Routing: Ground Level
The Header already has `/ground-level` in navLinks. The file `src/pages/ground-level.astro` already exists and routes to `/ground-level`. No routing changes needed.

### SUBSTACK_URL for CTA
`SUBSTACK_URL` in `src/consts.ts` is `https://meredithmcgee.substack.com`. This is the correct URL for the subscribe CTA. The feed URL (`SUBSTACK_FEED_URL`) is the old slug `meredithwritespublichealth.substack.com/feed` — only SubstackFeed uses this internally.

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| Client-side RSS fetch | Build-time fetch in Astro frontmatter | No CORS issues, works on GitHub Pages SSG |
| Hardcoded featured work in page HTML | `work.filter(i => i.featured)` from data file | Single source of truth, easy to update |
| Custom fetch-and-render per page | Import SubstackFeed component | Consistent, tested, fallback included |

---

## Open Questions

1. **Hero photo layout on homepage**
   - What we know: `meredith-headshot.jpg` is the hero photo; CONTEXT.md says sizing/placement is Claude's discretion
   - What's unclear: Whether the photo floats beside the intro text (two-column) or sits above/below (stacked)
   - Recommendation: Two-column grid with photo right, text left mirrors the hankgreen.com reference's clean personal feel. Collapse to stacked on mobile. The existing index.astro already has a hero grid pattern that can be adapted.

2. **Excerpt rendering: SubstackFeed renders raw description field**
   - What we know: SubstackFeed renders `{post.excerpt}` which escapes HTML; Substack descriptions may contain markup
   - What's unclear: Whether the current posts in the feed have clean or tag-filled descriptions
   - Recommendation: Acceptable as-is per project decision. If visible HTML tags appear after build, the planner can note this as a known cosmetic issue for Phase 5 cleanup rather than blocking Phase 4.

3. **Featured work count: 3 or 4**
   - What we know: work.ts has exactly 4 featured items; CONTEXT.md says 3 or 4 is Claude's discretion
   - What's unclear: Which count looks better visually with the grid
   - Recommendation: Show all 4 — they map to distinct categories (Research, Writing, Grants, Evaluation) and demonstrate range without feeling overwhelming.

---

## Sources

### Primary (HIGH confidence)
- `src/components/SubstackFeed.astro` — component interface and behavior read directly from source
- `src/components/WorkCard.astro` — component interface read directly from source
- `src/data/work.ts` — data structure and featured count confirmed from source
- `src/consts.ts` — SUBSTACK_URL and SUBSTACK_FEED_URL confirmed from source
- `src/pages/work.astro` — WorkCard usage pattern confirmed from source
- `src/pages/about.astro` — page structure pattern confirmed from source
- `src/pages/ground-level.astro` — current stub state confirmed from source
- `src/styles/global.css` — section backgrounds, tokens, container behavior confirmed from source
- `src/pages/index.astro` — current state confirmed from source (full rewrite required)
- `public/` directory listing — meredith-headshot.jpg confirmed present

### Secondary (MEDIUM confidence)
- `.planning/STATE.md` — SUBSTACK_FEED_URL decision and RSS 2.0 format confirmation from accumulated context
- `.planning/CONTEXT.md` — locked decisions and final copy confirmed authoritative per GSD process

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all components read directly from source, props confirmed
- Architecture: HIGH — page patterns confirmed from existing pages (about.astro, work.astro)
- Pitfalls: HIGH — dark-background constraint verified in component source, CORS pitfall documented in STATE.md
- Current state inventory: HIGH — all files read directly

**Research date:** 2026-03-01
**Valid until:** 2026-04-01 (stable stack, no external library changes in scope)
