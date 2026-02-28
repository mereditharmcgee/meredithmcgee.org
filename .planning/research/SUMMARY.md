# Project Research Summary

**Project:** meredithmcgee.org — personal website rebuild
**Domain:** Personality-driven personal site (writer, researcher, public health professional)
**Researched:** 2026-02-28
**Confidence:** MEDIUM overall

## Executive Summary

This is a portfolio-to-personality-site rebuild for Meredith McGee, MPH. The goal is to shift the site from a credentials-forward professional portfolio (with a 1,004-line consulting component and resume/portfolio routes) to a voice-forward personal site in the style of hankgreen.com — human first, work second. The existing Astro 5.x SSG stack is correct and complete; no framework or hosting changes are needed. The rebuild is almost entirely structural and content work layered over the existing codebase, with two new dependencies: `fast-xml-parser` for Substack RSS parsing and `motion` for scroll-triggered animations.

The recommended approach is to build in six phases ordered by dependency: (1) delete old structure cleanly, (2) build shared components, (3) build static pages without data dependencies, (4) build RSS-dependent pages, (5) elevate the design system, (6) add Easter eggs last as purely additive polish. This order is dictated by hard architectural dependencies — pages depend on components, RSS-consuming pages depend on the SubstackFeed component, and the design system is easier to tune once page structure is stable. The SubstackFeed component is the highest-risk integration point and must be built with a graceful fallback so a Substack outage can never break the build.

The main non-technical risk is voice drift. The site has specific voice rules (no em dashes, no hedging, contractions always, lead with concrete) that must be applied consistently across all pages. Different pages built in different phases will drift toward formal professional prose unless the voice rules are made unavoidable. The second risk is the "interesting person reads as unfocused person" failure mode — removing the professional structure without replacing it with clear narrative throughlines produces a site that feels scattered. Both risks are content risks, not technical ones, and both must be addressed before pages go into review rather than after.

---

## Key Findings

### Recommended Stack

The existing stack (Astro 5.x SSG, GitHub Pages via GitHub Actions, native CSS custom properties) is the right stack and requires no changes to framework, hosting, or build pipeline. The critical decision is to NOT add Tailwind CSS — the existing hand-crafted CSS architecture is already good, and mid-project migration creates churn with no benefit. All styling work goes into `global.css` as evolved CSS custom properties.

Two new dependencies are justified: `fast-xml-parser` (^4.x) for parsing Substack's RSS/Atom XML at build time, and `motion` (^10.x) for scroll-triggered entrance animations. Both are small, zero-framework-dependency libraries. Everything else — Easter egg interactions, color token evolution, typography refinement — requires no new packages.

**Core technologies:**
- Astro ^5.16.8: SSG framework — already installed, keep as-is
- Native CSS custom properties: design system tokens — extend `global.css`, do not replace
- `fast-xml-parser` ^4.x: Substack RSS XML parsing at build time — lighter and more maintained than `rss-parser`
- `motion` ^10.x (vanilla JS API): scroll-triggered entrance animations — framework-agnostic, 4kb core
- Google Fonts (existing import): Playfair Display + Source Sans 3 — keep, refine weights and usage

**What NOT to add:** Tailwind CSS, Framer Motion (React-only), GSAP (overkill + paid license), AOS (unmaintained since 2022), React/Preact islands, headless CMS.

### Expected Features

The feature research identifies a clear MVP and a short list of deliberate anti-features that must be actively avoided.

**Must have (table stakes):**
- Clear "who is this person" in the first screen — the single most important piece of real estate
- About page as prose narrative (not a CV in paragraph form)
- Consistent, minimal nav with five items (Home, About, Work, Ground Level, Contact)
- Substack subscribe / follow path — the visitor's "next step"
- Ground Level page with RSS feed and subscribe CTA
- Mobile-responsive layout, verified after redesign
- Basic SEO (OG tags, canonical, sitemap) — already exists, verify after visual identity change
- Typography that is readable and distinctive — Playfair Display + Source Sans 3 refined, not replaced
- Fast load time — Astro SSG advantage, but watch for animation library weight

**Should have (differentiators):**
- Voice-consistent intro that surprises — opening line is the entire pitch
- Substack RSS as a living signal on the homepage (3 posts) and Ground Level page (5-6 posts)
- Easter eggs and micro-delights — Ember click interaction minimum; 2 additional if time allows
- Warm, specific color identity — evolve the existing green/brown palette, do not replace it
- Curated Work page (4-5 items) + Work Archive for completeness
- Subtle, intentional scroll-entrance animations

