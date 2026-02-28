# Architecture Research

**Domain:** Personality-driven personal site with Substack RSS integration and Easter eggs
**Researched:** 2026-02-28
**Confidence:** HIGH (based on direct codebase audit + Astro SSG patterns)

---

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                       Build-Time Layer                           │
│                   (GitHub Actions CI/CD)                         │
├────────────────────────────────┬────────────────────────────────┤
│         Pages (Routes)         │       Data Sources              │
│  ┌──────────┐  ┌──────────┐   │  ┌──────────┐  ┌───────────┐  │
│  │ index    │  │ about    │   │  │ Substack │  │  consts   │  │
│  │ .astro   │  │ .astro   │   │  │ RSS Feed │  │  .ts      │  │
│  └────┬─────┘  └────┬─────┘   │  └────┬─────┘  └─────┬─────┘  │
│  ┌────┴─────┐  ┌────┴─────┐   │       │               │        │
│  │ work     │  │ ground-  │←──┼───────┘               │        │
│  │ .astro   │  │ level    │   │                        │        │
│  └──────────┘  │ .astro   │   │                        │        │
│  ┌──────────┐  └──────────┘   │                        │        │
│  │ work/    │                  │                        │        │
│  │ archive  │                  │                        │        │
│  │ .astro   │                  │                        │        │
│  └──────────┘  ┌──────────┐   │                        │        │
│                │ contact  │   │                        │        │
│                │ .astro   │   │                        │        │
│                └──────────┘   │                        │        │
├────────────────────────────────┴────────────────────────────────┤
│                      Component Layer                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │ BaseHead │  │ Header   │  │ Footer   │  │ SubstackFeed │   │
│  │ .astro   │  │ .astro   │  │ .astro   │  │ .astro       │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  Easter Egg Components                    │   │
│  │  EmberClick.astro  |  [HiddenDelight].astro  |  ...      │   │
│  └──────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                      Styling Layer                               │
│  src/styles/global.css (CSS variables, typography, layout)      │
└─────────────────────────────────────────────────────────────────┘
                              ↓ build
┌─────────────────────────────────────────────────────────────────┐
│                   dist/ (Static HTML)                            │
│              Served via GitHub Pages                             │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Communicates With |
|-----------|----------------|-------------------|
| `BaseHead.astro` | SEO meta, OG tags, fonts, canonical URL | Called by every page |
| `Header.astro` | Fixed nav (5 links), mobile hamburger | All pages; vanilla JS for toggle state |
| `Footer.astro` | LinkedIn + Substack social links, copyright | All pages |
| `SubstackFeed.astro` | Fetch + render N posts from RSS at build time | Substack RSS URL (external fetch) |
| `EmberClick.astro` | Click-to-spawn ember particle Easter egg | Self-contained; window event listener |
| `EasterEgg[Name].astro` | 2-3 additional hidden delights | Self-contained per component |

---

## Recommended Project Structure

Target state after restructure:

```
src/
├── components/
│   ├── BaseHead.astro          # KEEP — SEO unchanged
│   ├── Header.astro            # MODIFY — update nav links (5 items, remove Portfolio/Resume)
│   ├── Footer.astro            # MODIFY — add LinkedIn + Substack social icons
│   ├── SubstackFeed.astro      # NEW — RSS fetch + post card rendering
│   ├── WorkCard.astro          # NEW — reusable card for work items
│   ├── EmberClick.astro        # NEW — Easter egg click interaction
│   └── FormattedDate.astro     # KEEP — utility unchanged
├── pages/
│   ├── index.astro             # REWRITE — 3 beats: Intro, Working On (RSS), Selected Work
│   ├── about.astro             # REWRITE — essay narrative, no cards
│   ├── work.astro              # REWRITE — curated highlights, placeholder structure
│   ├── work/
│   │   └── archive.astro       # NEW — comprehensive work listing
│   ├── ground-level.astro      # NEW — Substack bridge (RSS feed, subscribe CTA)
│   ├── contact.astro           # SIMPLIFY — email + social, remove form or simplify
│   └── rss.xml.js              # MODIFY — update if blog collection removed
├── styles/
│   └── global.css              # MODIFY — elevate palette, refine typography scale
├── content/
│   └── (blog/ and portfolio/ collections DELETED or emptied)
├── content.config.ts           # MODIFY — remove blog/portfolio schemas if collections gone
└── consts.ts                   # MODIFY — update SITE_DESCRIPTION, add SUBSTACK_RSS_URL
```

