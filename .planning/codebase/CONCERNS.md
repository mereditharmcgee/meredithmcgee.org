# Codebase Concerns

**Analysis Date:** 2025-02-28

## Performance Bottlenecks

### Large Unoptimized Images in Public Directory

**Problem:** Three large PNG image files (11M, 11M, 4.1M) are served unoptimized from `public/`:
- `community-research.png` - 11M
- `design-evaluation.png` - 11M
- `grant-writing.png` - 4.1M

**Files:** `public/community-research.png`, `public/design-evaluation.png`, `public/grant-writing.png`

**Impact:**
- Production build size: 46M (driven primarily by these assets)
- Slow initial page load on homepage (`src/pages/index.astro` line 54, 63, 72)
- Significant bandwidth consumption for mobile users
- Poor Lighthouse performance scores likely

**Improvement Path:**
1. Use Astro's Image component or sharp integration to auto-generate WebP/AVIF formats
2. Implement lazy loading for approach card images
3. Serve responsive variants (srcset)
4. Target: reduce combined image size to ~3-5M total
5. Implement `.astro` Image component in `src/pages/index.astro`

---

## Missing Critical Features

### Incomplete Substack Integration

**Problem:** WEBSITE-SPEC.md (line 72-75, 183-185) requires displaying recent Substack posts on homepage and dedicated Ground Level page, but RSS feed is not implemented.

**What's Missing:**
- Ground Level page does not exist (mentioned in spec but not implemented)
- No RSS feed fetching from Substack
- No caching strategy for external feed
- Homepage "What I'm Working On Right Now" section (Beat 2) is placeholder only

**Files:** `src/pages/index.astro` (lines 42-85 have placeholder sections), spec at lines 72-75, 132-142

**Risk:**
- Spec requirement not met
- Homepage missing "living" content that gives reasons to return
- User experience degrades without regularly updated content

**Priority:** HIGH - Direct spec requirement