**Defer without guilt:**
- Work Archive subpage: build after Work page content is finalized
- Easter eggs 2 and 3: add after core pages are stable
- Photo audit: can happen during implementation, should not block launch
- Scheduled GitHub Actions rebuild for RSS freshness: add if post staleness becomes a concern

**Deliberate anti-features (never build):**
- Services section, methodology cards, competency grids — signals consulting, not personhood
- Multiple competing CTAs on homepage
- Dark mode toggle — commit to the warm palette fully
- Social media feed embeds (CORS-fragile, clutters layout)
- Pop-up newsletter signup
- Testimonials or "as seen in" logos

### Architecture Approach

The architecture is pure Astro SSG with all data flows at build time. The central new component is `SubstackFeed.astro`, which fetches and parses the Substack RSS feed during `npm run build` and renders posts as static HTML. This single component serves both the homepage (limit=3) and the Ground Level page (limit=6), avoiding fetch logic duplication. Work items are stored as a typed TypeScript array in `src/data/work.ts` rather than a content collection — the right choice given that work items are short metadata entries with no markdown bodies. Easter egg components are fully self-contained Astro files with scoped `<script>` and `<style>` blocks; pages just import and drop them in.

**Major components:**
1. `SubstackFeed.astro` — build-time RSS fetch + post card rendering; accepts `limit` prop; includes try/catch graceful fallback
2. `Header.astro` (modified) — five-item nav replacing current six-item nav; remove Portfolio, Resume; add Ground Level
3. `Footer.astro` (modified) — add LinkedIn + Substack social icons; update tagline copy
4. `EmberClick.astro` (new) — self-contained click-to-spawn ember particle Easter egg; global document listener
5. `WorkCard.astro` (new) — reusable card component for work items on Work page and homepage
6. `src/data/work.ts` (new) — typed work item arrays (`featuredWork`, `allWork`); single source of truth for both Work page and Archive

**Files to delete entirely:** `ThreeAudiences.astro` (1,004 lines), `HeaderLink.astro`, `BlogPost.astro` layout, `src/pages/blog/`, `src/pages/portfolio.astro`, `src/pages/resume.astro`, `src/content/blog/`, `src/content/portfolio/`.

### Critical Pitfalls

1. **Voice drift across build phases** — voice rules live in a spec doc, not in the files being edited. Prevention: add voice rules as a comment block in the main layout or `BaseHead.astro`; read all copy aloud before marking any page complete. Warning signs: "I leverage," "cross-disciplinary," "at the intersection of," any em dash in output HTML.

2. **Substack RSS client-side fetch (CORS failure)** — any `fetch()` inside a `<script>` tag that hits the Substack URL will be blocked by CORS at runtime. Build-time fetch in Astro frontmatter bypasses CORS entirely. Wrap all fetches in try/catch with graceful fallback (show "Read on Substack" link); build must never fail due to external dependency.

3. **Orphaned routes creating 404s** — `/portfolio`, `/blog`, `/resume` may have inbound links from LinkedIn, GitHub, or Google's cache. GitHub Pages does not support server-side redirects. Prevention: create thin static HTML pages at old paths with `<meta http-equiv="refresh">` redirect tags; remove old routes from sitemap.

4. **"Interesting person" reads as "unfocused person"** — removing professional structure without replacing it with narrative throughlines produces a site that feels scattered. Prevention: homepage intro copy (already finalized) is the anchor; Work page must be curated to 4-5 items, not comprehensive; About page must be an essay, not a resume in paragraph form.

5. **Easter eggs that break accessibility** — interactions triggered by hover only fail on touch devices; animations without `prefers-reduced-motion` checks cause vestibular disorder problems. Prevention: trigger interactions on click (works on touch), wrap all JS animations in `prefers-reduced-motion` media query check, test on iOS Safari and Android Chrome before marking any Easter egg done.

---

## Implications for Roadmap

Based on combined research, a six-phase build order is recommended. The ordering is dictated by hard architectural dependencies between components and pages, not by complexity or importance.

