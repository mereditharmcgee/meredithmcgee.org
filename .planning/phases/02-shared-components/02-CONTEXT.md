# Phase 2: Shared Components - Context

**Gathered:** 2026-02-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the reusable components (SubstackFeed, WorkCard) and data layer (`src/data/work.ts`) so that pages in Phases 3 and 4 can import and use them without reinventing fetch logic or data structures. Update the Footer to be simpler and cleaner. Header gets minor review.

</domain>

<decisions>
## Implementation Decisions

### Substack Post Display
- Text only — no thumbnail images from the RSS feed
- Simple absolute date format (e.g., "January 15, 2026")
- Links to Substack posts open in a new tab (`target="_blank"`)
- Claude's discretion on excerpt length — adapt based on context (3 posts on homepage vs 5-6 on Ground Level)

### WorkCard Presentation
- Minimal flat cards — clean, subtle border or divider, no shadows or elevation
- Category appears as a plain uppercase text label above the title (e.g., "RESEARCH")
- Title is prominent below the category label, description below that
- Claude's discretion on link presentation — adapt based on whether a link exists

### Work Data Shape
- Fields: title, description, category, optional link, `featured` boolean flag
- `featured: true` entries appear on the homepage "Selected Work" section
- All entries render on the Work page; Work Archive uses the same data source
- Claude picks sensible placeholder categories (matching public health work types)

### Footer Simplification
- Remove: tagline ("Connecting community needs..."), "Get in Touch" button, "Boston, Massachusetts" location line
- Keep: name heading (just "Meredith McGee" — drop MPH), subtitle ("Public health writer, evaluator, and researcher"), social links (LinkedIn + Substack), email, copyright
- Copyright line: "Meredith McGee" (no MPH)

### Claude's Discretion
- Header: review and make minor improvements if anything looks rough (spacing, hover effects)
- Substack excerpt length per context
- WorkCard link presentation (clickable card vs explicit link text)
- Placeholder work categories for `src/data/work.ts`
- RSS fallback behavior when Substack feed is unavailable (build must still succeed)
- Loading/error state handling

</decisions>

<specifics>
## Specific Ideas

No specific references — open to standard approaches. The overall feel should match the existing design system (olive greens, gold/cream, Playfair Display + Source Sans 3) and be content-forward rather than decorative.

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `Header.astro`: Already has correct 5-item nav from Phase 1, mobile hamburger menu, fixed positioning with backdrop blur
- `Footer.astro`: Has LinkedIn + Substack SVG icons, email link — needs simplification per decisions above
- `BaseHead.astro`: SEO meta tags component, can be used as-is
- `FormattedDate.astro`: Date formatting utility — may be useful for Substack post dates
- `global.css`: Full CSS variable system (`--color-dark`, `--color-gold`, `--color-cream`, etc.), `.btn` styles, `.container` utility, responsive breakpoints at 768px

### Established Patterns
- Astro components with scoped `<style>` blocks — follow this for SubstackFeed and WorkCard
- PascalCase `.astro` files in `src/components/`
- CSS custom properties for all colors, mobile-first responsive with `@media (max-width: 768px)`
- TypeScript strict mode, no path aliases (relative imports)
- No existing `src/data/` directory — will need to create it

### Integration Points
- `src/pages/index.astro`: Will import SubstackFeed (3 posts) and WorkCard (featured items) in Phase 4
- `src/pages/ground-level.astro`: Will import SubstackFeed (5-6 posts) in Phase 4
- `src/pages/work.astro`: Will import WorkCard + work data in Phase 3
- Work Archive page: Will import work data (all entries) in Phase 3
- `@astrojs/rss` already in dependencies — RSS parsing capability available

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-shared-components*
*Context gathered: 2026-02-28*
