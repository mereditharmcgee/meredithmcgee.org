# meredithmcgee.org Rebuild

## What This Is

A rebuild of Meredith McGee's personal website (meredithmcgee.org). The site should feel like a person, not a brand. It's the home base for someone who is deeply curious about systems, follows that curiosity across disciplines, and uses research and writing to figure out whether things are working the way they should. Built with Astro, deployed to GitHub Pages.

## Core Value

The site makes visitors think "this person is interesting, I want to keep reading." Person first, work second, trust the reader.

## Requirements

### Validated

- ✓ Astro SSG framework with file-based routing -- existing
- ✓ GitHub Pages deployment via GitHub Actions -- existing
- ✓ SEO (sitemap, RSS, Open Graph, canonical URLs) -- existing
- ✓ Mobile-responsive layout with hamburger nav -- existing
- ✓ Contact form via Formspree -- existing
- ✓ Content collections for blog and portfolio -- existing

### Active

- [ ] Restructure nav to: Home | About | Work | Ground Level | Contact
- [ ] Homepage with three beats: Intro (final copy), What I'm Working On (Substack RSS), Selected Work
- [ ] About page as essay-style narrative (final copy provided)
- [ ] Ground Level page as Substack bridge (RSS feed, subscribe CTA)
- [ ] Work page with curated highlights and placeholder entries
- [ ] Work Archive subpage for comprehensive listing
- [ ] Contact page simplified to warm, human, direct (email + social links)
- [ ] Elevate existing green/brown/warm color palette to feel more professional and cohesive
- [ ] Upgrade typography to be distinctive and warm (evolve current Playfair Display + Source Sans 3)
- [ ] Generous whitespace, breathing layout, good reading line-length
- [ ] Subtle animations and transitions
- [ ] Easter eggs: Ember click interaction, 2-3 small delights spread throughout
- [ ] Substack RSS integration for Ground Level posts (3 on homepage, 5-6 on dedicated page)
- [ ] Footer with LinkedIn and Substack social links
- [ ] Remove old structure: portfolio page, blog page, ThreeAudiences demo, "How I approach my work" cards

### Out of Scope

- Mobile app -- web only
- CMS or admin panel -- content managed via files
- User accounts or authentication -- static site
- Real-time features -- static generation only
- Blog functionality -- replaced by Ground Level (Substack)
- Portfolio detail pages -- replaced by Work page format

## Context

**Current state:** The site is an Astro blog starter template that's been customized into a professional portfolio. It has a homepage with hero, approach cards, featured work cards, an about preview, and a ThreeAudiences interactive demo. Pages include: index, about, work, portfolio, resume, contact, blog. The design uses dark olive greens, gold/cream text, Playfair Display and Source Sans 3 fonts.

**What's changing:** The site structure is being simplified and reoriented around Meredith as a person rather than as a professional. The "approach cards" and abstract methodology descriptions are being removed. The blog is being replaced by Ground Level (her Substack). The portfolio is being replaced by a curated Work page. The overall feel should shift from "consulting portfolio" to "interesting person's home base."

**Content status:**
- Homepage intro copy: FINAL (in WEBSITE-SPEC.md)
- About page copy: FINAL (provided by user)
- Work page content: TBD (placeholder structure for now)
- Contact page: Adapt existing, simplify
- Photos: Use existing assets, assess during implementation

**Reference sites:** hankgreen.com (primary), cnewton.org, joshwcomeau.com, shaleentitle.com, chelseahiggswise.com

**Voice rules:** No em dashes (AI tell). No bullet points in prose. Always use contractions. No empty hedging. No corporate buzzwords. Lead with concrete. Vary sentence length.

## Constraints

- **Framework**: Astro 5.x SSG -- existing investment, keep it
- **Hosting**: GitHub Pages via GitHub Actions -- existing CI/CD
- **Design evolution**: Elevate existing green/brown/warm palette, don't replace it. Keep Playfair Display + Source Sans 3 family but refine
- **Content**: Some pages need placeholder content (Work) until final content is provided
- **Copy rules**: Strict voice guide (no em dashes, no bullet points in prose, etc.)
- **Anti-patterns**: No service cards, no pillar frameworks, no abstract methodology, no generic professional site feel, no purple gradients

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Keep Astro SSG | Existing framework, works well for static site | -- Pending |
| Evolve palette, don't replace | User likes current greens/browns/warm, wants it elevated | -- Pending |
| Substack RSS for Ground Level | Keeps content on Substack, displays on site | -- Pending |
| LinkedIn + Substack as social links | Only platforms Meredith actively uses | -- Pending |
| Easter eggs included in v1 | User wants playful elements from the start | -- Pending |
| Email: meredith.ar.mcgee@gmail.com | Existing contact email | -- Pending |

---
*Last updated: 2026-02-28 after initialization*