### What to Keep, Modify, or Delete

| File | Action | Notes |
|------|--------|-------|
| `src/components/BaseHead.astro` | KEEP | No changes needed |
| `src/components/Header.astro` | MODIFY | Update navLinks array: remove Portfolio, Resume; add Ground Level |
| `src/components/Footer.astro` | MODIFY | Add LinkedIn + Substack icons; update tagline copy |
| `src/components/ThreeAudiences.astro` | DELETE | Removed per spec; 1,004 lines gone |
| `src/components/HeaderLink.astro` | DELETE | Unused already |
| `src/components/FormattedDate.astro` | KEEP | Useful for RSS post dates |
| `src/layouts/BlogPost.astro` | DELETE | Blog layout no longer needed |
| `src/pages/blog/` (dir) | DELETE | Replaced by Substack |
| `src/pages/portfolio.astro` | DELETE | Replaced by Work page |
| `src/pages/portfolio/` (dir) | DELETE | No detail pages |
| `src/pages/resume.astro` | DELETE | Removed from nav per spec |
| `src/pages/rss.xml.js` | MODIFY or DELETE | Was for blog collection; update or remove |
| `src/content/blog/` (dir) | DELETE | No local blog content |
| `src/content/portfolio/` (dir) | DELETE | No portfolio collection |
| `src/content.config.ts` | MODIFY | Remove blog and portfolio schemas |

### Structure Rationale

- **Substack replaces blog:** No local content collection needed for writing. RSS fetched at build time from Substack's public feed.
- **Work page + archive subpage:** Work page shows curated highlights inline (static, no collection). Archive at `/work/archive` lists everything — easier to build than a content collection since entries are hardcoded for now.
- **Components stay small:** Each Easter egg gets its own component file. Keeps `index.astro` readable and makes Easter eggs easy to add/remove.
- **Content collections deleted:** Removing both collections eliminates `content.config.ts` schema complexity. If work items are eventually data-driven, add a `work` collection then.

---

## Architectural Patterns

### Pattern 1: Build-Time RSS Fetch

**What:** Fetch Substack RSS XML in `.astro` frontmatter at build time using the native `fetch()` API, parse XML, render posts as static HTML.

**When to use:** Any external data needed in the static build — Substack feed on homepage and Ground Level page.

**Trade-offs:** Posts are frozen at build time (no live updates). Rebuilding on push to main keeps it fresh enough for a personal site. No client-side JavaScript required, no rate limit risk at runtime.

**Example:**

```astro
---
// src/components/SubstackFeed.astro
interface Props {
  limit?: number;
}
const { limit = 3 } = Astro.props;

const SUBSTACK_RSS = 'https://meredithmcgee.substack.com/feed';

let posts: Array<{ title: string; link: string; pubDate: string; description: string }> = [];

try {
  const response = await fetch(SUBSTACK_RSS);
  const xml = await response.text();

  // Simple regex parse — no dependency needed for straightforward RSS 2.0
  const items = xml.match(/<item>([\s\S]*?)<\/item>/g) ?? [];
  posts = items.slice(0, limit).map((item) => ({
    title: (item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) ?? [])[1] ?? '',
    link: (item.match(/<link>(.*?)<\/link>/) ?? [])[1] ?? '',
    pubDate: (item.match(/<pubDate>(.*?)<\/pubDate>/) ?? [])[1] ?? '',
    description: (item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) ?? [])[1]?.slice(0, 200) ?? '',
  }));
} catch (e) {
  // Build continues with empty array — graceful degradation
  console.warn('Substack RSS fetch failed:', e);
}
---

{posts.map((post) => (
  <article class="substack-post">
    <h3><a href={post.link} target="_blank" rel="noopener">{post.title}</a></h3>
    <p class="post-date"><FormattedDate date={new Date(post.pubDate)} /></p>
    <p class="post-excerpt" set:html={post.description} />
  </article>
))}
```

