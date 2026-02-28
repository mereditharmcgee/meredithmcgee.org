# Pitfalls Research

**Domain:** Personal website rebuild — professional portfolio to personality-driven personal site
**Researched:** 2026-02-28
**Confidence:** MEDIUM (training data + direct codebase analysis; web research unavailable)

---

## Critical Pitfalls

### Pitfall 1: Voice Drift Under Construction Pressure

**What goes wrong:**
The voice rules (no em dashes, no bullet points in prose, always use contractions, lead with concrete) get applied inconsistently when pages are built in separate phases. The About page ships with the right voice. Then the Ground Level page gets written in a rush and slips back into "distancing" professional prose. By launch, different pages feel like different people wrote them.

**Why it happens:**
Voice rules live in a spec doc but not in the files being edited. When building components or writing placeholder copy, it's easy to default to clean, formal phrasing that "sounds good" in isolation but violates the specific rules. The longer the rebuild takes, the more voice drift accumulates.

**How to avoid:**
Keep the five voice rules visible in every Astro file as a comment block at the top, or at minimum in the layout file. Before any copy lands in a `.astro` file, read it aloud. If it sounds like a LinkedIn bio, rewrite it. The test is: could someone mistake this for AI-generated corporate content? If yes, revise.

**Warning signs:**
Phrases like "I leverage," "cross-disciplinary," "at the intersection of," "through a lens of," or any em dash in the output HTML. Also watch for sentences that begin with "My work" three times in a row — that's a distancing pattern the voice rules are designed to prevent.

**Phase to address:**
Content and copy phase, before any page goes into review. Add voice-rule comment to `BaseHead.astro` or the main layout so it's unavoidable.

---

### Pitfall 2: Substack RSS CORS Failure at Build Time vs. Runtime

**What goes wrong:**
Substack RSS feeds (`https://substackpublicationname.substack.com/feed`) are fetched client-side or at build time in an Astro SSG context. Client-side fetching hits CORS restrictions — Substack doesn't set permissive CORS headers for arbitrary origins. Build-time fetching works locally but fails in GitHub Actions CI because network requests to external RSS feeds can be unreliable, rate-limited, or blocked in CI environments.

**Why it happens:**
The existing `rss.xml.js` in this project reads from local content collections — it's never fetched an external feed. The instinct is to `fetch()` the Substack feed in the component directly. That looks fine in dev (CORS is loosened locally) but breaks in production where the browser enforces it, or breaks in CI where the network call fails.

**How to avoid:**
Fetch the Substack RSS feed server-side at build time using Astro's `getStaticPaths` or a dedicated fetch in the page's frontmatter, not in a client-side script. Cache the result so a transient Substack outage doesn't break the build. Add a `try/catch` with a graceful fallback (show a "Read on Substack" link instead of post cards) so the build never fails due to an external dependency.

```astro
---
// Fetch at build time in the page frontmatter — never client-side
let posts = [];
try {
  const res = await fetch('https://[publication].substack.com/feed');
  const xml = await res.text();
  // parse with a lightweight XML parser
  posts = parseRSS(xml).slice(0, 3);
} catch (e) {
  // graceful degradation — site still builds
  posts = [];
}
---
```

**Warning signs:**
Any `fetch()` inside a `<script>` tag that hits the Substack URL. Or a build log that shows "Failed to fetch" errors that are swallowed silently. Or a component that renders empty on production but fine in dev.

**Phase to address:**
Ground Level page implementation phase. Design the data-fetching pattern before writing any component markup.

---

### Pitfall 3: Orphaned Routes After Removing Old Pages

**What goes wrong:**
The rebuild removes `/portfolio`, `/blog`, `/resume`, and the ThreeAudiences demo. But the old pages may have inbound links from GitHub, LinkedIn, Google's cache, or any previously shared URLs. Removing the routes without redirects creates hard 404s for real visitors. GitHub Pages doesn't support server-side redirects (no `.htaccess`, no Netlify `_redirects`), so the standard approach doesn't work here.