**Implementation:**
- Create `src/pages/ground-level.astro`
- Add RSS fetching utility (use `node-fetch` or Astro's built-in fetch)
- Implement caching to avoid rate limiting on Substack feed
- Parse feed and display 3-6 most recent posts with excerpt

---

### Incomplete Work Page Content Structure

**Problem:** Work page (`src/pages/work.astro`) displays service descriptions and portfolio items, but spec (line 117-130) indicates work content still needs definition.

**Files:** `src/pages/work.astro` (contains service blocks but no "selected work" display), `src/content/portfolio/` (9 portfolio items exist)

**What's Missing:**
- "Selected Work" section that bridges homepage and full portfolio
- Work archive subpage (mentioned in spec line 126-130)
- Clear content organization for "work" vs "portfolio"
- Integration between portfolio grid and work page narrative

**Risk:** Conflicting information architecture - unclear what "Work" page is vs "Portfolio" page

**Improvement Path:**
1. Clarify separation: "Work" explains philosophy, "Portfolio" shows projects
2. Add portfolio grid preview to work page
3. Create archive subpage at `/portfolio/archive` for comprehensive listing
4. Link work → portfolio flow clearly

---

## Fragile Areas

### ThreeAudiences Component Complexity

**Files:** `src/components/ThreeAudiences.astro`

**Why Fragile:**
- 1,004 lines of mixed concerns (HTML, CSS, JavaScript)
- Complex state management for three audience perspectives with synchronized typewriter effects
- Inline JavaScript for interactivity without clear separation
- Hard-coded content duplicated across three audience versions (lines 81-750+)
- CSS buried within component (complex modal, animation styles)
- No error boundaries or fallback UI if JavaScript fails

**Safe Modification Path:**
1. Extract typewriter logic to separate utility (currently inline)
2. Move component CSS to global style file
3. Consider breaking into smaller components (AudienceSelector, TextDisplay, Modal)
4. Add error handling for failed modal interactions
5. Test coverage: Currently no tests for state synchronization

**Test Coverage Gaps:**
- No tests for audience switching behavior
- No tests for typewriter animation completion
- No tests for modal open/close interactions
- Accessibility not tested (ARIA attributes present but untested)

---

### Hardcoded Image References Throughout Pages

**Files:** Multiple page files reference images via hardcoded `<img src="/...">` paths
- `src/pages/about.astro` (8 image references: lines 21, 76, 85, 94, 103, 112, 121, 157)
- `src/pages/index.astro` (5 image references: lines 35, 54, 63, 72, 130)
- `src/pages/resume.astro` (7 image references: lines 33, 42, 61, 79, 97, 115, 131)
- `src/components/Header.astro` (1 reference: line 17)

**Why Fragile:**
- No centralized asset management
- Difficult to track missing or broken image files
- URL changes require manual edits across multiple files
- No validation that referenced images exist

**Safe Modification:**
1. Create asset manifest in `src/consts.ts` or new `src/assets.ts`
2. Import images as modules where possible
3. Use Astro Image component for automatic optimization
4. Add build-time validation that all referenced images exist

---

## Test Coverage Gaps

### No Test Suite for Interactive Components

**Untested Areas:**
- Portfolio filter functionality (`src/pages/portfolio.astro` lines 33-41) - JavaScript filter logic has no tests
- Contact form submission (`src/pages/contact.astro` lines 54-83) - form validation and Formspree integration untested
- Header mobile menu toggle - no tests for hamburger menu behavior
- ThreeAudiences component - complex state and animations untested

**Files:** `src/pages/portfolio.astro`, `src/pages/contact.astro`, `src/components/Header.astro`, `src/components/ThreeAudiences.astro`

**Risk:**
- Filter buttons may break on redesign
- Form validation not verified
- Mobile navigation might fail silently
- Interactive features regress without notice

**Priority:** MEDIUM - interactive elements but not core to primary user flows

**Approach:** Add Jest/Vitest configuration and tests for:
1. Portfolio filter by tags and category
2. Contact form validation
3. Header mobile menu toggle
4. ThreeAudiences audience switching and modal state

---

### No Build-Time Validation for Images

**Problem:** No verification that images referenced in code actually exist in `public/`

**Missing Images Risk:**
- Broken image references won't be caught at build time
- Production deploys could have broken images
- No warning system for orphaned assets

**Implementation:**
- Add build script to validate all image references match files in `public/`
- Could be simple bash script in pre-build hook

---

## Tech Debt

### Mixed Styling Approaches

**Problem:** Styling is split across multiple locations:
- Global CSS: `src/styles/global.css` (212 lines)
- Inline styles in Astro components (every `.astro` file has `<style>` blocks)
- Inline CSS-in-JS (portfolio grid uses `style=` attributes for animations)

**Files:** `src/styles/global.css`, all files in `src/pages/`, all files in `src/components/`

**Impact:**
- Difficult to maintain consistent design system
- Color variables defined in global.css but overridden locally
- Responsive breakpoints not centralized
- Portfolio grid uses inline `--delay` style props (portfolio.astro line 51) instead of CSS

**Improvement:**
1. Move all section-specific styles to global.css
2. Create utility classes for common patterns
3. Document breakpoint strategy (current: clamp() functions, no explicit breakpoints)
4. Consider Tailwind migration for consistency (currently raw CSS)

---

### Contact Form Dependency on External Service

**Problem:** Contact form uses Formspree for submission (`src/pages/contact.astro` line 54)

**Risk:**
- No fallback if Formspree API is down
- No client-side validation feedback before form submission
- No error state UI if submission fails
- External service dependency for critical functionality
- No success feedback to user after form submission

**Files:** `src/pages/contact.astro` lines 54-83

**Mitigation:**
- Add client-side validation before form submission
- Add visual feedback (loading state, success/error messages)
- Consider self-hosted alternative or backup

---

### Package.json Version Strategy

**Problem:** No version pinning strategy

**Files:** `package.json` (all dependencies use `^` caret ranges)

**Example:**
- `@astrojs/mdx@^4.3.13`
- `astro@^5.16.8`

**Risk:**
- Minor version updates could introduce breaking changes
- No reproducible builds across environments
- Lockfile provides protection but convention unclear

**Improvement:** Document version strategy in CLAUDE.md or add comment in package.json

---

## Security Considerations

### Form Submission Security

**Risk:** Contact form (`src/pages/contact.astro` lines 54-83) submits directly to Formspree without explicit CSRF protection

**Current State:**
- Form uses POST to external service
- No explicit CSRF tokens (Formspree handles via origin validation)
- Email addresses visible in form

**Recommendation:**
- Trust Formspree's security model (they handle CSRF server-side)
- Consider adding honeypot field to reduce spam
- No changes needed if Formspree validation is sufficient

---

### No Environment Variable Validation

**Problem:** No validation that required environment variables exist

**Missing:**
- `astro.config.mjs` doesn't validate `site` URL is set correctly
- No check for required public/private keys if future integrations need them

**Files:** `astro.config.mjs` (hardcoded site URL)

**Low Priority:** Current implementation is static site with no runtime env vars, but should add if future features require configuration

---

## Scaling Limits

### Static Build for Dynamic Content

**Problem:** Site is fully static (SSG) but would need architecture change for:
- Live Substack feed updates (currently requires manual rebuild)
- Dynamic portfolio filtering (works client-side but not SEO-friendly)
- Comment systems or user interactivity

**Current Solution:** Client-side JavaScript for portfolio filters (`src/pages/portfolio.astro` has filter buttons but pages are pre-rendered)

**If Needed:**
- Switch to Astro SSR or hybrid rendering
- Add API routes for dynamic content
- Current static approach is appropriate for current use case

---

## Dependencies at Risk

### Sharp Image Processor Version

**Concern:** `sharp@^0.34.5` is major dependency for image optimization

**Risk:**
- Major version changes could affect image quality
- Large dependency with native bindings
- Version mismatch between development and production could cause issues

**Current Usage:** Sharp is installed but not actively used (images not processed through Astro Image component)

**Recommendation:** If implementing image optimization (see Performance section), pin sharp version more strictly or test upgrade path carefully

---

## Known Behavioral Issues

### Portfolio Filter Not SEO-Friendly

**Problem:** Portfolio filtering is client-side only (`src/pages/portfolio.astro` lines 33-85)

**Impact:**
- Filtered views not crawlable by search engines
- Bookmarking filtered view doesn't work (no URL state)
- Deep linking to specific tag/category not possible

**Files:** `src/pages/portfolio.astro` (filter bar and JavaScript)

**Could Be Improved:**
- Use URL query parameters to track filter state
- Generate static pages for each filter combination
- Or accept current UX limitation (all projects visible on single page)

---

## Documentation Gaps

### Missing CLAUDE.md Update

**Problem:** `CLAUDE.md` exists but doesn't match current site structure

**Files:** `CLAUDE.md` references old pages (mentions "portfolio" and "my work" but current structure has "work" and "portfolio")

**Update Needed:**
- Add current page structure: Home, About, Work, Ground Level (if implemented), Contact, Resume, Blog, Portfolio
- Document color variables and design tokens
- Add Formspree configuration note
- Document image asset management strategy

---

*Concerns audit: 2025-02-28*