**Note on XML parsing:** A small regex approach handles Substack's standard RSS 2.0 CDATA format cleanly and adds no dependencies. If Substack changes its feed format, switch to a parser like `fast-xml-parser` (zero-dependency, 15kb). HIGH confidence this pattern works in Astro 5.x SSG — fetch() is available in all Astro frontmatter.

---

### Pattern 2: Self-Contained Easter Egg Components

**What:** Each Easter egg is an isolated Astro component with its own `<script>` and `<style>` blocks. Pages import and drop in the component. No shared state.

**When to use:** Any interactive delight — ember click effect, hidden text reveal, hover surprise.

**Trade-offs:** Slight HTML overhead per component (each adds a small script tag). Acceptable for 2-3 Easter eggs. Easy to add/remove without touching page code.

**Example (Ember Click):**

```astro
---
// src/components/EmberClick.astro
// No props — self-contained
---

<div id="ember-layer" aria-hidden="true"></div>

<style>
  #ember-layer {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9999;
  }

  .ember {
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--color-gold);
    animation: ember-float 0.8s ease-out forwards;
    pointer-events: none;
  }

  @keyframes ember-float {
    0%   { opacity: 1; transform: translate(0, 0) scale(1); }
    100% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(0.3); }
  }
</style>

<script>
  const layer = document.getElementById('ember-layer');

  document.addEventListener('click', (e) => {
    if (!layer) return;
    for (let i = 0; i < 6; i++) {
      const ember = document.createElement('div');
      ember.className = 'ember';
      const angle = (Math.PI * 2 * i) / 6;
      const dist = 30 + Math.random() * 40;
      ember.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
      ember.style.setProperty('--dy', `${Math.sin(angle) * dist - 20}px`);
      ember.style.left = `${e.clientX - 3}px`;
      ember.style.top = `${e.clientY - 3}px`;
      layer.appendChild(ember);
      ember.addEventListener('animationend', () => ember.remove());
    }
  });
</script>
```

**Placement:** Import `EmberClick` into `src/pages/index.astro` just before `</body>`. It applies globally since it listens on `document`.

---

### Pattern 3: Static Work Data (No Collection)

**What:** Work items are hardcoded as arrays in page frontmatter or as `.ts` data files in `src/data/`, not as a content collection.

**When to use:** When content is sparse, manually curated, and doesn't need markdown bodies — only metadata (title, org, year, link, short description).

**Trade-offs:** No schema validation. Easier to edit inline than creating individual `.md` files. Migrate to a content collection later if work items grow beyond ~20 entries.

**Example:**

```typescript
// src/data/work.ts
export interface WorkItem {
  title: string;
  org: string;
  year: string;
  category: 'grant' | 'research' | 'evaluation' | 'communications';
  description: string;
  link?: string;
}

export const featuredWork: WorkItem[] = [
  {
    title: 'Cannabis Consumer Study',
    org: 'Parabola Center',
    year: '2025',
    category: 'research',
    description: 'Qualitative study connecting consumer experience to policy outcomes in recreational markets.',
  },
  // ...
];

export const allWork: WorkItem[] = [
  ...featuredWork,
  // archive entries
];
```

```astro
---
// src/pages/work.astro
import { featuredWork } from '../data/work.ts';
---
```

---

## Data Flow

### RSS Integration Flow

```
GitHub Actions: npm run build
        ↓
src/pages/index.astro (frontmatter)
        ↓
imports SubstackFeed.astro with limit=3
        ↓
SubstackFeed.astro frontmatter: fetch('https://[substack].substack.com/feed')
        ↓
Substack public RSS feed (external HTTP)
        ↓ (returns XML)
Regex parse → array of {title, link, pubDate, description}
        ↓
Renders as static HTML article cards
        ↓
dist/index.html (frozen at build time)
```

```
src/pages/ground-level.astro
        ↓
imports SubstackFeed.astro with limit=6
        + subscribe CTA section
        ↓
Same fetch flow → 6 posts rendered
        ↓
dist/ground-level/index.html
```