**Why it happens:**
Developers focus on the new pages and forget the old ones have a life outside the repo. The existing `rss.xml.js` publishes blog post URLs. If those are indexed or shared, they'll 404 after the blog is removed.

**How to avoid:**
For each removed route, create a thin Astro page at that path that either (a) renders a friendly "this moved" page with a link to the new location, or (b) uses a client-side meta refresh to redirect. The GitHub Pages approach for redirects is a static HTML page with `<meta http-equiv="refresh" content="0; url=/new-path">`. This isn't ideal but it works.

Keep these redirect pages permanently — they're cheap. Remove `/resume`, `/portfolio`, `/blog` and the blog post URLs from the sitemap so they stop being indexed, but keep the HTML files for human visitors.

**Warning signs:**
A `git rm` on `portfolio.astro`, `resume.astro`, or the `blog/` directory without a corresponding redirect page being added. Any `sitemap.xml` that still lists removed routes.

**Phase to address:**
Structural cleanup phase, before any new pages are added. Do the removals and redirects in one commit.

---

### Pitfall 4: "Interesting Person" Reads as "Unfocused Person"

**What goes wrong:**
The goal is "person first, work second." But removing the professional framing without replacing it with clear narrative throughlines results in a site that feels scattered. Visitors don't come away with a strong impression of who Meredith is — they come away with "she writes about a lot of things." The site becomes a list of interests instead of a portrait of a person.

**Why it happens:**
This is the hardest shift in portfolio-to-personal-site rebuilds. The portfolio era used category cards ("Grant Writing," "Research," "Evaluation") to organize everything. When you remove those frameworks, the connective tissue that made the work legible goes with them. The instinct is to add more content to compensate. That makes it worse.

**How to avoid:**
The homepage intro copy (already finalized) is the anchor. Every other page should reinforce the same core impression: someone who follows curiosity across disciplines and uses research and writing to understand whether things are working. The About page essay is the right vehicle for this. The Work page should be curated, not comprehensive — four or five things that illustrate range without looking random. Resist the urge to explain the range. Let the work speak.

**Warning signs:**
The About page reads like a resume in paragraph form. The Work page has more than eight entries. Any page that uses the word "versatile" or "across disciplines" without a specific example anchoring it. A homepage that tries to answer "what do you do" before it makes the visitor curious about who you are.

**Phase to address:**
Content finalization and copy review, before the Work page is built. The Work page architecture should be determined by what it's showcasing, not by what's easiest to build.

---

### Pitfall 5: Easter Eggs That Break Accessibility or Feel Like Noise

**What goes wrong:**
The Ember click interaction and other small delights either (a) rely on hover states that don't work on touch devices, (b) use animations that trigger motion sickness for users with vestibular disorders, (c) are so subtle nobody ever finds them, or (d) are so prominent they distract from the content. The existing ThreeAudiences demo has the right instinct but wrong placement — it's a floating button competing for attention with the page's actual content.

**Why it happens:**
Easter eggs are fun to build. They get built as standalone features without thinking about how they integrate into the reading experience. The "ember click" interaction in particular needs to know whether it fires on click, on hover, on scroll — and each choice has different implications for mobile and for accessibility.

**How to avoid:**
Design the easter egg interaction to be triggered by user intent (click), not ambient behavior (hover or scroll). Use CSS `@media (prefers-reduced-motion: reduce)` to disable or minimize animations for users who need it. On mobile, click events work the same as on desktop, so click-triggered interactions are safe. Test on iOS Safari and Android Chrome before considering any easter egg "done."

For discoverability: easter eggs shouldn't require instruction, but they also shouldn't be invisible. A subtle visual affordance (like a slightly unusual cursor on hover over a specific element) tells curious visitors that something's there without announcing it to everyone.

