# Phase 4: RSS-Dependent Pages - Context

**Gathered:** 2026-03-01
**Status:** Ready for research

<domain>
## Phase Boundary

Homepage and Ground Level page are built and live, showing real Substack content pulled at build time. The homepage matches the "person first" brief from WEBSITE-SPEC.md. Both pages use the SubstackFeed component from Phase 2 and the work data layer from Phase 2. No new external dependencies.

</domain>

<decisions>
## Implementation Decisions

### Homepage structure (three beats)
- **Beat 1 - The Intro:** Meredith's name (no "MPH" in main display), hero photo, and the FINAL intro copy from WEBSITE-SPEC.md. This is what people see first. No abstract tagline above it. Just her.
- **Beat 2 - What I'm Working On:** 3 most recent Substack posts via SubstackFeed component (title, date, excerpt, link to Substack). This is the "living" part of the site.
- **Beat 3 - Selected Work:** 3-4 highlighted work pieces from work.ts (featured items), each with title, description, and link. "See more" link to /work page.
- Footer already exists from Phase 1/2.

### Homepage intro copy (FINAL, from WEBSITE-SPEC.md)
"I'm Meredith. I'm deeply curious about systems and what happens when they fall short. That curiosity has taken me a lot of places: reviving LGBTQ+ programming and building the first gender-inclusive housing at my college, writing grants that have funded over a million dollars in health equity and community programs, researching LGBTQ+ mental health at Yale, studying how people actually experience legal cannabis markets, and occasionally building weird things on the internet. The thread that connects all of it is trying to make public health make sense to the people it's supposed to serve. Right now I'm in Boston, publishing Ground Level (a Substack about cannabis, public health, and the gap between policy and practice), doing research at Parabola Center for Law and Policy, and writing grants at Bradbury-Sullivan LGBT Community Center. I live with my partner K and a black lab named Ember who is scientifically proven to reduce my stress."

### Ground Level page
- Brief description of what Ground Level is: "Ground Level is my Substack about cannabis, public health, and the gap between policy and practice." Keep it short.
- Substack subscribe CTA
- 5-6 most recent posts (title, date, excerpt, link to Substack) via SubstackFeed component
- The posts speak for themselves — minimal intro framing needed

### Design reference
- Homepage should feel like hankgreen.com: clean, personal, browsable, "make things, learn stuff" energy
- Person first, not credentials. The intro copy does the heavy lifting
- Layout should breathe — generous whitespace

### Claude's Discretion
- Hero photo sizing and placement
- Exact layout of the three beats (spacing, background sections)
- Ground Level page styling and subscribe CTA implementation
- How many work items to show in Beat 3 (3 or 4)
- Whether to show SubstackFeed excerpts as HTML or plain text

</decisions>

<specifics>
## Specific Ideas

- The homepage is the most important page — it's the first impression and sets the "person first" tone
- SubstackFeed component already handles RSS fetching at build time — just import and configure the count
- Work items: filter work.ts to featured items, limit to 3-4 for the homepage
- Ground Level subscribe CTA: simple link to Substack subscribe page, not an embedded form
- Voice rules apply to all new copy (contractions, no em dashes, no corporate language)

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/SubstackFeed.astro`: Fetches RSS at build time, renders post cards with title, date, excerpt, and link
- `src/components/WorkCard.astro`: Displays work items with title, description, category tag, optional link
- `src/data/work.ts`: 8 WorkItem entries (4 featured, 4 non-featured)
- `src/consts.ts`: SITE_TITLE, SUBSTACK_URL
- `src/components/Header.astro`, `Footer.astro`, `BaseHead.astro`: Shared layout components

### Established Patterns
- Pages are self-contained Astro files (no layout wrapper)
- Alternating section backgrounds (bg-dark, bg-light, bg-medium)
- Scoped `<style>` blocks per page
- Max-width containers (800px text, 1100px wide)
- WorkCard designed for dark backgrounds

### Integration Points
- SubstackFeed accepts a `count` prop or similar to control number of posts displayed
- Homepage needs both SubstackFeed and WorkCard imports
- Ground Level page primarily needs SubstackFeed with higher count
- Homepage hero needs a photo — /meredith-headshot.jpg exists in /public/

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-rss-dependent-pages*
*Context gathered: 2026-03-01*
