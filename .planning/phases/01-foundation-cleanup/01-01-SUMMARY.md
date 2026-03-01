---
phase: 01-foundation-cleanup
plan: 01
subsystem: ui
tags: [astro, redirects, content-collections, cleanup]

# Dependency graph
requires: []
provides:
  - Blog, portfolio, resume pages and content collections deleted
  - ThreeAudiences component removed
  - Meta-refresh redirects from /portfolio, /blog, /resume to new URLs
  - Empty content.config.ts (no collections)
  - BaseHead.astro updated to not reference deleted assets
affects: [02-shared-components, 03-static-pages, 04-rss-pages]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Astro redirects config for static meta-refresh redirect pages"
    - "BaseHead accepts image as string path, not imported ImageMetadata"

key-files:
  created: []
  modified:
    - src/pages/index.astro
    - src/content.config.ts
    - astro.config.mjs
    - src/components/BaseHead.astro

key-decisions:
  - "Removed wildcard /portfolio/[...slug] and /blog/[...slug] redirect patterns — Astro SSG requires getStaticPaths() for dynamic redirect routes, which cannot be satisfied with empty collections; root-level redirects are sufficient"
  - "BaseHead OG image changed from imported ImageMetadata to string path; fallback is /meredith-headshot.jpg from public/"

patterns-established:
  - "OG images reference public/ directory assets as string paths, not imported src/assets files"

requirements-completed: [STRC-02, STRC-03, STRC-04]

# Metrics
duration: 2min
completed: 2026-03-01
---

# Phase 01 Plan 01: Remove Old Structure and Wire Redirects Summary

**Deleted blog/portfolio/resume/ThreeAudiences artifacts and wired meta-refresh redirects for /portfolio, /blog, and /resume in Astro SSG config**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-28T19:04:50Z
- **Completed:** 2026-03-01T00:07:24Z
- **Tasks:** 3
- **Files modified:** 4 (plus 31 files deleted)

## Accomplishments

- Removed ThreeAudiences component from index.astro and deleted the file
- Deleted all blog/portfolio/resume pages, layouts, content collections, and blog placeholder assets (31 files total)
- Replaced content.config.ts with an empty collections export
- Added Astro redirects config: /portfolio -> /work, /resume -> /about, /blog -> /ground-level
- Fixed BaseHead.astro to not import the deleted blog-placeholder asset
- Build passes cleanly; dist/portfolio, dist/blog, dist/resume all contain meta http-equiv="refresh" pages

## Task Commits

Each task was committed atomically:

1. **Task A1: Remove ThreeAudiences** - `a3ae0da` (feat)
2. **Task A2: Delete old structure and clean content config** - `bcd4002` (feat)
3. **Task A3: Add redirects + fix BaseHead** - `60da1e8` (feat)

## Files Created/Modified

- `src/pages/index.astro` - Removed ThreeAudiences import and usage
- `src/content.config.ts` - Replaced with empty collections export
- `astro.config.mjs` - Added redirects for /portfolio, /resume, /blog
- `src/components/BaseHead.astro` - Removed blog-placeholder-1.jpg import, removed RSS link tag, changed OG image to string path

**Deleted (31 files):**
- `src/components/ThreeAudiences.astro`
- `src/components/HeaderLink.astro`
- `src/layouts/BlogPost.astro`
- `src/pages/blog/index.astro`, `src/pages/blog/[...slug].astro`
- `src/pages/portfolio.astro`, `src/pages/portfolio/[slug].astro`
- `src/pages/resume.astro`, `src/pages/rss.xml.js`
- All 5 `src/content/blog/` files
- All 9 `src/content/portfolio/` files
- 6 `src/assets/blog-placeholder-*.jpg` files

## Decisions Made

- Wildcard redirect patterns `/portfolio/[...slug]` and `/blog/[...slug]` were removed from astro.config.mjs redirects. Astro SSG generates a dynamic route page for each wildcard redirect entry and requires `getStaticPaths()` — which cannot be satisfied when the content collections no longer exist. Root-level redirects `/portfolio -> /work` and `/blog -> /ground-level` are sufficient since individual slugs no longer exist as indexed URLs.
- BaseHead.astro's OG fallback image was changed from an imported `src/assets/blog-placeholder-1.jpg` (deleted) to the string path `/meredith-headshot.jpg` from the public/ directory.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed BaseHead.astro importing deleted blog-placeholder asset**
- **Found during:** Task A3 (npm run build after adding redirects)
- **Issue:** `src/components/BaseHead.astro` imported `../assets/blog-placeholder-1.jpg` as the fallback OG image. After Task A2 deleted src/assets/, the build failed with "Could not resolve ../assets/blog-placeholder-1.jpg"
- **Fix:** Removed the import and ImageMetadata type, changed fallback OG image to string path `/meredith-headshot.jpg`, changed image prop type from `ImageMetadata` to `string`, updated `new URL(image.src, ...)` to `new URL(image, ...)` in OG/Twitter meta tags, removed now-orphaned RSS link tag
- **Files modified:** `src/components/BaseHead.astro`
- **Verification:** npm run build succeeds with exit code 0
- **Committed in:** `60da1e8` (Task A3 commit)

**2. [Rule 1 - Bug] Removed wildcard redirect patterns incompatible with Astro SSG**
- **Found during:** Task A3 (npm run build with initial redirect config)
- **Issue:** `'/portfolio/[...slug]': '/work'` and `'/blog/[...slug]': '/ground-level'` in redirects caused Astro to generate dynamic route pages that fail with `GetStaticPathsRequired` — no content collections exist to provide paths
- **Fix:** Removed the two wildcard entries; kept only the three root-level redirects which generate static meta-refresh pages correctly
- **Files modified:** `astro.config.mjs`
- **Verification:** Build succeeds; dist/portfolio/index.html, dist/blog/index.html, dist/resume/index.html all contain `<meta http-equiv="refresh">`
- **Committed in:** `60da1e8` (Task A3 commit)

---

**Total deviations:** 2 auto-fixed (both Rule 1 bugs caused by the plan's own deletions)
**Impact on plan:** Both fixes necessary for build to succeed. No scope creep. The wildcard redirect omission is acceptable — individual blog/portfolio slugs are no longer published so there are no inbound URLs to redirect.

## Issues Encountered

None beyond the two auto-fixed build errors documented above.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Codebase is clean: no orphaned imports, no dead collections, no deleted-file references
- npm run build succeeds with zero errors
- Redirect pages at /portfolio, /blog, /resume are live in dist/
- BaseHead.astro OG image now uses public/ path — future phases should place OG images in public/ or update BaseHead to accept imported images again
- Phase 2 (Shared Components) can begin — no blockers from this plan

---
*Phase: 01-foundation-cleanup*
*Completed: 2026-03-01*
