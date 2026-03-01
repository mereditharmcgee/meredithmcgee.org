---
phase: 01-foundation-cleanup
plan: B
title: Update navigation, add footer social links, create Ground Level placeholder
wave: 1
depends_on: []
requirements:
  - STRC-01
  - STRC-05
files_modified:
  - src/components/Header.astro
  - src/components/Footer.astro
files_created:
  - src/pages/ground-level.astro
autonomous: true
truths:
  - "Site navigation shows exactly 5 items in order: Home, About, Work, Ground Level, Contact"
  - "Footer displays LinkedIn and Substack icon links with correct URLs plus the existing contact email"
  - "Ground Level placeholder page exists at /ground-level with a Substack link"
  - 'No "Portfolio", "Resume", or "My Work" labels appear in the navigation'
  - "Footer icons are styled with site color tokens (cream at rest, gold on hover) and require no external icon library"
artifacts:
  - dist/ground-level/index.html
key_links:
  - label: LinkedIn
    url: https://linkedin.com/in/meredithmcgee
    status: confirm
  - label: Substack
    url: "TODO: confirm groundlevel.substack.com vs meredithwritespublichealth.substack.com"
    status: unresolved
---

# Plan B: Update Navigation, Add Footer Social Links, Create Ground Level Placeholder

Update the site navigation to the new 5-item structure, add LinkedIn and Substack icon links to the footer, and create a minimal Ground Level placeholder page. This plan establishes the new site skeleton that later phases build on.

## Tasks

<task id="B1">
<title>Update Header.astro navigation to 5-item structure</title>
<files>
- src/components/Header.astro (modify)
</files>
<action>
In `src/components/Header.astro`, replace the existing `navLinks` array (lines 4-11) with the new 5-item version:

```javascript
const navLinks = [
	{ href: '/', label: 'Home' },
	{ href: '/about', label: 'About' },
	{ href: '/work', label: 'Work' },
	{ href: '/ground-level', label: 'Ground Level' },
	{ href: '/contact', label: 'Contact' },
];
```

Changes from the current array:
- Remove `{ href: '/portfolio', label: 'Portfolio' }` (line 8)
- Remove `{ href: '/resume', label: 'Resume' }` (line 9)
- Change `label: 'My Work'` to `label: 'Work'` (line 7)
- Add `{ href: '/ground-level', label: 'Ground Level' }` between Work and Contact

No other changes to Header.astro. The mobile hamburger menu, active state logic, and all CSS work generically on whatever items are in the array.
</action>
<verify>
- `navLinks` array in Header.astro has exactly 5 entries
- The order is: Home, About, Work, Ground Level, Contact
- No "Portfolio", "Resume", or "My Work" labels appear in the array
- Run `npm run build` and verify the nav HTML in any `dist/*/index.html` page shows exactly 5 nav items
</verify>
<done>
- `grep "navLinks" src/components/Header.astro` shows the array definition
- Array contains exactly 5 objects with labels: Home, About, Work, Ground Level, Contact (in that order)
- `grep -c "Portfolio\|Resume\|My Work" src/components/Header.astro` returns 0
</done>
</task>

<task id="B2">
<title>Add LinkedIn and Substack icon links to Footer.astro</title>
<files>
- src/components/Footer.astro (modify)
</files>
<action>
In `src/components/Footer.astro`, add a social links row below the email address line and above the location line within the `.footer-contact` div. Use inline SVG icons (no icon library dependency). Icons only, no text labels.

Insert the following HTML between the `.footer-email` paragraph and the `.footer-location` paragraph:

```html
<div class="footer-social">
	<a href="https://linkedin.com/in/meredithmcgee" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
		<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
			<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
		</svg>
	</a>
	<a href="TODO_SUBSTACK_URL" target="_blank" rel="noopener noreferrer" aria-label="Substack">
		<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
			<path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
		</svg>
	</a>
</div>
```

**TODO:** Before executing this task, confirm the Substack URL with the user. CONTEXT says `groundlevel.substack.com` but marks it "(confirm)". Replace `TODO_SUBSTACK_URL` with the confirmed URL.

Add the following CSS rules inside the existing `<style>` block, after the `.footer-email a:hover` rule:

```css
.footer-social {
	display: flex;
	gap: 1rem;
	justify-content: flex-end;
	margin: 0.5rem 0;
}

.footer-social a {
	color: var(--color-cream);
	transition: color 0.3s ease;
	display: flex;
	align-items: center;
}

.footer-social a:hover {
	color: var(--color-gold);
}
```

And inside the existing `@media (max-width: 768px)` block, add:

```css
.footer-social {
	justify-content: center;
}
```

