# Phase 6: Easter Eggs and Polish - Context

**Gathered:** 2026-03-01
**Status:** Ready for planning
**Source:** discuss-phase conversation

<domain>
## Phase Boundary

This phase adds personality and delight to the existing site through three Easter egg interactions: an Ember click reaction (primary), About page personal footnotes, and a hidden footer message. All interactions must respect `prefers-reduced-motion` and work on touch devices. No new pages, no layout changes, no content restructuring.

</domain>

<decisions>
## Implementation Decisions

### Ember Click Interaction (DLGT-01)
- **Trigger:** Clicking any mention of "Ember" on the site (currently appears on index.astro and about.astro)
- **Primary reaction:** Dedicated solo photo of Ember appears near click point + gold/amber particle burst radiating outward
- **Photo dismissal:** Photo gently floats upward while fading out, alongside the particles. Whimsical, not abrupt.
- **Repeat behavior:** Particles vary subtly each time (spread, timing) to feel alive
- **Escalation (3+ clicks):** After 3 or more clicks, a different, sillier Ember photo appears with a short text caption (e.g., "she says hi"). This is the one playful, silly moment on the site.
- **Affordance:** "Ember" text gets a subtle gold dotted underline (using `--color-gold`) and cursor changes to pointer on hover. On mobile, no hover hint — discovery is by tapping.
- **Photo assets:** Use placeholder images during development. User will provide dedicated Ember photos (normal + silly) to drop into `public/` before launch.
- **Particle style:** Small gold/amber dots using `--color-gold`, floating upward and fading. 6-8 particles per burst. CSS animation, no JS animation library.

### About Page Personal Footnotes (DLGT-02)
- **What:** 2-3 specific phrases in the About essay get annotated with personal asides — like an author's margin notes
- **Visual hint:** Annotated phrases have a faint dotted underline in a muted color. Distinguishable from regular links.
- **Interaction:** Click/tap the phrase to show a tooltip popup — a small floating card near the phrase with the aside text
- **Dismissal:** Click anywhere else to dismiss the tooltip
- **Content:** Claude picks the phrases and drafts the aside text during execution, matching the site's warm, personal voice. Examples: "during college" -> "Go Terriers!" or similar personal color.
- **Tone:** Warm and understated. These are gentle personal touches, not jokes.

### Hidden Footer Message (DLGT-02)
- **What:** A barely-visible piece of text embedded in the footer area
- **Discovery:** Fully hidden — no affordance, no hint. Only curious explorers find it.
- **Reveal:** Text becomes readable on hover (desktop) or tap (mobile). Could be very low contrast text that becomes full contrast on interaction.
- **Content:** Claude drafts something fitting the site's voice during execution — personal, warm, one line. Something like "made with love, coffee, and a black lab at my feet" but the exact text is Claude's discretion.
- **Placement:** Within the existing Footer.astro component, below or near the copyright line.

### Discovery & Tone (DLGT-03)
- **Overall approach:** Subtle affordances — tiny hints that something is interactive, without spoiling the surprise
- **Tone baseline:** Warm and understated. Quiet moments of personality. A gentle smile, not a laugh.
- **One exception:** Ember's 3+ click escalation is the one playful, silly moment. The rest stays understated.
- **Mobile parity:** All interactions work identically via tap. No hover-only triggers.

### Accessibility (DLGT-04)
- **Reduced motion:** All particle animations and float-up effects disabled when `prefers-reduced-motion` is enabled. Ember click can show a static photo (no animation). Footnotes just show/hide (no transition). Footer message just appears (no fade).
- **Pattern:** Site already checks `window.matchMedia('(prefers-reduced-motion: reduce)')` in BaseHead.astro — follow this existing pattern.
- **Touch devices:** All interactions use click/tap events (not hover-dependent). Already the established pattern in Header.astro mobile menu.
- **Screen readers:** Particle overlay uses `aria-hidden="true"`. Footnote tooltips should be accessible (role, aria-describedby). Ember interaction is decorative.

### Claude's Discretion
- Technical component architecture (how to structure EmberClick.astro, footnote component, etc.)
- Exact particle count, animation timing, and easing curves
- How to identify and wrap "Ember" text for click handling
- Footnote tooltip positioning logic
- Footer hidden message exact implementation technique
- Placeholder image approach during development

</decisions>

<specifics>
## Specific Ideas

- Ember particles should use `--color-gold` (#d4b968) from the existing design system
- The escalation photo caption could rotate between a few options: "she says hi", "good girl", "best dog" — Claude's discretion on exact text
- Footnote tooltips should visually match the site's warm aesthetic — cream/gold tones, not a generic white tooltip
- Footer hidden message should be discoverable but not accidental — needs to be subtle enough that casual scrolling doesn't reveal it
- "Ember" text appears at: index.astro (line ~26: "a black lab named Ember"), about.astro (line ~43: "I also got Ember"), about.astro (line ~75: "and Ember")

</specifics>

<code_context>
## Codebase Integration Points

- **Ember mentions:** `src/pages/index.astro` (1 mention), `src/pages/about.astro` (2 mentions)
- **Existing motion handling:** `src/components/BaseHead.astro` checks `prefers-reduced-motion` before initializing IntersectionObserver for scroll animations
- **Existing CSS animations:** `src/styles/global.css` has `@keyframes fadeRise`, stagger utilities, and `@media (prefers-reduced-motion: reduce)` block
- **Click pattern:** `src/components/Header.astro` uses vanilla JS `addEventListener('click', ...)` — follow this pattern
- **Color tokens:** `--color-gold` (#d4b968), `--color-cream` (#ece6d0) in `:root`
- **Component pattern:** Self-contained `.astro` files with scoped `<style>` and `<script>` blocks
- **Photo assets:** `public/family-photo.jpg` exists (has Ember). Placeholder needed for solo Ember photo at `public/ember.jpg` and `public/ember-silly.jpg`
- **Footer component:** `src/components/Footer.astro` — hidden message goes here
- **About page:** `src/pages/about.astro` — footnote annotations go here

</code_context>

<deferred>
## Deferred Ideas

- Konami code / secret key combo (could be a future polish pass)
- Contact page warmth animation (post-submit response)
- Sound effects (bark on Ember click) — deliberately excluded for accessibility simplicity

</deferred>

---

*Phase: 06-easter-eggs-and-polish*
*Context gathered: 2026-03-01 via discuss-phase*