### Key Data Flow Principles

1. **All data flows are build-time, not runtime.** Substack feed is fetched during `npm run build`. No client JavaScript fetches data.
2. **Component receives limit via props.** `SubstackFeed` is the single source of truth for RSS rendering. Homepage passes `limit=3`, Ground Level passes `limit=6`.
3. **Work data flows from `src/data/work.ts`.** Both `work.astro` and `work/archive.astro` import from the same data file. Featured items use `featuredWork`, archive uses `allWork`.
4. **Easter egg scripts are purely additive.** They listen on `document` or `window` events. They write to the DOM but read nothing from other components.
5. **Header and Footer are stateless.** Header reads `Astro.url.pathname` for active link highlighting. Footer reads the current year. No props needed.

### State Management

```
Mobile nav state:  Header.astro <script> → aria-expanded attr on button → CSS .open class
Easter egg state:  EmberClick <script> → creates/removes DOM nodes → no persisted state
RSS error state:   try/catch in SubstackFeed frontmatter → empty array → no cards rendered
```

No shared client state. No Nanostores, no React, no Svelte. Vanilla JS only, scoped to each component's `<script>` block.

---

## Build Order Implications for Roadmap

The dependencies between components dictate implementation order:

```
Phase 1: Foundation Cleanup
  Delete: ThreeAudiences, HeaderLink, BlogPost layout, blog/ pages, portfolio pages
  Modify: Header (nav links), Footer (social icons), content.config.ts, rss.xml.js
  Rationale: Clear the decks before building new. Avoids merge conflicts with new pages.

Phase 2: Shared Components
  New: SubstackFeed.astro, WorkCard.astro
  New: consts.ts SUBSTACK_RSS_URL constant
  Rationale: Pages depend on these. Build components first, then assemble pages.

Phase 3: Core Pages (no RSS dependency)
  New: about.astro (essay, no data deps)
  Rewrite: contact.astro (static, no data deps)
  New: work/archive.astro (depends on src/data/work.ts)
  Rationale: These pages have no external data fetch. Safe to build and test locally.

Phase 4: RSS-Dependent Pages
  New: ground-level.astro (SubstackFeed with limit=6 + subscribe CTA)
  Rewrite: index.astro (3 beats, SubstackFeed with limit=3, WorkCard references)
  Rewrite: work.astro (curated highlights, WorkCard)
  Rationale: Depends on SubstackFeed being done. Requires valid Substack URL in consts.ts.

Phase 5: Design System
  Modify: global.css (palette elevation, typography refinement, whitespace, animations)
  Rationale: Easier to refine styles once page structure is settled.

Phase 6: Easter Eggs
  New: EmberClick.astro + 2 additional delight components
  Rationale: Last because they're purely additive — no page depends on them.
```

---

## Anti-Patterns

### Anti-Pattern 1: Fetching RSS in Page Frontmatter Directly

**What people do:** Write the `fetch()` call inside `index.astro` frontmatter rather than encapsulating it in `SubstackFeed.astro`.

**Why it's wrong:** The Ground Level page and homepage both need the same RSS data. Duplicating the fetch logic means two places to update when the Substack URL changes. Also bloats page files.

**Do this instead:** One `SubstackFeed.astro` component handles all RSS fetching. Pages import it with a `limit` prop.

---

### Anti-Pattern 2: Converting to SSR for RSS Freshness

**What people do:** Switch Astro to SSR mode (Cloudflare/Node adapter) so the RSS feed loads on every request rather than at build time.

**Why it's wrong:** The site is hosted on GitHub Pages, which serves only static files. SSR requires a server runtime. For a personal site, build-time fetch is sufficient — GitHub Actions can be triggered on a schedule if needed. The added complexity of an SSR adapter is not worth it.

**Do this instead:** Keep SSG. Accept that posts are snapshot-at-build-time. GitHub Actions can be set to run on a schedule (e.g., daily rebuild) if fresh feed content is important later.

---

### Anti-Pattern 3: Client-Side RSS Fetch with JavaScript

**What people do:** Fetch the Substack RSS feed from a `<script>` block in the browser, rendering posts client-side.

