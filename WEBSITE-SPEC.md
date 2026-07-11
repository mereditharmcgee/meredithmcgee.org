# meredithmcgee.org Rebuild Spec

## Project Overview

A complete rebuild of meredithmcgee.org, Meredith McGee's personal website. The site should feel like a person, not a brand. It's the home base for someone who is deeply curious about systems, follows that curiosity across disciplines, and uses research and writing to figure out whether things are working the way they should.

**Live site:** https://meredithmcgee.org/
**Repo:** https://github.com/mereditharmcgee/meredithmcgee.org
**Framework:** Astro (blog starter template)
**Hosting:** GitHub Pages
**Substack:** https://meredithwritespublichealth.substack.com/ (Ground Level)

## Design Direction

### Reference Sites (in order of influence)

1. **hankgreen.com** - The primary reference. Clean, personal, browsable. "Make things, learn stuff" energy. The site feels fun to be on. Has hidden depth (pelican Easter egg leads to a whole other side of the site). The homepage leads with the person, not credentials.

2. **cnewton.org** - Clean, personal, modern. Casey Newton's site leads with who he is, foregrounds his two main projects (Platformer, Hard Fork), ends his bio with "I live in San Francisco with my boyfriend." Simple nav, good use of space.

3. **joshwcomeau.com** - The whimsy and delight reference. Easter eggs spread throughout, illustrated avatar, the site itself has personality baked into the design. Warm, playful, but also serious and substantive.

4. **shaleentitle.com** - One beautifully written narrative paragraph that lets credentials accumulate naturally. Minimal structure, maximum impact.

5. **chelseahiggswise.com** - Leads with who she is and what she's about. Person first, services second.

### Vibe

- Clean, warm, grounded, but with moments of playfulness and surprise
- More substance than Hank Green's site, but the same structural philosophy: person first, work second, trust the reader
- "Fun of browsing the internet" energy. Curious and warm but scientific and grounded
- NOT a consulting site, NOT a portfolio-first site, NOT corporate, NOT overly minimal/stark
- Should feel like: "this person is interesting, I want to keep reading"

### Aesthetic Guidelines

- Typography should be distinctive and warm. No generic sans-serifs (no Inter, Roboto, Arial). Find something with character that feels approachable and smart. Think editorial but not stuffy
- Color palette should be warm and grounded. Not the standard blue/white professional site. Think about colors that feel like: curious, warm, a little unexpected
- Layout should breathe. Generous whitespace. Not cramped or over-structured
- Subtle animations/transitions welcome. Nothing flashy, but the site should feel alive
- Mobile-first, responsive. Should look great on a phone

### Critical Anti-patterns

- No em dashes anywhere in copy (they are an AI tell)
- No generic "professional website" feel
- No service cards or pillar frameworks
- No abstract methodology descriptions
- No bullet points in prose sections
- No corporate stock photography
- Avoid purple gradients, generic card layouts, cookie-cutter portfolio grids

## Site Structure

### Navigation

Five items: **Home | About | Work | Ground Level | Contact**

### Page 1: Homepage

**Purpose:** Single scrollable page that introduces Meredith as a person, shows what she's currently working on, and highlights selected work.

**Structure (three beats):**

**Beat 1: The Intro**
- Meredith's name (no "MPH" in the main display, though it can appear elsewhere)
- Hero photo
- The intro copy (FINAL, included below)
- This is what people see first. No abstract tagline above it. Just her

**Beat 2: What I'm Working On Right Now**
- Ground Level: display the 3 most recent Substack posts (title, date, first line or two, link out to Substack)
- This section is the "living" part of the site, gives people a reason to come back
- Reference: how Casey Newton foregrounds Platformer and Hard Fork on his homepage

**Beat 3: Selected Work**
- 3-4 highlighted pieces that show range
- Each gets a title, short description, and link
- NOT organized by abstract pillars. Organized by actual pieces of work
- "See more" link to the full Work page
- Content for this section: TBD (will be provided separately)

**Footer:**
- Contact info, social links, email
- Easter egg trigger lives somewhere in or near the footer (see Easter Egg section below)

**FINAL Homepage Intro Copy:**

"I'm Meredith. I'm deeply curious about systems and what happens when they fall short. That curiosity has taken me a lot of places: reviving LGBTQ+ programming and building the first gender-inclusive housing at my college, writing grants that have funded over a million dollars in health equity and community programs, researching LGBTQ+ mental health at Yale, studying how people actually experience legal cannabis markets, and occasionally building weird things on the internet. The thread that connects all of it is trying to make public health make sense to the people it's supposed to serve. Right now I'm in Boston, publishing Ground Level (a Substack about cannabis, public health, and the gap between policy and practice), doing research at Parabola Center for Law and Policy, and writing grants at Bradbury-Sullivan LGBT Community Center. I live with my partner K and a black lab named Ember who is scientifically proven to reduce my stress."

### Page 2: About

**Purpose:** The full narrative story. One continuous, essay-style page. No section headers like "How I Work" or "What Guides My Work." Just the story of how Meredith got here, told in her voice.

**Structure:**
- Full narrative essay (FINAL copy will be provided separately, currently drafted and in revision)
- Photos interspersed where they support the story (Lafayette, Yale, Bradbury-Sullivan logos or campus photos, Ember, etc.)
- Arc: Rochester > Lafayette > Yale > Bradbury-Sullivan > Boston/Parabola/Ground Level > who she is now
- Ends with the personal/warm closing (K, Ember, cooking, reading, outdoors)

