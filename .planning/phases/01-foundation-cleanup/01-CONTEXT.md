# Phase 1: Foundation Cleanup - Context

**Gathered:** 2026-02-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Remove old site structure (blog, portfolio, resume, ThreeAudiences), establish the new 5-item navigation, add footer social links, and wire redirects for all old routes so nothing 404s. No new page content is created beyond a Ground Level placeholder.

</domain>

<decisions>
## Implementation Decisions

### Redirect destinations
- /portfolio redirects to /work
- /blog redirects to /ground-level (the placeholder page)
- /resume redirects to /about
- All sub-routes also redirect: /blog/* to /ground-level, /portfolio/* to /work
- Use permanent (301) redirects since the old content is not coming back

### Ground Level placeholder
- Create a simple placeholder page at /ground-level
- Warm teaser tone: brief intro explaining what Ground Level is + link to Substack
- Include a link to Substack (not a full subscribe CTA — that comes in Phase 4)
- Substack URL: groundlevel.substack.com (confirm during implementation)

### Footer social links
- Icons only for LinkedIn and Substack (no text labels)
- Positioned below the email address in the footer-contact section
- Keep the "Get in Touch!" CTA button — it's a clear action separate from nav
- LinkedIn URL: linkedin.com/in/meredithmcgee (confirm during implementation)
- Contact email stays as-is

### Nav labels and order
- Nav order: Home, About, Work, Ground Level, Contact
- "My Work" becomes "Work" (shorter, cleaner)
- "Ground Level" is the exact label (matches newsletter name)
- Footer tagline/subtitle stays as-is for now — updated in Phase 5 (Design System Elevation)

### Claude's Discretion
- Exact redirect implementation method (Astro redirects config vs redirect pages)
- Social icon styling (SVG inline vs icon library) — should match site's color palette
- Placeholder page layout and exact copy wording
- How to handle the RSS feed generation (rss.xml.js) after blog removal

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches. The focus is clean removal and structural correctness, not visual design (that's Phase 5).

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- Header.astro: Already has nav link array pattern (`navLinks` array) — just update the entries
- Footer.astro: Existing two-column layout (info + contact) — social icons slot naturally below email
- BaseHead.astro: SEO meta component works for the new placeholder page
- global.css: Design tokens (--color-gold, --color-cream, etc.) for consistent icon styling

### Established Patterns
- Page template: frontmatter imports (BaseHead, Header, Footer, SITE_TITLE) + HTML structure
- Scoped styles in `<style>` blocks per component
- Mobile-first responsive with 768px breakpoint
- Content collections use Zod schemas in content.config.ts

### Integration Points
- src/content.config.ts: Blog and portfolio collection schemas need removal
- src/pages/blog/ and src/pages/portfolio/: Route directories to delete
- src/pages/portfolio.astro and src/pages/resume.astro: Pages to delete
- src/components/ThreeAudiences.astro: Component to delete
- src/pages/rss.xml.js: May need removal or repurposing (depends on blog deletion)
- astro.config.mjs: May need redirect configuration

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation-cleanup*
*Context gathered: 2026-02-28*
