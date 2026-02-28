---
phase: 01-foundation-cleanup
plan: A
title: Remove old structure and wire redirects
wave: 1
depends_on: []
requirements:
  - STRC-02
  - STRC-03
  - STRC-04
files_modified:
  - src/pages/index.astro
  - src/content.config.ts
  - src/pages/rss.xml.js
  - astro.config.mjs
files_deleted:
  - src/components/ThreeAudiences.astro
  - src/components/HeaderLink.astro
  - src/layouts/BlogPost.astro
  - src/pages/blog/index.astro
  - src/pages/blog/[...slug].astro
  - src/pages/portfolio/[slug].astro
  - src/pages/portfolio.astro
  - src/pages/resume.astro
  - src/pages/rss.xml.js
  - src/content/blog/first-post.md
  - src/content/blog/markdown-style-guide.md
  - src/content/blog/second-post.md
  - src/content/blog/third-post.md
  - src/content/blog/using-mdx.mdx
  - src/content/portfolio/aids-quilt.md
  - src/content/portfolio/bradbury-sullivan-grants.md
  - src/content/portfolio/cannabis-research.md
  - src/content/portfolio/hemp-thc-policy.md
  - src/content/portfolio/lavender-lane.md
  - src/content/portfolio/lgbtq-cbt-trial.md
  - src/content/portfolio/parabola-content.md
  - src/content/portfolio/program-evaluation.md
  - src/content/portfolio/yale-lgbtmhi-podcast.md
  - src/assets/blog-placeholder-1.jpg
  - src/assets/blog-placeholder-2.jpg
  - src/assets/blog-placeholder-3.jpg
  - src/assets/blog-placeholder-4.jpg
  - src/assets/blog-placeholder-5.jpg
  - src/assets/blog-placeholder-about.jpg
files_created: []
autonomous: true
---

# Plan A: Remove Old Structure and Wire Redirects

Remove the blog, portfolio, resume, and ThreeAudiences artifacts from the codebase. Wire Astro config redirects so old URLs send visitors to the correct new pages. After this plan, the codebase has no orphaned imports, no dead content collections, and `npm run build` succeeds.

## Tasks

<task id="A1">
<title>Remove ThreeAudiences from index.astro and delete the component</title>
<action>
In `src/pages/index.astro`:
1. Delete the import line (line 5): `import ThreeAudiences from '../components/ThreeAudiences.astro';`
2. Delete the usage line (line 137): `<ThreeAudiences />`
3. Delete the comment line immediately before it (line 136): `<!-- Three Audiences Interactive Demo -->`

Then delete the file `src/components/ThreeAudiences.astro`.

CRITICAL: Both edits to index.astro AND the file deletion must happen together. If the file is deleted but the import remains, `npm run build` will fail with a module-not-found error.
</action>
<verify>
- `src/components/ThreeAudiences.astro` does not exist
- `src/pages/index.astro` contains no reference to "ThreeAudiences"
- No file in the project contains the string "ThreeAudiences"
</verify>
</task>

<task id="A2">
<title>Delete unused HeaderLink component</title>
<action>
Delete `src/components/HeaderLink.astro`. This component is not imported by any file in the codebase (confirmed during research).
</action>
<verify>
- `src/components/HeaderLink.astro` does not exist
</verify>
</task>

<task id="A3">
<title>Delete blog pages, portfolio pages, and resume page</title>
<action>
Delete the following page files:
- `src/pages/blog/index.astro`
- `src/pages/blog/[...slug].astro`
- `src/pages/portfolio/[slug].astro`
- `src/pages/portfolio.astro`
- `src/pages/resume.astro`

After deleting the files, remove the now-empty directories:
- `src/pages/blog/`
- `src/pages/portfolio/`
</action>
<verify>
- None of the listed files exist
- `src/pages/blog/` directory does not exist
- `src/pages/portfolio/` directory does not exist
- `src/pages/resume.astro` does not exist
</verify>
</task>

<task id="A4">
<title>Delete blog and portfolio content collections and their schemas</title>
<action>
Delete all content markdown files:
- `src/content/blog/first-post.md`
- `src/content/blog/markdown-style-guide.md`
- `src/content/blog/second-post.md`
- `src/content/blog/third-post.md`
- `src/content/blog/using-mdx.mdx`
- `src/content/portfolio/aids-quilt.md`
- `src/content/portfolio/bradbury-sullivan-grants.md`
- `src/content/portfolio/cannabis-research.md`
- `src/content/portfolio/hemp-thc-policy.md`
- `src/content/portfolio/lavender-lane.md`
- `src/content/portfolio/lgbtq-cbt-trial.md`
- `src/content/portfolio/parabola-content.md`
- `src/content/portfolio/program-evaluation.md`
- `src/content/portfolio/yale-lgbtmhi-podcast.md`

