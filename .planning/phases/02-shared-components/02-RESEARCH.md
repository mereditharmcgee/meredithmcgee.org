# Phase 2: Shared Components — Research

**Phase:** 02-shared-components
**Researched:** 2026-02-28
**Purpose:** What a planner needs to know to make confident, correct decisions for this phase

---

## What This Phase Actually Is

Phase 2 builds four discrete deliverables that later phases import without reinventing:

1. **`SubstackFeed` component** — fetches Substack RSS at build time, renders N posts with title, date, excerpt, and link
2. **`WorkCard` component** — renders a single work item from a typed data object, with category label, title, description, and optional link
3. **`src/data/work.ts`** — the single source of truth for all work items, typed with a `featured` flag
4. **Footer simplification** — removes tagline, "Get in Touch" button, and location line; keeps name, subtitle, social links, email, copyright

The Header gets a light review pass (no structural changes expected).

Nothing in this phase touches page content. Pages in Phases 3 and 4 will import these components. The success criteria are: components work in isolation, `npm run build` succeeds, Substack RSS failure is graceful.

---

## Critical Technical Facts

### The Substack Feed URL

The working RSS feed URL is:

```
https://meredithwritespublichealth.substack.com/feed
```

The URL `https://meredithmcgee.substack.com/feed` redirects to a Substack profile page (HTML, not XML). Do not use it. The working URL is confirmed live as of 2026-02-28 and returns valid RSS 2.0 XML.

The feed currently has **3 posts**. For Ground Level (5-6 posts), the planner should note that only 3 are currently available — the component should render however many are available, up to the limit.

### RSS Feed Format

Confirmed RSS 2.0 (not Atom). Namespaces present:
- `xmlns:dc` — Dublin Core (dc:creator)
- `xmlns:content` — content module (content:encoded)
- `xmlns:atom` — atom self-link
- `xmlns:itunes`, `xmlns:googleplay` — podcast metadata (ignore)

**Fields available per `<item>`:**
- `<title>` — CDATA-wrapped plain text. Example: `What Two Cannabis Studies Tell Us Together That Neither Says Alone`
- `<description>` — CDATA-wrapped excerpt/subtitle. One or two sentences. This is the clean excerpt. Example: `One study found doubled psychiatric risk. The other confirmed youth use is falling. Together, they raise a harder question about the legal cannabis market.`
- `<link>` — Full HTTPS URL to the post on Substack
- `<pubDate>` — RFC 2822 date string. Example: `Wed, 25 Feb 2026 13:25:56 GMT`
- `<guid>` — Same as link
- `<dc:creator>` — Author name (`Meredith McGee`)
- `<enclosure>` — Image URL (optional, do not use — decisions specify text-only display)
- `<content:encoded>` — Full HTML body of the post (large, do not use)

**The `<description>` field is the right field for excerpts.** It is short, clean, and does not contain HTML tags — just the post's subtitle/teaser. Do not parse `<content:encoded>`.

### XML Parser: fast-xml-parser

`fast-xml-parser` version **5.3.3** is already installed in `node_modules` as a transitive dependency of Astro. **It does not need to be added to `package.json`.** However, the planner should decide: import it directly (works but is not declared) or add it explicitly to `dependencies` for clarity.

Recommendation: add `fast-xml-parser` explicitly to `package.json` `dependencies`. This makes the dependency intentional, avoids relying on a transitive dep that could be dropped, and signals intent to future readers.

**fast-xml-parser v5 API (confirmed):**
```typescript
import { XMLParser } from 'fast-xml-parser';
const parser = new XMLParser({
  ignoreAttributes: false,
  cdataPropName: '__cdata',  // surfaces CDATA content
});
const result = parser.parse(xmlString);
// result.rss.channel.item → array of items (or single object if only 1 item)
```

Key gotcha: if the channel has only one `<item>`, fast-xml-parser returns an object, not an array. The planner must account for this — wrap in `Array.isArray` check or use `XMLParser` option `isArray: (name) => name === 'item'`.

### Astro Build-Time Fetch Pattern

Fetch in the component's frontmatter (the `---` block), not in a `<script>` tag. This runs at build time on the server, not in the browser. No CORS issues.

```astro
---
// SubstackFeed.astro
interface Props {
  limit?: number;
}
const { limit = 3 } = Astro.props;

let posts: SubstackPost[] = [];
try {
  const res = await fetch('https://meredithwritespublichealth.substack.com/feed');
  const xml = await res.text();
  // parse and slice
  posts = parseRSS(xml).slice(0, limit);
} catch (e) {
  // build proceeds; graceful fallback rendered below
}
---
```

The component renders the fallback when `posts.length === 0`.

### Date Formatting

`<pubDate>` format: `Wed, 25 Feb 2026 13:25:56 GMT` (RFC 2822). To convert to "February 25, 2026":