**Why it's wrong:** Substack's RSS feed does not send CORS headers that allow cross-origin browser requests. The browser will block the fetch. This approach is a known failure mode for RSS-in-browser patterns.

**Do this instead:** Always fetch RSS in Astro frontmatter (server/build context), never in a browser `<script>` block. The CORS restriction does not apply to build-time server fetches.

---

### Anti-Pattern 4: Using a Content Collection for Work Items

**What people do:** Create a `work` content collection with markdown files for each work item, mirroring the old `portfolio` collection.

**Why it's wrong:** Work items are short metadata entries (title, org, year, description, link). They don't need markdown bodies. A content collection adds schema complexity, requires creating individual `.md` files, and requires `getStaticPaths()` for detail pages that don't exist in the new design.

**Do this instead:** Store work items as a typed array in `src/data/work.ts`. Migrate to a content collection only if items grow beyond ~20 or need markdown bodies.

---

### Anti-Pattern 5: Keeping ThreeAudiences as Hidden/Repurposed

**What people do:** Refactor the 1,004-line ThreeAudiences component rather than deleting it, since "it was a lot of work."

**Why it's wrong:** The component is removing entirely per spec. It represents a "consulting portfolio" pattern that actively conflicts with the personality-driven target. Keeping it, even hidden, adds build weight and tempts re-introduction.

**Do this instead:** Delete `ThreeAudiences.astro` completely in Phase 1. If interactive demos are wanted later, build purpose-specific components from scratch.

---

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Substack RSS | Build-time `fetch()` in `SubstackFeed.astro` | No auth needed; public feed. URL stored in `consts.ts` as `SUBSTACK_RSS_URL`. |
| Formspree | HTML form POST (existing) | Keep or simplify — contact page scope is to simplify, not replatform the form handler. |
| Google Fonts | CSS `@import` in `global.css` | Keep — Playfair Display + Source Sans 3 stay. |
| GitHub Pages | Static artifact via GitHub Actions | No changes to CI/CD pipeline needed. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `SubstackFeed.astro` ↔ pages | Props: `limit` number | Feed component is read-only from pages' perspective |
| `src/data/work.ts` ↔ work pages | Direct TS import | `featuredWork` for work.astro; `allWork` for archive |
| Easter egg components ↔ pages | Zero coupling — DOM events only | Easter eggs self-initialize via `<script>`; pages just import them |
| `Header.astro` ↔ pages | `Astro.url.pathname` for active state | No props needed; header reads its own URL |
| `consts.ts` ↔ all pages | Named exports (`SITE_TITLE`, `SUBSTACK_RSS_URL`) | Single source of truth for site-wide constants |

---

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| Personal site (current) | SSG + build-time RSS fetch is perfect. No changes. |
| Feed staleness concern | Add scheduled GitHub Actions rebuild (daily cron). No architecture change. |
| Work items grow beyond 20 | Migrate `src/data/work.ts` array to Astro content collection with `work` schema. |
| Multiple Easter eggs (5+) | Create `src/components/easter-eggs/` subdirectory. No functional change. |

The site does not need to scale beyond what SSG handles. The only meaningful scaling concern is RSS freshness, which is solved by a scheduled rebuild — not by switching to SSR.

---

## Sources

- Direct codebase audit: `src/components/`, `src/pages/`, `src/content.config.ts`, `astro.config.mjs` (2026-02-28)
- Existing architecture documentation: `.planning/codebase/ARCHITECTURE.md` (HIGH confidence — written from direct code analysis)
- Existing concerns documentation: `.planning/codebase/CONCERNS.md` — confirmed CORS issue with client-side RSS, confirmed SubstackFeed as missing feature
- Project spec: `.planning/PROJECT.md` — confirmed page structure, component removal list
- Astro SSG fetch patterns: Astro docs / training knowledge (fetch() in frontmatter is standard Astro 5.x SSG — HIGH confidence based on Astro core behavior since v1)
- CORS restriction on Substack RSS: Known browser security constraint, applies to all RSS feeds — HIGH confidence

---

*Architecture research for: meredithmcgee.org personality-driven site rebuild*
*Researched: 2026-02-28*
