# Feature Landscape

**Domain:** Personality-driven personal website (writer, researcher, curious person)
**Project:** meredithmcgee.org rebuild
**Researched:** 2026-02-28
**Research mode:** Ecosystem — features dimension only

## Research Notes

Web search and WebFetch were unavailable during this research session. Findings draw from:
- Project specification (PROJECT.md, WEBSITE-SPEC.md references)
- Training knowledge of the named reference sites (hankgreen.com, joshwcomeau.com, cnewton.org, shaleentitle.com, chelseahiggswise.com) — confidence flagged per finding
- General knowledge of the personality-driven personal site genre

Where confidence is MEDIUM or LOW, a note explains why.

---

## Table Stakes

Features visitors expect. Missing = site feels incomplete or unprofessional.

| Feature | Why Expected | Complexity | Confidence | Notes |
|---------|--------------|------------|------------|-------|
| Clear "who is this person" on the homepage | Visitors arrive with zero context; 5-second test — they need to understand what you do and why it matters before they'll scroll | Low | HIGH | The intro block is the single most important piece of real estate. Personality sites fail here when they open with credentials instead of a person. |
| About page that reads like writing, not a CV | Visitors who want to know more will go here; a bullet-point bio signals "I'm a brand, not a person" | Low | HIGH | Must be prose, first-person, and reveal something genuine. Meredith's about page copy is already written in this style. |
| Consistent, navigable site structure | Visitors scan the nav to understand the site's shape; confusion = exit | Low | HIGH | Fewer nav items is better. The planned 5-item nav (Home, About, Work, Ground Level, Contact) is appropriate. |
| A way to follow / stay connected | Personality sites succeed when they build an audience over time; visitors who like you need a next step | Low | HIGH | For Meredith this is Substack subscribe + LinkedIn. No newsletter signup form needed if Substack handles it. |
| Mobile-responsive layout | Majority of visitors will be on phones, especially if arriving from Substack or LinkedIn links | Low | HIGH | Already exists in current codebase. Must be verified after redesign. |
| Contact path | Visitors who want to hire, collaborate, or reach out need a clear route | Low | HIGH | Email + LinkedIn is sufficient. Does not need a form if the current Formspree form adds friction. |
| RSS / syndication | Writers and researchers expect this; it's how their audience segments follow | Low | MEDIUM | Already exists. Ground Level via Substack RSS satisfies this — don't build a second RSS feed. |
| Basic SEO (Open Graph, canonical, sitemap) | Search and social sharing; visitors arriving from shared links need correct previews | Low | HIGH | Already exists. Must verify OG images look right after redesign since visual identity is changing. |
| Typography that is readable and distinctive | Reading comfort is table stakes for a writing-forward site; bad type undermines trust in the words | Low | HIGH | Playfair Display + Source Sans 3 is a strong foundation. The work is in refinement: sizes, weights, spacing, line-length control. |
| Fast load time | Slow sites lose visitors before the content lands; especially important when visitors are making a "is this person worth my time?" judgment | Low | HIGH | Astro SSG with no client-side JS by default is an advantage here. Risk area: Substack RSS fetch, any animation libraries. |

---

## Differentiators

Features that make a personality-driven site memorable. Visitors don't expect these, but they're what people share and return for.