```typescript
new Date('Wed, 25 Feb 2026 13:25:56 GMT').toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})
// → "February 25, 2026"
```

The existing `FormattedDate.astro` component accepts a `Date` object and uses `en-us` locale with `month: 'short'` (produces "Feb 25, 2026"). The decisions call for "simple absolute date format" like "January 15, 2026" — use `month: 'long'` to match. Reusing `FormattedDate.astro` is possible but would require changing its locale option, which might affect other usages. Safest approach: format the date inline in `SubstackFeed.astro` using `toLocaleDateString` directly, keeping `FormattedDate.astro` unchanged for any legacy uses.

---

## Component Architecture Decisions

### SubstackFeed.astro

**Props:**
```typescript
interface Props {
  limit?: number;  // default 3 for homepage, 6 for Ground Level
}
```

**Fetch location:** Component frontmatter (build-time). The fetch logic lives in the component, not in the consuming page. This keeps Ground Level and the homepage from duplicating the fetch.

**Data shape to pass internally:**
```typescript
interface SubstackPost {
  title: string;
  excerpt: string;
  url: string;
  date: Date;
}
```

**Fallback when fetch fails:** Render a single paragraph: "Read the latest on [Substack](URL)." The fallback uses a direct link to the Substack publication, not the post list. Build must succeed.

**Excerpt length:** Claude's discretion per context. The `<description>` field from the feed is already the right length (1-2 sentences). Use it as-is.

**Link behavior:** Opens in new tab (`target="_blank" rel="noopener noreferrer"`).

### WorkCard.astro

**Props:**
```typescript
interface Props {
  title: string;
  description: string;
  category: string;
  link?: string;
}
```

Or accept a full `WorkItem` object. Either works; accepting the spread props is more idiomatic for Astro.

**Visual structure:**
```
CATEGORY          ← uppercase plain text label, small, muted
Title             ← prominent heading
Description       ← body text below title
[Read more →]     ← only if link exists; Claude's discretion on label
```

**Card style:** Minimal flat. Subtle border or divider (not a shadow or elevation). Matches the existing design system. On the dark background pages: `rgba(212, 201, 142, 0.1)` border is the established pattern.