Remove the now-empty directories:
- `src/content/blog/`
- `src/content/portfolio/`

Replace `src/content.config.ts` with an empty collections export:

```typescript
import { defineCollection } from 'astro:content';

export const collections = {};
```

This removes the `z` import, the `blog` definition, the `portfolio` definition, and the old export. The file must still exist with an empty `collections` export so Astro does not warn about a missing config.
</action>
<verify>
- `src/content/blog/` directory does not exist
- `src/content/portfolio/` directory does not exist
- `src/content.config.ts` exports `collections = {}`
- No file in the project calls `getCollection('blog')` or `getCollection('portfolio')`
</verify>
</task>

<task id="A5">
<title>Delete BlogPost layout and blog placeholder assets</title>
<action>
Delete `src/layouts/BlogPost.astro`.

Delete all blog placeholder images:
- `src/assets/blog-placeholder-1.jpg`
- `src/assets/blog-placeholder-2.jpg`
- `src/assets/blog-placeholder-3.jpg`
- `src/assets/blog-placeholder-4.jpg`
- `src/assets/blog-placeholder-5.jpg`
- `src/assets/blog-placeholder-about.jpg`

Remove the now-empty directories if they are empty after deletion:
- `src/layouts/` (if empty)
- `src/assets/` (if empty)
</action>
<verify>
- `src/layouts/BlogPost.astro` does not exist
- No `blog-placeholder-*.jpg` files exist in `src/assets/`
</verify>
</task>

<task id="A6">
<title>Delete rss.xml.js</title>
<action>
Delete `src/pages/rss.xml.js`. This file calls `getCollection('blog')` which will fail after the blog collection is removed. There is no internal blog anymore; Substack has its own RSS feed.

NOTE: The `@astrojs/rss` package can remain in package.json. Removing it is optional housekeeping for a later phase.
</action>
<verify>
- `src/pages/rss.xml.js` does not exist
- No file in the project imports from `@astrojs/rss`
</verify>
</task>

<task id="A7">
<title>Add redirect configuration to astro.config.mjs</title>
<action>
Edit `astro.config.mjs` to add the `redirects` key. The final file should be:

```javascript
// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://meredithmcgee.org',
	integrations: [mdx(), sitemap()],
	redirects: {
		'/portfolio': '/work',
		'/portfolio/[...slug]': '/work',
		'/resume': '/about',
		'/blog': '/ground-level',
		'/blog/[...slug]': '/ground-level',
	},
});
```

Redirect destinations per CONTEXT decisions:
- `/portfolio` and `/portfolio/*` redirect to `/work`
- `/resume` redirects to `/about`
- `/blog` and `/blog/*` redirect to `/ground-level`

Astro SSG will generate static HTML pages with `<meta http-equiv="refresh">` at each source path. This is the correct mechanism for GitHub Pages (no server-side redirects available).
</action>
<verify>
- `astro.config.mjs` contains a `redirects` object with all 5 redirect entries
- Run `npm run build` and confirm it succeeds
- Check that `dist/portfolio/index.html` exists and contains a meta refresh to `/work`
- Check that `dist/blog/index.html` exists and contains a meta refresh to `/ground-level`
- Check that `dist/resume/index.html` exists and contains a meta refresh to `/about`
</verify>
</task>

## Verification

After all tasks are complete:

1. **Build succeeds:** `npm run build` completes with exit code 0 and no errors
2. **No orphaned imports:** grep the entire `src/` directory for "ThreeAudiences", "getCollection('blog')", "getCollection('portfolio')", "BlogPost" — zero matches
3. **Redirects exist in build output:** `dist/portfolio/index.html`, `dist/blog/index.html`, and `dist/resume/index.html` all contain `<meta http-equiv="refresh">`
4. **Old content gone:** no files exist under `src/content/blog/`, `src/content/portfolio/`, `src/pages/blog/`, `src/pages/portfolio/`
5. **No dead components:** `src/components/ThreeAudiences.astro` and `src/components/HeaderLink.astro` do not exist

## must_haves

- ThreeAudiences component is fully removed from the codebase (no file, no imports, no rendered output)
- Blog and portfolio content collections, schemas, page routes, and layout are all deleted
- `npm run build` succeeds with zero errors after all deletions
- Visiting /portfolio, /blog, /resume redirects visitors to /work, /ground-level, /about respectively (via Astro SSG meta-refresh redirect pages)
- rss.xml.js is deleted (it depends on the removed blog collection)