**Design notes:**
- This page should feel like reading a personal essay, not scanning a profile
- Good line length for readability (not full-width text)
- Generous spacing between paragraphs
- Photos should feel natural, not like headshot grids

### Page 3: Work

**Purpose:** Shows actual things Meredith has made. Replaces both the old "My Work" and "Portfolio" pages.

**Structure:**
- Primary view: curated highlights organized by actual pieces of work (not by abstract categories like "Grant Writing" or "Evaluation")
- Each piece gets: title, short description of what it is and what it did, link or download if available
- Tags or subtle category indicators (research, grants, published writing, projects) for filtering, but the primary experience is scrolling through real work
- At the bottom: link to a full archive/portfolio page that's more comprehensive (for Meredith's own record-keeping and for anyone who wants to dig deeper)

**Content to include (details TBD):**
- Published op-eds and writing
- Major grants with outcomes
- Senate Finance Committee analysis
- Cannabis policy research
- The Commons (as a project)
- Communications case study (reworked from the current Anthropic Easter egg, reframed for a general audience)
- Ground Level / Substack highlights

**The Archive subpage:**
- Linked from bottom of Work page, not in main nav
- More comprehensive listing of everything
- Can be simpler in design, more utilitarian
- Serves as Meredith's personal record of work

### Page 4: Ground Level

**Purpose:** Bridge page that keeps visitors on the site before sending them to Substack.

**Structure:**
- Brief description of what Ground Level is
- Substack subscribe CTA
- Recent posts: title, date, first line or two, link out to Substack for full read
- Potentially display more posts here than on the homepage (5-6 vs. 3)

**Copy direction:** "Ground Level is my Substack about cannabis, public health, and the gap between policy and practice." Keep it short. The posts speak for themselves.

### Page 5: Contact

**Purpose:** Simple, human, warm.

**Structure:**
- Email address
- Social links (LinkedIn, Bluesky, whatever she uses)
- A line or two that makes it feel human, not a form
- Copy direction: something like "I'm always interested in hearing from people working on [topics]. Reach out." (TBD, will be provided)

## Easter Eggs

### Philosophy
Easter eggs should be integrated across the entire site, not confined to one hidden page. Think Josh Comeau's approach: small delights spread throughout that reward curious visitors. The overall effect should feel like the fun of browsing the early internet, where clicking around might reveal something unexpected.

### Guiding Principles
- Personal, not professional. These aren't portfolio pieces, they're gifts for curious people
- Fun and creative, grounded in who Meredith is
- Should make someone smile, not demonstrate a skill
- Integrated throughout, not siloed

### Ideas (to be refined and implemented)
- Clicking Ember's name anywhere on the site could trigger a photo popup or small animation
- Small interactive moments scattered throughout (hover states, click reveals, subtle animations)
- A hidden page or mode that shows a different side of the site (reference: Hank Green's pelican)
- Connections to Meredith's interests: public health, curiosity, dogs, the "gap between how things work and how they should"
- NOT AI or Commons related
- Details to be determined during implementation. Start with 2-3 small ones and the Ember interaction

## Technical Notes

### Astro Setup
- Current repo is an Astro blog starter template
- Deploys to GitHub Pages via GitHub Actions
- Source code in /src with components, content, layouts, pages
- Static assets in /public

### Substack Integration
- Ground Level RSS feed can likely be fetched and displayed
- URL: https://meredithwritespublichealth.substack.com/
- Need to pull: post title, date, excerpt/first lines, link to full post
- Display on both Homepage (3 most recent) and Ground Level page (5-6 most recent)

### Images
- Current site has: hero-image.jpg, meredith-headshot.jpg, family-photo.jpg, various logos
- Will need to assess which photos to keep, which to replace
- Ember photo needed for Easter egg interactions
- Meredith should provide updated photos if available

### Performance
- Keep Astro's static site generation benefits
- Optimize images
- Target 90+ Lighthouse scores across the board

## Voice and Copy Rules

All copy on the site must follow these rules (from Meredith's voice guide):
- No em dashes (hard rule, they are an AI tell)
- No bullet points in published prose
- Contractions always ("I'm," "wasn't," "don't")
- No empty hedging ("it's important to note," "arguably")
- No "unpack," "landscape," "stakeholders," "holistic," "robust," "leverage," "delve," "synergy"
- No "in conclusion" or summary paragraphs
- Lead with concrete, not thesis
- Vary sentence length: mix long complex sentences with short declarative ones
- Questions are never rhetorical filler
- Opinions stated as opinions

## Implementation Order

1. Set up the new site structure and nav (Home, About, Work, Ground Level, Contact)
2. Build the Homepage with final intro copy and placeholder sections for Beats 2 and 3
3. Build the About page with final copy (will be provided)
4. Build the Ground Level page with Substack RSS integration
5. Build the Contact page
6. Build the Work page structure (content TBD)
7. Build the Work Archive subpage structure
8. Implement Easter eggs
9. Polish: typography, color, spacing, animations, responsive design
10. Test and deploy

## Files to Provide Separately

- Final About page copy (currently in revision, nearly done)
- Work page content (pieces to feature, descriptions, links)
- Contact page copy
- Updated photos (if available)
- Social media links for footer/contact
- Easter egg specifics once concepts are finalized