**Link presentation:** If `link` is present, make the title or a distinct "Read more" text clickable — not a `.btn` (that's too prominent for a card element). A plain styled link or an arrow link is appropriate.

### src/data/work.ts

**Shape:**
```typescript
export interface WorkItem {
  title: string;
  description: string;
  category: string;
  link?: string;
  featured: boolean;
}

export const work: WorkItem[] = [
  // entries here
];
```

**Categories** (Claude picks from these for placeholder data):
- `RESEARCH`
- `GRANTS`
- `WRITING`
- `EVALUATION`
- `POLICY`

**Featured flag:** `featured: true` entries appear on the homepage "Selected Work" section (3-4 items). All entries appear on the Work page. The Work Archive page uses the same array.

**Placeholder guidance:** Use real descriptive text referencing the organizations in the current `index.astro` (Yale School of Public Health, Parabola Center, Bradbury-Sullivan LGBT Community Center) as starting points. At minimum 6-8 total entries, 3-4 with `featured: true`. Per WORK-03, placeholder entries are expected until final content arrives.

---

## What the Footer Needs

Current Footer has these elements:

| Element | Action |
|---------|--------|
| `<h3>Meredith McGee, MPH</h3>` | Keep, but drop "MPH" → `Meredith McGee` |
| `.footer-tagline` — "Connecting community needs..." | Remove |
| `<a href="/contact" class="btn">Get in Touch!</a>` | Remove |
| `.footer-email` — `meredith.ar.mcgee@gmail.com` | Keep |
| `.footer-social` — LinkedIn + Substack SVGs | Keep |
| `.footer-location` — "Boston, Massachusetts" | Remove |
| `.footer-bottom` — copyright | Keep, drop "MPH" → `Meredith McGee` |
| `.footer-subtitle` — "Public health writer, evaluator, and researcher" | Keep |

The footer layout should simplify: the two-column structure (info left, contact right) can collapse to a single centered or left-aligned layout since there's less content. Claude's discretion on layout.

---

## Header Review Notes

The current `Header.astro` is already correct from Phase 1:
- 5-item nav: Home, About, Work, Ground Level, Contact
- Fixed position with backdrop blur
- Mobile hamburger menu
- Active state underline on current page

The review pass should check:
- Hover transition smoothness (already uses `0.3s ease` — fine)
- Spacing feels balanced at all screen widths (current `gap: 1.5rem` on nav links — reasonable)
- Logo image path `/logo-m.png?v=3` still resolves (check `public/` directory)

No structural changes expected. If anything looks rough on inspection, fix it. Otherwise, mark as passed.

---

## Established Patterns to Follow

All patterns are from existing codebase analysis:

**File locations:**
- Components: `src/components/ComponentName.astro` (PascalCase)
- Data: `src/data/work.ts` (new directory, camelCase filename)
- No path aliases — use relative imports (`../data/work`)

**Astro component structure order:**
1. Frontmatter (`---` block with imports and logic)
2. HTML template
3. `<style>` block (scoped)
4. `<script>` block if needed (none expected for these components)

**CSS:**
- All colors via CSS custom properties (`--color-dark`, `--color-gold`, `--color-cream`, etc.)
- Mobile-first responsive with `@media (max-width: 768px)`
- Fluid typography with `clamp()`
- No inline styles

**TypeScript:**
- Strict mode (tsconfig extends `astro/tsconfigs/strict`)
- `interface Props` declared in frontmatter for component props
- Exported interfaces in `.ts` files when shared across files

---

## Risk Flags for Planning

### Risk 1: fast-xml-parser CDATA handling

CDATA-wrapped fields (`<![CDATA[...]]>`) require a parser option to surface correctly. With `fast-xml-parser`, the option is `cdataPropName: '__cdata'` — this puts the CDATA string into a `.__cdata` property. Alternatively, use `allowBooleanAttributes: true` and handle CDATA manually. Test the parsing logic before building the full component.

**Mitigation:** Write a small test parse in the component's frontmatter before building the template. Confirm `title`, `description`, `link`, `pubDate` all extract correctly.

### Risk 2: Single-item array normalization

If the Substack feed ever has only one `<item>`, fast-xml-parser returns an object, not an array, for `channel.item`. The component must normalize this:

```typescript
const rawItems = result.rss?.channel?.item;
const items = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [];
```

### Risk 3: Feed URL is the old publication name

The working feed URL (`meredithwritespublichealth.substack.com`) uses the old publication slug. This is the correct, live URL. The MEMORY.md has `meredithmcgee.substack.com` as the "Substack URL" — that URL does not return RSS. When hardcoding the feed URL, use the confirmed working URL and note this discrepancy.

Consider putting the feed URL in `src/consts.ts` alongside `SITE_TITLE` and `SITE_DESCRIPTION` for single-source maintenance:

```typescript
export const SUBSTACK_FEED_URL = 'https://meredithwritespublichealth.substack.com/feed';
export const SUBSTACK_URL = 'https://meredithmcgee.substack.com';
```

### Risk 4: src/data/ directory does not exist

The `src/data/` directory needs to be created. This is not a complication — Astro has no restriction on this — but the planner should note that `work.ts` will be the first file there.

### Risk 5: GitHub Actions network access for RSS fetch

Per the STATE.md research flag, build-time RSS fetch in GitHub Actions may be subject to network restrictions. The try/catch fallback mitigates this — if the fetch fails, the build still succeeds. However, if this becomes persistent, the user should consider a scheduled rebuild approach (AUTO-01 is a v2 requirement) or caching the last-fetched data.

**For Phase 2:** The try/catch fallback is sufficient. Document this as a known condition.

---

## What Phase 2 Does NOT Touch

- Page content (homepage, Ground Level, Work, About, Contact — all Phase 3/4)
- Design system tokens (Phase 5)
- Animations (Phase 5)
- SEO tags (Phase 5)
- Easter eggs (Phase 6)
- Formspree contact form (Phase 3)

---

## What the Planner Needs to Decide

These are open questions the PLAN document must resolve:

1. **Should `fast-xml-parser` be added explicitly to `package.json`?** Recommendation: yes, add it explicitly.
2. **How many plans (sub-tasks) should this phase use?** Suggested split: Plan 02-01 (SubstackFeed + data layer), Plan 02-02 (WorkCard + Footer + Header review). Or do it in a single plan if scope feels manageable.
3. **Should the Substack feed URL go into `src/consts.ts`?** Recommendation: yes.
4. **What placeholder work items to include in `work.ts`?** At minimum: one RESEARCH entry (Yale/Parabola), one GRANTS entry (Bradbury-Sullivan), one EVALUATION entry, one WRITING entry — all with `featured: true` on 3-4 of them.
5. **Footer layout after simplification:** Does the two-column layout collapse? With fewer elements, a single-column centered layout may read better. Claude decides during implementation.

---

## Summary: What to Build

| Deliverable | File | Key Decisions |
|---|---|---|
| SubstackFeed component | `src/components/SubstackFeed.astro` | Build-time fetch, try/catch fallback, limit prop, `<description>` for excerpt, `month: 'long'` date format |
| WorkCard component | `src/components/WorkCard.astro` | Flat minimal card, category as uppercase text label, optional link as plain styled link |
| Work data | `src/data/work.ts` | `WorkItem` interface, `featured` flag, 6-8 placeholder entries |
| Footer update | `src/components/Footer.astro` | Remove tagline/button/location, drop "MPH", simplified layout |
| Header review | `src/components/Header.astro` | Light inspection only; fix anything visually rough |

---

*Phase: 02-shared-components*
*Researched: 2026-02-28*