**Warning signs:**
Any JavaScript animation that uses `setInterval` without checking `prefers-reduced-motion`. Any interaction that only works on hover. An easter egg that only appears after multiple specific actions in sequence (nobody will find it).

**Phase to address:**
Easter eggs and polish phase, last. Don't build them until the core pages are solid. They're a reward for getting everything else right, not a substitute for it.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hardcoding Substack URL in component | No config setup needed | If publication URL ever changes, hunt through components | Only if there's one usage point; otherwise, put it in `consts.ts` |
| Placeholder copy that ships | Unblocks structure work | Placeholder copy has a way of becoming permanent — "good enough" takes root | Only if there's a documented date for final copy to arrive |
| Inline styles on one-off sections | Fast to write | Breaks the design system incrementally; global.css loses authority | Never — use a class, even if it's only used once |
| Keeping old CSS classes from portfolio era | No breakage risk | Dead CSS accumulates; future developers (you, in six months) can't tell what's safe to remove | Acceptable short-term, but schedule a cleanup pass |
| Skipping `alt` text on decorative images | Saves a few seconds | Screen reader noise; WCAG failure | Never for content images; `alt=""` is correct for purely decorative images |

---

## Integration Gotchas

Common mistakes when connecting to external services.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Substack RSS | Fetching client-side, hitting CORS | Fetch in Astro frontmatter (server/build time), parse XML, pass as props |
| Substack RSS | Assuming feed structure — some Substack feeds include `<enclosure>` tags, some don't | Treat all optional fields as optional; don't destructure without defaults |
| Formspree contact form | Not testing that the form still works after the page redesign breaks its DOM structure | Submit a test message from production after every deploy that touches the contact page |
| GitHub Pages | Using `_redirects` (Netlify syntax) — it won't work | Use static HTML pages with meta refresh for redirect behavior |
| GitHub Actions build | External fetch to Substack RSS fails in CI due to network restrictions | Wrap fetch in try/catch; provide fallback empty array; build should never hard-fail on external content |

---

## Performance Traps

Patterns that work at small scale but fail as usage grows. (For a personal site, "scale" means: works well on a slow mobile connection, not server load.)

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Unoptimized hero image | Visible layout shift; slow LCP on mobile | Use Astro's `<Image>` component with `format="webp"` and explicit `width`/`height` | First visit on 3G |
| Loading all Substack posts into DOM even when only 3 are shown | Unnecessary HTML weight | Slice the array before rendering, not after | At 20+ posts if you ever increase the limit |
| Botanical pattern overlay as a large raster PNG | High memory usage on mobile, visible as pattern tiles | Use SVG for the pattern or ensure the PNG is small and tiling is done via CSS `background-repeat` | Low-end Android devices |
| CSS animations on scroll without `will-change` | Janky animations, paint thrashing | Add `will-change: transform` to animated elements, or use `transform` and `opacity` only | Any device with a busy CPU |

---

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Nav shows too many pages — the old nav has 6 items | Cognitive load; visitors don't know where to start | New nav (Home, About, Work, Ground Level, Contact) is the right reduction; don't add back items "just in case" |
| Contact page is a form but the goal is a conversation | Formal feel; reduces actual contact | Email address + social links with warm copy; Formspree form is fine but it should feel like an invitation, not a form |
| Ground Level page just shows posts without context | Visitors don't know what they're looking at | Brief intro paragraph above the feed explaining what Ground Level is and why it exists, with a Substack subscribe CTA |
| Work page tries to be comprehensive | Exhausting to read; everything feels equal in importance | Curate ruthlessly; "Selected Work" is the right frame; let the archive subpage hold the rest |
| Page transitions that reset scroll position | Disorienting on mobile | Astro's default behavior handles this fine; don't override scroll behavior without testing |