**URL notes:**
- LinkedIn: `https://linkedin.com/in/meredithmcgee` (per CONTEXT; confirm if correct during implementation)
- Substack: **UNRESOLVED** -- CONTEXT says `groundlevel.substack.com (confirm)`. Must confirm with user before hardcoding. Use `TODO_SUBSTACK_URL` as placeholder until confirmed.
</action>
<verify>
- Footer.astro contains two SVG icon links (LinkedIn and Substack)
- Both links have `target="_blank"` and `rel="noopener noreferrer"`
- Both links have `aria-label` attributes for accessibility
- Icons use `currentColor` fill so they inherit the color from CSS
- On hover, icons transition to `--color-gold`
- In mobile view, icons are centered (matching the mobile footer layout)
- No icon library was added to package.json
- Substack URL has been confirmed (not still `TODO_SUBSTACK_URL`)
</verify>
<done>
- `src/components/Footer.astro` contains `class="footer-social"`
- `grep -c "aria-label" src/components/Footer.astro` returns at least 2 (LinkedIn and Substack)
- `grep "TODO_SUBSTACK_URL" src/components/Footer.astro` returns 0 matches (URL was confirmed and replaced)
- `grep "target=\"_blank\"" src/components/Footer.astro` matches both social links
- No new dependencies added to `package.json`
</done>
</task>

<task id="B3">
<title>Create Ground Level placeholder page</title>
<files>
- src/pages/ground-level.astro (create)
</files>
<action>
Create `src/pages/ground-level.astro` with the standard page template (BaseHead, Header, Footer) and minimal placeholder content.

The page should:
- Use the same template pattern as other pages (import BaseHead, Header, Footer, SITE_TITLE)
- Have a title "Ground Level" in the page head
- Display a brief, warm intro explaining what Ground Level is
- Include a link to the Substack newsletter
- Follow voice rules: use contractions, no em dashes, no corporate language, lead with concrete
- NOT include a full Substack subscribe CTA or RSS feed (those come in Phase 4)

```astro
---
import BaseHead from '../components/BaseHead.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import { SITE_TITLE } from '../consts';
---

<!doctype html>
<html lang="en">
	<head>
		<BaseHead title={`Ground Level | ${SITE_TITLE}`} description="Ground Level is Meredith McGee's newsletter on public health, research, and the gaps between." />
	</head>
	<body>
		<Header />

		<main class="ground-level">
			<div class="container">
				<h1>Ground Level</h1>
				<p>
					Ground Level is where I write about public health, research, and the spaces between what we know and what we do about it. It's honest, it's specific, and it doesn't pretend the work is simple.
				</p>
				<p>
					I publish on Substack. You can <a href="TODO_SUBSTACK_URL" target="_blank" rel="noopener noreferrer">read it there</a> and subscribe if you'd like new posts in your inbox.
				</p>
			</div>
		</main>

		<Footer />
	</body>
</html>

<style>
	.ground-level {
		padding-top: 8rem;
		padding-bottom: 4rem;
	}

	.ground-level .container {
		max-width: 700px;
		padding: 0 2rem;
	}

	.ground-level h1 {
		font-size: clamp(1.75rem, 3vw, 2.5rem);
		margin-bottom: 1.5rem;
	}

	.ground-level p {
		font-size: 1.05rem;
		line-height: 1.7;
		margin-bottom: 1.25rem;
	}

	.ground-level a {
		color: var(--color-gold);
		text-decoration: underline;
		text-underline-offset: 0.15em;
	}

	.ground-level a:hover {
		color: var(--color-cream);
	}
</style>
```

**TODO:** Replace `TODO_SUBSTACK_URL` with the confirmed Substack URL (same as B2). Must confirm with user before hardcoding.

**Copy notes:** The placeholder text follows voice rules (contractions: "it's", "doesn't"; no em dashes; concrete lead: "Ground Level is where I write about..."; no corporate language). It's intentionally brief. The full page with RSS posts and subscribe CTA comes in Phase 4.
</action>
<verify>
- `src/pages/ground-level.astro` exists
- The page imports BaseHead, Header, Footer
- The page contains a link to the Substack newsletter
- The page copy uses contractions and contains no em dashes
- Run `npm run build` and confirm `dist/ground-level/index.html` exists
- The rendered page has a heading "Ground Level" and a link to Substack
- Substack URL has been confirmed (not still `TODO_SUBSTACK_URL`)
</verify>
<done>
- File `src/pages/ground-level.astro` exists on disk
- `grep "BaseHead\|Header\|Footer" src/pages/ground-level.astro` shows all three imports
- `grep "TODO_SUBSTACK_URL" src/pages/ground-level.astro` returns 0 matches (URL was confirmed and replaced)
- `dist/ground-level/index.html` exists after `npm run build`
- Page content contains "Ground Level" heading and a Substack link
</done>
</task>

## Verification

After all tasks are complete:

1. **Nav structure correct:** Run `npm run build`, then check any page in `dist/` -- the nav should list exactly 5 items: Home, About, Work, Ground Level, Contact in that order. No "Portfolio", "Resume", or "My Work" labels.
2. **Footer social links present:** Check any page in `dist/` -- the footer should contain LinkedIn and Substack SVG icon links with correct URLs, below the email address.
3. **Ground Level page exists:** `dist/ground-level/index.html` exists, has "Ground Level" heading, links to Substack, and renders with Header and Footer.
4. **Voice rules:** The Ground Level placeholder copy uses contractions, has no em dashes, and contains no corporate buzzwords.
