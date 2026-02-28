# Phase 1: Foundation Cleanup — Research

**Phase:** 01-foundation-cleanup
**Researched:** 2026-02-28
**Purpose:** What a planner needs to know to make confident, correct decisions for this phase

---

## What This Phase Actually Is

Phase 1 is a demolition-and-scaffold phase. No new page content is created (except a thin Ground Level placeholder). The work is:

1. Remove old structure: blog routes, portfolio routes, resume page, ThreeAudiences component, blog/portfolio content collections, and their schemas
2. Update nav: replace the current 6-item nav with the 5-item nav (Home, About, Work, Ground Level, Contact)
3. Add footer social links: LinkedIn and Substack icons below the email address
4. Wire redirects: ensure /portfolio, /blog, /resume, and /blog/* go somewhere useful rather than 404ing
5. Create a Ground Level placeholder page at /ground-level

The output is a codebase that builds cleanly, passes `npm run build`, and leaves no orphaned routes or import errors.

---

## Complete Inventory of What Needs to Change

### Files to Delete Entirely

| File/Directory | Reason |
|---|---|
| `src/components/ThreeAudiences.astro` | Spec removes this; 1,004 lines |
| `src/components/HeaderLink.astro` | Not used anywhere in the current codebase |
| `src/layouts/BlogPost.astro` | Blog layout; no blog after this phase |
| `src/pages/blog/` (entire directory) | Two files: `index.astro`, `[...slug].astro` |
| `src/pages/portfolio/` (entire directory) | One file: `[slug].astro` |
| `src/pages/portfolio.astro` | Portfolio listing page |
| `src/pages/resume.astro` | Resume page |
| `src/content/blog/` (entire directory) | 5 blog post files (first-post.md, second-post.md, third-post.md, using-mdx.mdx, markdown-style-guide.md) |
| `src/content/portfolio/` (entire directory) | 9 portfolio markdown files |

**Critical deletion order note:** ThreeAudiences must be removed from `src/pages/index.astro` (both the import on line 5 and the usage on line 137) at the same time the component file is deleted. If the component file is deleted but the import remains, `npm run build` will fail immediately with a module-not-found error.

### Files to Modify

| File | What Changes |
|---|---|
| `src/components/Header.astro` | Replace `navLinks` array with 5-item version |
| `src/components/Footer.astro` | Add LinkedIn + Substack icon links below email |
| `src/pages/index.astro` | Remove ThreeAudiences import and usage |
| `src/content.config.ts` | Remove both collection schemas; export empty object |
| `src/pages/rss.xml.js` | Remove or update (reads from `blog` collection which will not exist) |
| `astro.config.mjs` | May need redirect configuration (see Redirect section) |

### Files to Create

| File | What It Is |
|---|---|
| `src/pages/ground-level.astro` | Placeholder page: brief Ground Level description + Substack link |
| Redirect stubs (see below) | Static pages or config entries for /portfolio, /blog, /resume, /blog/* |

---

## The Redirect Problem: GitHub Pages Has No Server-Side Redirects

**This is the most important technical constraint for this phase.**

GitHub Pages serves static files only. There is no `.htaccess`, no Netlify `_redirects`, no server configuration. This rules out HTTP 301 redirects via server headers.

### Option A: Astro Config Redirects (Recommended)

Astro 5.x supports redirects defined in `astro.config.mjs` under the `redirects` key:

```javascript
// astro.config.mjs
export default defineConfig({
  site: 'https://meredithmcgee.org',
  integrations: [mdx(), sitemap()],
  redirects: {
    '/portfolio': '/work',
    '/resume': '/about',
    '/blog': '/ground-level',
    '/blog/[...slug]': '/ground-level',
  },
});
```

In SSG mode (which this project uses), Astro generates static HTML pages at each redirect source with a `<meta http-equiv="refresh">` tag pointing to the destination. This is equivalent to Option B but requires zero extra files — just config.

**Confidence:** HIGH. Astro 5.x redirect support for SSG is documented behavior. The `redirects` config key is available in Astro 2.9+ and has been stable since.

**Caveat to verify:** Astro SSG redirects generate HTML pages with client-side meta refresh. This is a 0-second refresh, so for practical purposes it works like a redirect. Search engines do understand meta refresh redirects but may not pass full link equity the way a server 301 does. For an old personal site losing routes, this is an acceptable trade-off.

### Option B: Static HTML Redirect Pages (Fallback)

Create thin `.astro` pages at each old route that render a meta refresh:

```astro
---
// src/pages/portfolio.astro (becomes redirect page)
---
<!doctype html>
<html lang="en">
  <head>
    <meta http-equiv="refresh" content="0; url=/work" />
    <title>Redirecting...</title>
  </head>
  <body>
    <p>This page has moved. <a href="/work">Go to Work</a></p>
  </body>
</html>
```

This gives more control but means `src/pages/portfolio.astro` needs to be converted rather than deleted — and you'd need a separate redirect page for `/blog` routes.

**Recommendation:** Use Option A (Astro config redirects) for clean separation. Keeps redirect logic in one place, no extra files needed.

### Routes That Need Redirects

| Old Route | Destination | Context |
|---|---|---|
| `/portfolio` | `/work` | Portfolio listing replaced by Work page |
| `/portfolio/*` | `/work` | Portfolio detail pages (e.g., /portfolio/cannabis-research) |
| `/resume` | `/about` | Resume removed from nav; About is closest replacement |
| `/blog` | `/ground-level` | Blog replaced by Ground Level + Substack |
| `/blog/*` | `/ground-level` | Individual blog post URLs |

**The `/rss.xml` question:** After deleting the blog collection, `rss.xml.js` will fail because it calls `getCollection('blog')` which no longer exists. Options: (1) delete `rss.xml.js` entirely — /rss.xml 404s, and the sitemap integration won't include it; (2) replace it with an empty RSS shell; (3) leave it but this will break the build. **Delete it** — no blog means no internal RSS feed is correct. Substack has its own feed.

---

## Navigation: Exact Changes to Header.astro

Current `navLinks` array (6 items):
```javascript
const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/work', label: 'My Work' },       // label changes to 'Work'
  { href: '/portfolio', label: 'Portfolio' }, // DELETE
  { href: '/resume', label: 'Resume' },       // DELETE
  { href: '/contact', label: 'Contact' },
];
```

Target `navLinks` array (5 items, exact order per STRC-01):
```javascript
const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/work', label: 'Work' },
  { href: '/ground-level', label: 'Ground Level' },
  { href: '/contact', label: 'Contact' },
];
```

Changes: Remove Portfolio and Resume entries. Rename "My Work" to "Work". Add Ground Level between Work and Contact.

The mobile hamburger menu, active state logic, and all CSS in Header.astro require no changes — they work generically on whatever items are in `navLinks`. The mobile slide-out nav will automatically render the new items correctly.

---

## Footer: Adding Social Icons

Current footer structure (Footer.astro lines 13-19):
```html
<div class="footer-contact">
  <a href="/contact" class="btn">Get in Touch!</a>
  <p class="footer-email">
    <a href="mailto:meredith.ar.mcgee@gmail.com">meredith.ar.mcgee@gmail.com</a>
  </p>
  <p class="footer-location">Boston, Massachusetts</p>
</div>
```

Target: LinkedIn and Substack icon links added below the email address. Icons only (no text labels), per the CONTEXT decisions. Icons should use the site's color tokens (`--color-cream` at rest, `--color-gold` on hover) to match existing link styling.

**SVG inline approach is recommended** — no icon library dependency. Simple SVG paths for LinkedIn and Substack are short and maintainable. The site has no icon library installed.

URLs to confirm during implementation:
- LinkedIn: `https://linkedin.com/in/meredithmcgee` (noted in CONTEXT as "confirm during implementation")
- Substack: `https://groundlevel.substack.com` (noted in CONTEXT as "confirm during implementation") — the CONTEXT uses `groundlevel.substack.com` but the CONCERNS.md mentions `meredithmcgee.substack.com` — **this must be verified before implementation**

Icon placement: below `.footer-email`, above `.footer-location` (or below — confirm which layout feels cleaner). The two-column footer layout (info on left, contact on right) stays unchanged.

---

## Content Collections: Removing blog and portfolio Schemas

Current `src/content.config.ts` defines two collections (`blog` and `portfolio`) and exports both. After deleting all content from `src/content/blog/` and `src/content/portfolio/`, the config file must also be cleaned up.

If both content directories are deleted and the schemas are removed, `content.config.ts` becomes:

```typescript
import { defineCollection } from 'astro:content';

export const collections = {};
```

Or the file can be deleted entirely — Astro handles a missing `content.config.ts` gracefully. Deleting it is simpler.

**Build impact:** Any page that calls `getCollection('blog')` or `getCollection('portfolio')` will fail after the collections are removed. The files to check:
- `src/pages/blog/index.astro` — calls `getCollection('blog')` — DELETING this file
- `src/pages/blog/[...slug].astro` — calls `getCollection('blog')` — DELETING this file
- `src/pages/portfolio.astro` — calls `getCollection('portfolio')` — DELETING this file
- `src/pages/portfolio/[slug].astro` — calls `getCollection('portfolio')` — DELETING this file
- `src/pages/rss.xml.js` — calls `getCollection('blog')` — DELETE or replace

Since all the files that call `getCollection` are themselves being deleted, deleting the content directories and config is safe as long as the page files are removed first (or at the same time).

---

## The Ground Level Placeholder Page

A simple page at `/ground-level`. Per CONTEXT decisions:
- Warm teaser tone: brief intro explaining what Ground Level is
- Link to Substack (not a full subscribe CTA — that comes in Phase 4)
- No RSS feed yet (RSS component built in Phase 2)

Standard page template:
```astro
---
import BaseHead from '../components/BaseHead.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import { SITE_TITLE } from '../consts';
---

<!doctype html>
<html lang="en">
  <head>
    <BaseHead title={`Ground Level | ${SITE_TITLE}`} description="..." />
  </head>
  <body>
    <Header />
    <!-- placeholder content -->
    <Footer />
  </body>
</html>
```

Copy guidance: voice rules apply. No em dashes. Contractions. Lead with concrete. Short and honest — this is a placeholder, and the copy should not pretend otherwise while still feeling warm. Something like: "Ground Level is my newsletter on public health, research, and the gaps between. Read it on Substack."

---

## ThreeAudiences Removal: Two-Step Process

**Step 1:** Remove from `src/pages/index.astro`
- Line 5: `import ThreeAudiences from '../components/ThreeAudiences.astro';` — delete
- Line 137: `<ThreeAudiences />` — delete

**Step 2:** Delete `src/components/ThreeAudiences.astro`

Both steps must happen in the same change. If the file is deleted but the import is left, the build fails. If the import is removed but the file stays, it's dead code (not harmful, just messy).

No other files import ThreeAudiences. Confirmed via grep: only `src/pages/index.astro` imports it.

---

## Build Verification Checklist for This Phase

After all changes, `npm run build` should succeed and the `dist/` output should:

- [ ] Contain `/index.html` — homepage still exists
- [ ] Contain `/about/index.html` — About still exists
- [ ] Contain `/work/index.html` — Work still exists
- [ ] Contain `/contact/index.html` — Contact still exists
- [ ] Contain `/ground-level/index.html` — new placeholder exists
- [ ] Contain `/portfolio/index.html` (redirect page) — meta refresh to /work
- [ ] Contain `/resume/index.html` (redirect page) — meta refresh to /about
- [ ] Contain `/blog/index.html` (redirect page) — meta refresh to /ground-level
- [ ] NOT contain a `/portfolio/cannabis-research/` page (old content collection pages gone)
- [ ] NOT contain a `/blog/first-post/` page (old blog posts gone)
- [ ] NOT reference ThreeAudiences in any HTML file

Browser spot-checks after deploy:
- [ ] Nav shows exactly: Home, About, Work, Ground Level, Contact
- [ ] Footer has LinkedIn and Substack icon links (not placeholder `#` hrefs)
- [ ] /portfolio redirects to /work
- [ ] /resume redirects to /about
- [ ] /blog redirects to /ground-level
- [ ] /ground-level loads and links to Substack

---

## Risks and Mitigations

### Risk 1: ThreeAudiences import causes build failure
**Probability:** HIGH if not handled carefully (easy to forget after deleting the file)
**Mitigation:** Remove the import from `index.astro` in the same operation as deleting the component file. Check line 5 (import) and line 137 (usage) in `index.astro`.

### Risk 2: rss.xml.js fails after blog collection removal
**Probability:** CERTAIN — the file calls `getCollection('blog')` which will throw once the collection is gone
**Mitigation:** Delete `rss.xml.js` in the same sweep as the blog collection deletion.

### Risk 3: content.config.ts still exports old schemas after content directories deleted
**Probability:** LOW (Astro may handle gracefully but it's risky)
**Mitigation:** Delete `content.config.ts` entirely, or replace with `export const collections = {};`. Either works.

### Risk 4: Astro config redirects don't generate /blog/* catch-all correctly
**Probability:** LOW-MEDIUM — the `[...slug]` pattern in Astro redirects config may have edge cases
**Mitigation:** Test `/blog/first-post` manually after build to confirm it redirects. If Astro config redirect for `[...slug]` doesn't work as expected, fall back to a static redirect page at `src/pages/blog/index.astro` with meta refresh.

### Risk 5: Substack URL is wrong in footer/Ground Level placeholder
**Probability:** MEDIUM — CONTEXT says "confirm during implementation"
**Mitigation:** Verify the correct Substack URL before writing footer and placeholder links. The CONTEXT says `groundlevel.substack.com`; confirm this against the live site.

### Risk 6: `@astrojs/mdx` integration fails without any MDX content
**Probability:** LOW — the MDX integration should be safe to keep even with no `.mdx` files
**Mitigation:** Keep `@astrojs/mdx` in `astro.config.mjs` for now. It's a no-op if there are no MDX files. Remove it in a later cleanup pass if desired.

### Risk 7: Sitemap still lists old routes
**Probability:** LOW-MEDIUM — Astro's sitemap integration reads from the build output
**Mitigation:** After `npm run build`, check `dist/sitemap-0.xml` (or equivalent). Old routes (/portfolio, /blog, /resume) should not appear as indexed pages. Redirect pages may or may not appear — verify and document.

---

## Constraints That Affect Plan Decisions

1. **GitHub Pages = no server redirects.** Client-side meta refresh via Astro config is the correct mechanism. Do not use `_redirects` file (that's Netlify syntax).

2. **No Tailwind.** Per STATE.md: "No Tailwind CSS — mid-project migration creates churn; existing CSS architecture is good." Icon styling in the footer should use inline SVG + scoped CSS using existing `--color-gold`, `--color-cream` tokens.

3. **SSG only.** All pages are statically generated. Nothing server-renders at request time. Redirect pages are static HTML with meta refresh.

4. **No new dependencies in this phase.** Foundation cleanup should add nothing to `package.json`. The SVG icons are inline. No icon library needed.

5. **`@astrojs/rss` package can stay** even after `rss.xml.js` is deleted. It's a dev dependency; removing it is optional housekeeping for a later phase.

6. **Content in `src/assets/` (blog placeholder images) can be deleted.** These are only used by the blog layout. After the blog is gone, they're dead assets. Removing them reduces repo size.

---

## What This Phase Does NOT Do (Important Scope Boundary)

The following come in later phases. Do not do them here:

- Rewriting any page content (homepage, about, work, contact) — those are Phase 3 and 4
- Building `SubstackFeed.astro` or `WorkCard.astro` — Phase 2
- Elevating the design system (palette, typography, animations) — Phase 5
- Adding Easter eggs — Phase 6
- Updating `consts.ts` with `SUBSTACK_RSS_URL` — Phase 2 (when SubstackFeed is built)
- Building the Work Archive subpage — Phase 3
- Fetching the Substack RSS feed — Phase 2 component, Phase 4 for pages

The Ground Level placeholder is the only new page content in this phase, and it's intentionally minimal.

---

## File-by-File Summary for the Plan

| Action | File | Notes |
|---|---|---|
| DELETE | `src/components/ThreeAudiences.astro` | Concurrent with index.astro edits |
| DELETE | `src/components/HeaderLink.astro` | Unused component |
| DELETE | `src/layouts/BlogPost.astro` | No blog layout needed |
| DELETE | `src/pages/blog/index.astro` | Blog listing |
| DELETE | `src/pages/blog/[...slug].astro` | Blog post detail router |
| DELETE | `src/pages/portfolio/[slug].astro` | Portfolio detail router |
| DELETE | `src/pages/portfolio.astro` | Portfolio listing |
| DELETE | `src/pages/resume.astro` | Resume page |
| DELETE | `src/pages/rss.xml.js` | Blog RSS feed; blog is gone |
| DELETE | `src/content/blog/` (all files) | 5 markdown/mdx files |
| DELETE | `src/content/portfolio/` (all files) | 9 markdown files |
| DELETE or EMPTY | `src/content.config.ts` | Remove blog/portfolio schemas |
| DELETE | `src/assets/blog-placeholder-1.jpg` | Only used by blog layout |
| MODIFY | `src/components/Header.astro` | Update navLinks array (5 items) |
| MODIFY | `src/components/Footer.astro` | Add LinkedIn + Substack icon links |
| MODIFY | `src/pages/index.astro` | Remove ThreeAudiences import and usage |
| MODIFY | `astro.config.mjs` | Add redirects config for old routes |
| CREATE | `src/pages/ground-level.astro` | Placeholder page |

---

*Research for Phase 1 — Foundation Cleanup*
*Researched: 2026-02-28*
