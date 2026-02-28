# Coding Conventions

**Analysis Date:** 2026-02-28

## Naming Patterns

**Files:**
- Astro components: PascalCase (`.astro` extension) - `Header.astro`, `Footer.astro`, `ThreeAudiences.astro`
- TypeScript/JavaScript modules: camelCase (`.ts` extension) - `consts.ts`, `content.config.ts`
- Page routes: lowercase with hyphens for multi-word pages (`.astro` extension) - `about.astro`, `contact.astro`
- Dynamic routes: square bracket notation - `[...slug].astro`, `[slug].astro`
- CSS files: lowercase with hyphens - `global.css`
- Layout components: `[Name].astro` format - `BlogPost.astro`

**Functions:**
- camelCase for all function definitions
- Constructor/component functions: PascalCase (Astro components auto-handled)
- Event handlers: camelCase with descriptive verb prefix - `openModal()`, `closeModal()`, `selectAudience()`
- Async functions named clearly with action: `typeWriter()`, `eraseText()`, `typeAllSlots()`

**Variables:**
- camelCase for all variable declarations
- Constants: UPPERCASE_SNAKE_CASE - `SITE_TITLE`, `SITE_DESCRIPTION`
- CSS custom properties: kebab-case prefixed with `--color-` or `--` - `--color-dark`, `--color-gold`, `--highlight-transition`
- Boolean variables/parameters: prefix with `is`, `has`, or `should` - `isOpen`, `isTyping`, `hasAnimated`, `shouldAnimate`
- Object properties: camelCase - `currentPath`, `navLinks`, `pubDate`

**Types & Interfaces:**
- PascalCase for all type names - `Props`, `CollectionEntry`
- Generic types at file level documented clearly
- Inline interfaces for component props: `interface Props { ... }`

**CSS Classes:**
- kebab-case for all CSS class names - `hero-content`, `nav-links`, `modal-backdrop`, `button-close`
- Utility classes: `.btn`, `.btn-small`, `.container`, `.sr-only`, `.bg-dark`, `.bg-pattern`
- BEM-style modifier classes when appropriate - `.nav-links.open`, `.audience-tab.active`
- Data attributes: kebab-case - `data-audience`, `data-slot`, `data-part`

**Data attributes:**
- kebab-case for attribute names - `data-audience="journalist"`, `data-slot="1"`

## Code Style

**Formatting:**
- No explicit formatter configured (Astro defaults)
- Consistent indentation: tabs (Astro standard)
- Line length: pragmatic, following component/section boundaries
- CSS: scoped within component `<style>` blocks

**Linting:**
- No explicit ESLint configuration detected
- TypeScript enabled with strict mode: `tsconfig.json` includes `"extends": "astro/tsconfigs/strict"` and `"strictNullChecks": true`
- Type imports used where appropriate - `import type { ... }`

**Code organization within files:**
- Astro: frontmatter (---), then JSX/HTML template, then `<style>` block, then `<script>` block
- TypeScript: imports first, interfaces/types, constants, then function definitions
- Components: single responsibility (Header, Footer, FormattedDate each handle one concern)

## Import Organization

**Order:**
1. Framework imports (Astro, Astro components) - `import { ... } from 'astro:content'`
2. Internal component imports (relative paths) - `import Header from '../components/Header.astro'`
3. Type imports - `import type { ... } from 'astro:content'`
4. Asset/style imports - `import '../styles/global.css'`
5. Icon/utility imports - inline SVG in templates

**Path Aliases:**
- No path aliases configured; uses relative imports throughout
- Relative imports for components: `'../components/Header.astro'`
- Relative imports for utilities: `'../consts'`
- Asset imports: direct paths - `/fonts/...`, `/logo-m.png`, `/hero-image.jpg`

**Example (from `BaseHead.astro`):**
```astro
---
import '../styles/global.css';
import type { ImageMetadata } from 'astro';
import FallbackImage from '../assets/blog-placeholder-1.jpg';
import { SITE_TITLE } from '../consts';
```

## Error Handling

**Patterns:**
- Optional properties in schemas use `.optional()` - `updatedDate: z.coerce.date().optional()`
- Optional image parameters - `image?: ImageMetadata`
- Fallback values provided for optional props - `image = FallbackImage`
- Graceful rendering: conditional JSX with `&&` operator - `{heroImage && <Image ... />}`
- Try/catch not explicitly shown; rely on schema validation for content collections

