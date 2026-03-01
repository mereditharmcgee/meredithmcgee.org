# Phase 3: Static Pages - Context

**Gathered:** 2026-02-28
**Status:** Ready for planning

<domain>
## Phase Boundary

About, Work, Work Archive, and Contact pages are complete, correctly voiced, and readable. No external data dependencies (RSS, APIs). Pages use existing components (WorkCard, Header, Footer) and data layer (work.ts) from Phase 2. This phase transforms existing page content and structure to match requirements — it does not add new capabilities.

</domain>

<decisions>
## Implementation Decisions

### About page essay transformation
- Reshape the current 6-section structure (Hero, What Guides My Work, How I Work, What Got Me Here, What Keeps Me Going, What Brings Me Joy) into a single continuous personal essay with no section headers, no bullet lists, no CV structure
- Biographical timeline content (Rochester, Lafayette, Lavender Lane, Yale, Bradbury-Sullivan, Parabola) gets woven into flowing narrative paragraphs — no logos, no timeline structure, no story-block layout
- Tighten significantly — roughly half the current word count. Cut repetition, get to the point faster
- Both photos kept (headshot + family photo) and placed naturally within the essay as visual breaks, like a magazine article with inline images
- Personal life content (Ember, K, theater, painting) is essential — include it, woven naturally toward the end of the essay
- Body text column must be comfortably readable width, not stretched to full browser width on desktop (requirement ABUT-02)
- Every paragraph gets generous spacing (requirement ABUT-03)

### Work page curation and display
- Drop the current capabilities/services structure entirely (numbered service blocks, "What I Do" section, Areas of Focus cards, "Currently Interested In" tag cloud)
- Replace with: brief capabilities intro (1-2 paragraphs providing context), then featured work items displayed using the WorkCard component
- Show only the 4 featured items from work.ts on the main Work page — the full list lives on the Archive
- Drop the Areas of Focus cards and interests section — the work items themselves communicate what she focuses on
- Simple text link at the bottom of the Work page pointing to the Work Archive (e.g., "See full archive" or "View all work") — understated, not a styled CTA button

### Work Archive page
- New page showing all work items (featured + non-featured) from work.ts as a flat list with category tags — no grouping by category
- Not in the main navigation — only reachable from the link at the bottom of the Work page
- Reuses the WorkCard component for consistent display

### Contact page voice and simplicity
- Keep the Formspree contact form but simplify it: name, email, message only — drop the subject dropdown
- Genuinely casual voice — like talking to someone at a coffee shop. "I'd love to hear from you. Here's my email. Let's talk." Not "I welcome the conversation"
- Uses contractions throughout. Zero corporate language. No em dashes
- One casual sentence mentioning interests (public health, writing, community work) — not a bulleted list, not gatekeeping
- Single centered column layout — warm intro text, email plainly shown, LinkedIn and Substack links, then the simplified form below. Not the current two-column corporate layout
- Email address (meredith.ar.mcgee@gmail.com), LinkedIn, and Substack links all present

### Claude's Discretion
- WorkCard category tag styling adjustments (current style may be fine or may need tweaking)
- Work Archive intro text (brief sentence or none)
- Work Archive URL path (/work/archive vs /work-archive vs other)
- Exact photo placement and sizing within the About essay
- Loading skeleton or transition behavior between pages

</decisions>

<specifics>
## Specific Ideas

- The About essay should read like a personal essay, not a resume — "a continuous personal essay" is the explicit requirement
- Contact page tone reference: coffee shop conversation, not corporate "contact us" page
- The Work page should let the actual work speak — no need to categorize or explain capabilities when the items themselves demonstrate them
- Family photo caption currently says "at Disney World" — consider whether alt text needs updating for the essay context

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `WorkCard.astro`: Card component displaying title, description, category tag, and optional link — ready to use on both Work and Archive pages
- `work.ts`: Data layer with 8 WorkItem entries (4 featured, 4 non-featured), each with title, description, category, optional link, and featured boolean
- `Header.astro` and `Footer.astro`: Already updated from Phase 1/2 with correct nav and social links
- `BaseHead.astro`: Head component for meta tags and SEO
- `global.css`: Design system with color variables, `.container`, `.btn`, `.bg-dark`/`.bg-light`/`.bg-medium` section backgrounds, responsive breakpoints

### Established Patterns
- Pages are self-contained Astro files (no layout wrapper) — each imports Header, Footer, BaseHead directly
- Alternating section backgrounds (bg-dark, bg-light, bg-medium) create visual rhythm
- Scoped `<style>` blocks in each page file for page-specific CSS
- Max-width containers (800px for text-heavy content, 1100px for wider layouts)
- Responsive breakpoints at 968px and 768px
- Formspree integration at `https://formspree.io/f/xgooeagz` for the contact form

### Integration Points
- New Work Archive page needs to be created at a new route (e.g., `src/pages/work/archive.astro` or `src/pages/work-archive.astro`)
- Work page link to archive must point to the correct route
- About page transformation is a full content rewrite within the existing file
- Contact page is a significant restructure of the existing file

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-static-pages*
*Context gathered: 2026-02-28*