---

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Ground Level page:** The feed is showing but the Substack subscribe CTA is missing or broken — verify the CTA link goes to the correct Substack URL, not a placeholder.
- [ ] **Contact page:** Email address is correct (`meredith.ar.mcgee@gmail.com`) — verify it's not still the old version or a `mailto:` that opens a form instead of email client.
- [ ] **Sitemap:** Old routes (`/portfolio`, `/resume`, `/blog`) have been removed from `sitemap.xml` — verify by building and checking `dist/sitemap-index.xml`.
- [ ] **RSS feed (`/rss.xml`):** Either updated to reflect the new site or removed if blog content is gone — a broken RSS feed is worse than no RSS feed.
- [ ] **Open Graph tags:** The new homepage intro copy is in the `<meta name="description">` and `og:description` — verify `BaseHead.astro` is using the new `SITE_DESCRIPTION` from `consts.ts`.
- [ ] **Mobile nav:** New nav items (Ground Level) render correctly in the mobile slide-out menu — the hamburger menu is custom JS, so new nav items don't automatically appear.
- [ ] **Footer:** LinkedIn and Substack social links are present, not placeholder `#` hrefs — check the actual URLs resolve.
- [ ] **Easter eggs:** The Ember click interaction works on touch (tap) on iOS Safari, not just on desktop click.
- [ ] **ThreeAudiences removal:** The component file is deleted AND the import is removed from `index.astro` — forgetting the import causes a build error.
- [ ] **Image references:** `hero-image.jpg` and other images referenced in the old `index.astro` are either present in `public/` or the references are removed — broken image references don't cause build failures in Astro but they create visible broken images.

---

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Voice drift across pages | LOW | Read every page copy aloud against the five rules; mark violations; rewrite in one sitting to maintain consistency |
| Substack RSS fails in CI | LOW | Remove the `fetch()` from the build step; show a static "Read on Substack" link with a button; add the dynamic RSS integration as a follow-up |
| Orphaned routes causing 404s | LOW | Add static redirect HTML pages at old paths; update sitemap; no rebuild required |
| "Unfocused person" impression | HIGH | Requires content rethinking, not just code changes; involves rewriting the About page or Work page; takes days not hours |
| Easter egg breaks accessibility | MEDIUM | Wrap in `prefers-reduced-motion` check; test on a real device; worst case, remove the interaction and replace with something simpler |
| ThreeAudiences import left in after component deleted | LOW | Build fails immediately; add the file back or remove the import; five-minute fix |

---

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Voice drift | Every phase that touches copy; establish voice-check habit in Phase 1 | Read each page aloud before marking phase complete |
| Substack RSS CORS | Ground Level implementation phase | Test the RSS fetch in a GitHub Actions dry run before merging |
| Orphaned routes | Structural cleanup phase (should be early) | Run `npm run build` and check `dist/` for old route HTML files that should no longer exist |
| "Interesting person" reads as unfocused | Content architecture phase (before Work page is built) | Visitor test: show the homepage to someone unfamiliar with the site and ask "who is this person?" |
| Easter egg accessibility | Polish phase (last) | Test on iOS Safari with VoiceOver; verify `prefers-reduced-motion` CSS rule exists |
| Broken images after removal | Cleanup phase | Run build and check browser console on each page for 404 errors |
| Dead CSS from portfolio era | Cleanup phase or final polish | Search for class names from removed components in `global.css` |

---

## Sources

- Direct codebase analysis of `/c/Users/mmcge/my-website` (current site structure, components, pages)
- Astro documentation patterns (build-time fetching, `<Image>` component, content collections) — MEDIUM confidence based on training knowledge; verify against Astro 5.x docs
- GitHub Pages limitations (no server-side redirects) — HIGH confidence, well-documented constraint
- Substack RSS CORS behavior — MEDIUM confidence; behavior observed consistently but Substack may change feed headers
- `prefers-reduced-motion` CSS media query — HIGH confidence; W3C spec, widely supported
- Voice rules sourced directly from `PROJECT.md` and `CLAUDE.md`

---
*Pitfalls research for: personal website rebuild (portfolio to personality-driven site)*
*Researched: 2026-02-28*