### Phase 1: Foundation Cleanup
**Rationale:** Deleting legacy structure before building new prevents merge conflicts, eliminates dead import errors, and forces a clean slate. The ThreeAudiences component is the highest-priority deletion — it's 1,004 lines that actively contradict the site's direction, and keeping it "just in case" is a known anti-pattern.
**Delivers:** A buildable codebase with all old routes removed, redirect pages in place for old URLs, and updated nav structure.
**Addresses:** Contact path simplification, nav reduction to 5 items, sitemap cleanup.
**Avoids:** Orphaned routes / 404 pitfall (critical pitfall 3); ThreeAudiences import-after-delete build error.

### Phase 2: Shared Components
**Rationale:** Pages depend on components. SubstackFeed, WorkCard, and the updated Header/Footer must exist before any page that uses them can be built. This phase also establishes `src/data/work.ts` as the data layer and adds `SUBSTACK_RSS_URL` to `consts.ts`.
**Delivers:** `SubstackFeed.astro` (with graceful fallback), `WorkCard.astro`, updated `Header.astro`, updated `Footer.astro`, `src/data/work.ts`.
**Uses:** `fast-xml-parser` (install in this phase), native Astro fetch pattern.
**Implements:** Build-time RSS fetch architecture; single-source-of-truth work data pattern.
**Avoids:** RSS CORS failure pitfall (critical pitfall 2) — the graceful fallback is designed here.

### Phase 3: Static Pages
**Rationale:** About, Contact, Work Archive, and Work page have no external data dependencies. Build and verify them while the RSS integration is not yet a variable. These pages also require the most copy finalization.
**Delivers:** `about.astro` (essay narrative), `contact.astro` (simplified, warm), `work.astro` (curated 4-5 items), `work/archive.astro` (comprehensive listing).
**Addresses:** About page as prose narrative, curated work presentation, contact path.
**Avoids:** "Unfocused person" pitfall (critical pitfall 4) — Work page curation happens here.

### Phase 4: RSS-Dependent Pages
**Rationale:** Depends on SubstackFeed component from Phase 2. Homepage and Ground Level page both use the RSS component; they cannot be finalized until SubstackFeed is working and verified.
**Delivers:** `ground-level.astro` (RSS feed + subscribe CTA + intro paragraph), rewritten `index.astro` (3-beat: Intro, Working On, Selected Work).
**Uses:** `SubstackFeed.astro` with limit=3 (homepage) and limit=6 (Ground Level).
**Implements:** Living signal / "What I'm Working On" differentiator.
**Avoids:** Ground Level page without context paragraph (UX pitfall); missing subscribe CTA.

### Phase 5: Design System Elevation
**Rationale:** Typography sizing, color token evolution, spacing, and animation layer are easier to tune once page structure is stable. If design work happens concurrently with structural work, you end up refining designs that then change. Doing it last means refining against the real pages.
**Delivers:** Evolved CSS custom properties in `global.css` (deeper palette, new `--color-gold-warm`, `--color-text-muted`), refined typography scale (weight, sizing, line-height), scroll-entrance animations via `motion` library.
**Uses:** Extended CSS custom properties, `motion` ^10.x (install in this phase), CSS `@starting-style` for native entry animations where supported.
**Implements:** Warm color identity differentiator; subtle animations that feel intentional.
**Avoids:** Inline styles anti-pattern; mid-project Tailwind migration.

### Phase 6: Easter Eggs and Polish
**Rationale:** Easter eggs are purely additive — no page depends on them. They should be the last thing built because they're the reward for getting everything else right, not a substitute for it. Accessibility testing goes here.
**Delivers:** `EmberClick.astro` (Ember click scatter effect), 2 additional delight components, mobile nav verification, cross-browser testing, prefers-reduced-motion CSS rules.
**Addresses:** Easter egg micro-delights differentiator; accessibility compliance.
**Avoids:** Hover-only interactions (mobile fail), missing prefers-reduced-motion checks, Easter egg competing with content.

### Phase Ordering Rationale

- **Cleanup before build:** Old imports and files cause build errors if not removed before new structure is added. Redirect pages must exist before old routes are deleted.
- **Components before pages:** SubstackFeed and WorkCard must exist before the pages that import them. This is a hard dependency, not a preference.
- **Static before dynamic:** Building pages without external data dependencies first means you can verify HTML structure, copy, and layout without the RSS fetch being a variable that can fail.
- **Structure before style:** Refining the design system against finished pages is more efficient than refining against work-in-progress pages that will change.
- **Polish last:** Easter eggs are purely additive. They get built after everything that matters is done.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2 (SubstackFeed):** Substack's feed may emit Atom format rather than RSS 2.0 — verify feed structure against the actual URL before writing the XML parser. The `fast-xml-parser` approach handles both, but the field names differ.
- **Phase 4 (RSS-Dependent Pages):** Test the build-time RSS fetch in a GitHub Actions dry run before merging — CI network restrictions may affect external fetches. Establish the graceful fallback before this becomes a production issue.