| Feature | Value Proposition | Complexity | Confidence | Notes |
|---------|-------------------|------------|------------|-------|
| A voice-consistent intro that surprises | The opening line of the homepage is the entire pitch. Sites that open with something unexpected ("I think about why things don't work") get shared; sites that open with credentials do not. | Low | HIGH | Meredith's intro copy is reportedly final. The design's job is to give it room to land — generous whitespace, nothing competing for attention. |
| Substack integration as a living signal | Static personal sites feel abandoned; showing recent Ground Level posts signals that someone is actually here and thinking | Medium | HIGH | The planned approach (RSS feed, 3 on homepage, 5-6 on dedicated page) is correct. The risk is RSS latency or Substack API changes. |
| Easter eggs and micro-delights | joshwcomeau.com is the canonical example — click interactions, hidden messages, animated cursors — these are what people tell friends about. Makes the site feel like it was made by a person, not a template. | Medium | MEDIUM | Planned: Ember click interaction + 2-3 additional delights. The key is that they should feel like Meredith, not like generic "web magic." Avoid: particle effects, confetti, things that feel like a developer showing off rather than a person being playful. |
| Warm, specific color and typographic identity | Most personal sites use either (a) all-white minimalism or (b) generic dark mode. A site with a genuine color personality is memorable. | Low | HIGH | The existing green/brown/warm palette is an asset. The rebuild's job is elevation, not replacement. Executed well, this becomes a recognizable visual identity. |
| Curated work presentation instead of an archive | Portfolios that show everything communicate "I'll work for anyone." A short, editorial Work page communicates taste and standards — which is more persuasive for the kind of work Meredith does. | Low | HIGH | Planned: curated highlights + separate Work Archive for comprehensiveness. The editorial curation is the differentiator; the archive satisfies the "show everything" need without polluting the primary narrative. |
| Writing that treats the reader as smart | Many personal sites over-explain. Sites in Meredith's genre that assume reader intelligence (hankgreen.com, cnewton.org tone) build faster trust with the right audience. | Low | HIGH | This is a content/voice feature, not a technical one. The planned voice rules (no em dashes, no hedging, lead with concrete) are exactly right. |
| Subtle animations that feel intentional | A site that animates thoughtfully (fade-in on scroll, smooth transitions) signals craft without performative complexity | Medium | MEDIUM | Risk: animation libraries add weight and can feel generic. Recommendation: CSS-only transitions where possible, reserve JS for Easter egg interactions only. |
| "Now" or "currently" signal on homepage | hankgreen.com uses a "What I'm Working On" section that makes the site feel alive and current. For Meredith, this is the Substack RSS block. | Low | HIGH | Already planned. The key design decision: this section should look editorial, not like a widget. Titles, dates, and an excerpt are more compelling than just headlines. |
| Photo that feels like a person, not a headshot | Sites that use a candid or semi-candid photo (at work, in context, doing something) feel more human than sites with a professional headshot on a plain background | Low | MEDIUM | "Use existing assets, assess during implementation" per PROJECT.md. This is worth treating as a real decision — the photo selection has outsized impact on the "person vs. brand" feel. |

---

## Anti-Features

Features to deliberately NOT build. Each one signals "brand" or "professional portfolio" rather than "person."

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| "How I Work" or methodology cards | Abstract process descriptions signal consulting services, not a person. They answer a question the reader didn't ask. | Let the work samples and writing demonstrate approach implicitly. |
| Service offerings or rates | Transforms a personal site into a business card; changes the visitor relationship from "interesting person" to "vendor" | If someone wants to hire Meredith, the Contact page handles it — no service menu needed. |
| Skills lists or competency grids | Looks like a resume section; visitors who care about skills can see the CV if needed | Show, don't list. The Work page demonstrates skills through examples. |
| Multiple CTAs competing on the homepage | "Download my CV" + "Subscribe to my newsletter" + "View my work" + "Contact me" = decision paralysis. Dilutes the primary message. | One clear next step per section. Homepage: Substack subscribe. Work section: Work page link. |
| Blog with internal publishing | Adds technical overhead (drafts, publishing workflow, tagging, pagination) and splits attention between Substack and site | Ground Level on Substack is the writing home. The site just surfaces it via RSS. |
| Social media feed embeds (Twitter/X, Instagram) | Slow to load, fragile (API terms change), clutters the layout, can surface unflattering out-of-context content | Link to profiles in footer/contact. Let visitors choose to visit those platforms. |
| Case study deep-dives with metrics | "Increased engagement by 47%" framing is consulting portfolio language | Use short narrative descriptions that explain what was interesting about the work and why it mattered. |
| Generic placeholder "Coming Soon" sections | Signals incompleteness and abandonment; visitors lose confidence in the whole site | Either ship real content or omit the section entirely. Work page with placeholder structure is fine if it has real text, not "TBD." |
| Dark mode toggle | Adds complexity, splits design attention, and usually results in a weaker experience in one of the two modes | Commit to one palette and do it exceptionally well. The warm green/brown palette works as a single-mode design. |
| Resume as a downloadable PDF linked prominently | Appropriate for a job-seeking portfolio; wrong signal for an established professional's home base | Resume can exist but should not be in the primary nav. If needed, link from Work page or Contact. |
| Pop-up newsletter signup | Universally disliked; the subscribe CTA in Ground Level page and homepage section is sufficient | Inline CTA that respects the reader's attention. |
| Testimonials or logos section | "As seen in" / "Clients include" signals are appropriate for agency sites, not personal ones | Let the work and writing speak. Trust is built through reading, not social proof widgets. |