**Validation:**
- Zod for content collection schema validation (`content.config.ts`)
- Type definitions from schema directly - `type Props = CollectionEntry<'blog'>['data'];`

## Logging

**Framework:** No explicit logging framework used. Inline `console` statements can be added when needed.

**Patterns:**
- Client-side logging minimal; components are mostly presentational
- Server-side errors handled through TypeScript type system
- Debug state visible in ThreeAudiences component through UI (typing state, modal state)

## Comments

**When to Comment:**
- Complex async logic: documented (ThreeAudiences component has detailed flow comments)
- Part structure in complex components - `// Part 1: How the story is told` / `// Part 2: How Anthropic responds`
- Non-obvious event handlers or transitions

**JSDoc/TSDoc:**
- Not used throughout the codebase
- Type annotations used instead for clarity
- Component props documented via `interface Props { ... }`

**Example (from `ThreeAudiences.astro`):**
```typescript
// Part 1: How the story is told | Part 2: How Anthropic responds
// Intro content
const titleText = "The Same Document. Three Audiences.";
// Get slot elements for a specific part
function getSlot(part, num) { ... }
```

## Function Design

**Size:**
- Utility functions are single-purpose: `typeWriter()`, `eraseText()`, `getSlot()` each handle one task
- Component functions reasonable size (under 100 lines for UI logic)
- Async functions broken into logical steps with `await new Promise(r => setTimeout(r, ...))` for timing control

**Parameters:**
- Named destructuring for Astro component props - `const { date } = Astro.props;`
- Optional parameters use defaults - `speed = 15`, `speed = 8`
- Abort signals passed for cancellation - `typeWriter(element, text, speed, signal)`

**Return Values:**
- Promises returned from async functions - `Promise<boolean>`
- Void functions for event listeners and state mutations
- Boolean returns indicate completion status - `completed = await typeWriter(...)`

**Example (from `ThreeAudiences.astro`):**
```typescript
async function typeAllSlots(audience, signal) {
	const content1 = part1Content[audience];
	const content2 = part2Content[audience];
	// Type Part 1
	for (let i = 1; i <= 3; i++) {
		if (signal?.aborted) break;
		const { text, cursor } = getSlot(1, i);
		// ... logic
	}
}
```

## Module Design

**Exports:**
- Content collections exported as objects - `export const collections = { blog, portfolio };`
- Constants exported individually - `export const SITE_TITLE = '...';`
- No named vs default export pattern; simple consistency

**Barrel Files:**
- No barrel files used
- Direct imports of components: `import Header from '../components/Header.astro'`
- Constants imported directly from source: `import { SITE_TITLE } from '../consts'`

**Single Responsibility:**
- `consts.ts`: Site metadata only
- `content.config.ts`: Collection schemas only
- Components: one component per file, focused purpose (Header, Footer, FormattedDate)
- Layouts: template for specific content type (BlogPost.astro for blog entries)

## Accessibility

**Patterns:**
- ARIA attributes used consistently - `aria-label`, `aria-expanded`, `aria-selected`, `role`
- Screen reader only content - `.sr-only` utility class for skip links and announcements
- Semantic HTML elements - `<time>`, `<button>`, `<nav>`, `<article>`, `<section>`
- Keyboard navigation: Tab order managed with `tabindex`, arrow key handling in interactive components
- Focus management: modal close button focused on open, trigger focused on close
- Live regions for dynamic content updates - `aria-live="polite"`

**Example (from `ThreeAudiences.astro`):**
```astro
<button class="audience-tab active" role="tab" aria-selected="true"
        data-audience="journalist" tabindex="0">
  ...
</button>
```

## CSS Patterns

**Variables:**
- CSS custom properties centrally defined in `global.css`
- Color palette via `--color-*` variables: `--color-dark`, `--color-gold`, `--color-cream`
- Transition timing: `--highlight-transition: 350ms ease`
- Reused across all components

**Responsive Design:**
- Mobile-first approach with `@media (max-width: 768px)` for larger breakpoints
- `clamp()` function for fluid typography - `font-size: clamp(1.5rem, 3vw, 2rem)`
- Flexbox and Grid for layout flexibility
- Media query breakpoints: 768px (mobile), 1200px (desktop considerations)

**Scoped Styles:**
- Styles scoped within `<style>` tags in Astro components
- Global styles only in `global.css`
- No style conflicts; each component manages its own CSS

---

*Convention analysis: 2026-02-28*