Phases with standard patterns (skip deeper research):
- **Phase 1 (Cleanup):** Straightforward file deletion and nav update — well-documented Astro patterns.
- **Phase 3 (Static Pages):** Pure Astro SSG page work — no external integrations, no novel patterns.
- **Phase 5 (Design System):** CSS custom property evolution — no external unknowns; just visual iteration.
- **Phase 6 (Easter Eggs):** Vanilla JS click handlers + CSS keyframes — well-understood patterns; main risk is accessibility, which has a clear solution.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | MEDIUM | Astro 5.x patterns are HIGH confidence; `motion` package name/version needs verification on install (package renamed from `@motionone/animation` to `motion`); fast-xml-parser version confirmed MEDIUM |
| Features | HIGH | Feature landscape is well-established for personality-driven sites; reference site analysis is MEDIUM (training data, not live visits), but the genre conventions are clear |
| Architecture | HIGH | Based on direct codebase audit; Astro SSG fetch patterns are highly confident; CORS behavior is a well-documented constraint; data flow is straightforward |
| Pitfalls | MEDIUM | Critical pitfalls (CORS, voice drift, orphaned routes) are HIGH confidence; performance traps and UX pitfalls are MEDIUM based on general patterns, not site-specific measurement |

**Overall confidence:** MEDIUM-HIGH

### Gaps to Address

- **Substack feed format:** Whether the feed is RSS 2.0 or Atom affects XML parsing field names. Resolve by fetching `https://meredithwritespublichealth.substack.com/feed` and inspecting the raw XML before writing the parser. Low effort, eliminates a real unknown.
- **`motion` package version:** The library was renamed from `@motionone/animation` to `motion` and the major version should be confirmed via `npm show motion version` before installing. Do not assume the training-data version is current.
- **Work page copy:** The Work page curated highlights (content, not structure) are not yet finalized per PROJECT.md. Work Archive can only be built after the curated set is decided. Flag this as a content dependency before Phase 3 begins.
- **OG image / BaseHead after redesign:** The visual identity change means current OG images may no longer match the site. Verify OG tags show correct content after Phase 5 (design system) completes.
- **Formspree contact form:** Whether to keep, simplify, or remove the Formspree form is listed as "simplify" in the spec but not fully resolved. Make the decision before Contact page is built in Phase 3.

---

## Sources

### Primary (HIGH confidence)
- Direct codebase audit: `src/components/`, `src/pages/`, `src/content.config.ts`, `astro.config.mjs`, `src/styles/global.css`, `package.json` — confirmed existing stack, component inventory, and CSS architecture
- `.planning/PROJECT.md` — project constraints, decisions, and voice rules
- `.planning/codebase/ARCHITECTURE.md` — confirmed existing architecture patterns
- `.planning/codebase/CONCERNS.md` — confirmed CORS issue and SubstackFeed as missing feature
- Astro 5.x SSG data fetching (build-time fetch in frontmatter) — standard Astro behavior since v1, HIGH confidence
- GitHub Pages redirect limitations (no server-side redirects) — well-documented platform constraint
- CORS restriction on Substack RSS from browser context — W3C browser security constraint; applies universally

### Secondary (MEDIUM confidence)
- `fast-xml-parser` (github.com/NaturalIntelligence/fast-xml-parser) — most-downloaded XML parser for this use case; version 4.x confirmed as current based on npm package history
- `motion` library (motion.dev) — vanilla JS animation API; API may have changed slightly from training data; verify on install
- Substack RSS feed conventions — training data + community documentation; feed format (RSS 2.0 vs Atom) unverified against live URL
- Reference site observations (hankgreen.com, joshwcomeau.com, cnewton.org) — training knowledge, not verified against live sites in this session

### Tertiary (LOW confidence)
- Specific CSS hex values in evolved color palette — proposed values; require visual testing against actual dark-background palette before committing
- Typography weight recommendations (Source Sans 3 body weight adjustment) — requires testing on actual device and background

---

*Research completed: 2026-02-28*
*Ready for roadmap: yes*