---

## Feature Dependencies

Dependencies determine build order. Features earlier in the chain must be done first.

```
Design system (colors, type, spacing tokens)
  → All pages (every page inherits the system)
  → Animation/transition layer (must layer on top of stable styles)
  → Easter eggs (depend on stable DOM structure and interaction model)

Homepage structure
  → Substack RSS block (the "What I'm Working On" section is part of homepage)
  → Substack RSS fetch → Ground Level page (shares the fetch implementation)

Nav structure
  → All page templates (nav is a shared component)

About page copy (already written)
  → About page layout (layout just needs to present the copy well)

Work page curated highlights (copy TBD)
  → Work Archive subpage (archive is the overflow of the curated set)

Contact page
  → No dependencies (can be built independently)

Footer (LinkedIn + Substack links)
  → No dependencies; should be one of the first shared components built
```

---

## MVP Recommendation

The site needs to feel complete and human before it goes live. These are non-negotiable for launch:

**Must ship:**
1. Design system elevation (colors, type, spacing) — everything inherits from this
2. Homepage with three beats (Intro, What I'm Working On via RSS, Selected Work)
3. About page as prose narrative
4. Ground Level page (Substack RSS + subscribe CTA)
5. Work page (curated, even if some entries are placeholders with real text)
6. Contact page (warm, simple, email + LinkedIn)
7. Footer with social links
8. Mobile-responsive verification across all pages
9. At least one Easter egg (Ember click interaction)

**Defer without guilt:**
- Work Archive subpage: build after Work page content is finalized so the archive actually has something to hold
- Additional Easter eggs (2 and 3): add after core pages are stable
- Photo audit: can happen during implementation but shouldn't block launch
- Dark mode: explicitly anti-feature, never build

---

## Reference Site Observations

Confidence levels for reference site observations are MEDIUM (based on training knowledge, not live site visits — WebFetch was unavailable).

**hankgreen.com (primary reference):**
- Opens with a brief human intro, not a credentials list
- "What I'm Working On" section functions as a living signal — changes when life changes
- Minimal nav, no services section
- Links out to projects rather than bringing everything in-house
- Warm but not precious; approachable without being casual

**joshwcomeau.com:**
- Highly interactive: cursor effects, animated Easter eggs, micro-interactions on hover
- CSS-in-JS heavy — makes every element feel considered
- Homepage has a "latest articles" section that functions like a Substack RSS approach would
- Color palette is consistent and distinctive (coral/dark on light)
- The interactive complexity is appropriate for a developer educator; for a writer/researcher, a lighter touch is correct

**cnewton.org:**
- Writer-focused; minimal structure
- Long-form about section that reads as essay
- No portfolio grid or service cards

**shaleentitle.com / chelseahiggswise.com:**
- Advocacy + writing context; personal but purposeful
- Mission-clear homepage copy
- Social links and newsletter CTA without overwhelming

**Common pattern across all five:** None of them have a services section, competency grid, or case study structure with metrics. All of them use minimal nav. All of them have some form of "what I'm putting into the world right now."

---

## Sources

- PROJECT.md (project specification, constraints, decisions) — HIGH confidence (primary source)
- Training knowledge of hankgreen.com, joshwcomeau.com, cnewton.org, shaleentitle.com, chelseahiggswise.com — MEDIUM confidence (training data, not verified against live sites in this session)
- General knowledge of personal website design patterns, personality-driven site genre — LOW-MEDIUM confidence (training data only)
- Note: WebSearch and WebFetch were unavailable during this research session. The reference site observations are based on training knowledge and should be verified against live sites during implementation.
