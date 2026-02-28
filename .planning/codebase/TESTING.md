# Testing Patterns

**Analysis Date:** 2026-02-28

## Test Framework

**Status:** Not detected

No testing framework is currently configured in this project. The codebase has no test files (`.test.*` or `.spec.*`), no test runner configuration (Jest, Vitest, Playwright, etc.), and no test dependencies in `package.json`.

**Run Commands:**
- Not applicable - no test suite exists
- Can be added later with: `npm install --save-dev vitest` or `npm install --save-dev jest`

## Test File Organization

**Location:**
- Not currently in use
- Recommended pattern when testing is added: co-located with source
  - Unit tests: `src/components/Header.test.ts` next to `src/components/Header.astro`
  - Integration tests: `src/tests/integration/` directory
  - E2E tests: `e2e/` or `tests/e2e/` directory

**Naming:**
- Not established yet
- When adopted, follow: `[Component].test.ts` for units, `[Feature].spec.ts` for integration

**Structure:**
- Not implemented

## Test Structure

Not applicable - no tests currently exist.

When testing is introduced, patterns should follow:
- One test suite per component/module
- Clear describe blocks for feature areas
- Before/after hooks for setup/teardown if needed
- Assertion chains for readability

## What Needs Testing

Based on codebase analysis, priority areas for test coverage would be:

**High Priority:**

1. **Content Collections Schema** (`src/content.config.ts`)
   - Validate blog collection schema accepts valid metadata
   - Validate portfolio collection schema with all required/optional fields
   - Test Zod coercion: `pubDate` date parsing, optional fields
   - Test enum validation: `size: z.enum(['small', 'medium', 'large'])`

2. **Interactive Component Logic** (`src/components/ThreeAudiences.astro` script section)
   - Typewriter effect: correct character-by-character typing with speed parameter
   - Erase function: correct character deletion
   - Audience switching: content swaps correctly, abort signals work
   - Modal open/close: focus management, body overflow handling
   - Keyboard navigation: arrow keys cycle through tabs, Enter/Space triggers selection
   - Dynamic content loading: correct text appears for each audience/part combo
   - Timing: delays between text blocks and transitions work as expected

3. **Navigation State** (`src/components/Header.astro`)
   - Current path highlighting: `.active` class applied to correct route
   - Mobile menu toggle: aria-expanded attribute toggles on click
   - Menu visibility: nav-links slide in/out on mobile
   - Hamburger animation: transforms correctly when menu opens

4. **Conditional Rendering**
   - Blog post with hero image: image renders if present
   - Blog post without hero image: renders safely without breaking layout
   - Optional dates: `updatedDate` only renders when provided
   - Fallback images: `FallbackImage` used when no image prop provided

**Medium Priority:**

5. **CSS Layout & Responsive**
   - Grid layouts reflow correctly at breakpoints
   - Flex items wrap as expected on smaller screens
   - clamp() typography scales smoothly
   - z-index layering works (header stays above content, modal above all)

6. **Accessibility**
   - Modal: focus trapped, keyboard-navigable
   - Navigation: keyboard-accessible, screen reader announcements work
   - Color contrast: text readable on all background colors
   - ARIA attributes: properly linked elements

7. **Collection Sorting** (`src/pages/blog/index.astro`)
   - Blog posts sorted by pubDate descending
   - First post featured at top with larger image

## Mocking

Not yet needed - no external API calls in current codebase.

**When needed:**
- Mock `Astro.url` for route testing
- Mock `Astro.props` for component prop testing
- Mock `getCollection()` for content collection scenarios (missing entries, schema violations)
- Mock browser APIs: `document.querySelector()`, event listeners for component interaction tests

## Fixtures and Factories

Not implemented.

**Recommended when testing:**

Test data for content collections:

```typescript
// src/tests/fixtures/blog-fixtures.ts
export const mockBlogPost = {
  data: {
    title: "Test Post",
    description: "A test blog post",
    pubDate: new Date('2026-02-28'),
    updatedDate: undefined,
    heroImage: undefined
  },
  id: "test-post"
};

export const mockPortfolioItem = {
  data: {
    title: "Test Project",
    category: "Research",
    image: "/placeholder.jpg",
    description: "A test portfolio item",
    tags: ["testing", "sample"],
    size: "medium",
    order: 1,
    role: "Lead",
    challenge: "Complex problem",
    impact: "Positive outcome",
    skills: ["Writing", "Research"],
    timeline: "3 months",
    organization: "Test Org",
    video: undefined
  },
  id: "test-project"
};
```

Test data for interactive component:

```typescript
// src/tests/fixtures/three-audiences.ts
export const mockAudienceContent = {
  journalist: {
    1: "Test journalist text 1",
    2: "Test journalist text 2",
    3: "Test journalist text 3"
  },
  staffer: {
    1: "Test staffer text 1",
    2: "Test staffer text 2",
    3: "Test staffer text 3"
  },
  researcher: {
    1: "Test researcher text 1",
    2: "Test researcher text 2",
    3: "Test researcher text 3"
  }
};
```

## Coverage

**Requirements:** None currently enforced

When testing is implemented, recommend:
- Minimum 80% statement coverage
- 100% coverage for schema validation
- 100% coverage for accessibility features
- 70% coverage for presentational components

## Test Types

### Unit Tests

**Scope:**
- Individual functions: `typeWriter()`, `eraseText()`, `getSlot()`, `selectAudience()`
- Content schema validation via Zod
- Type contracts via TypeScript

**Approach:**
- Test single function behavior in isolation
- Mock DOM/timers for async functions
- Validate error handling (signal abortion, promise rejection)

**Example (when implemented):**
```typescript
describe('typeWriter function', () => {
  it('types characters one at a time with correct timing', async () => {
    const element = document.createElement('div');
    const text = "Hello";
    const signal = new AbortController().signal;

    const result = await typeWriter(element, text, 10, signal);

    expect(result).toBe(true);
    expect(element.textContent).toBe("Hello");
  });

  it('respects abort signal and stops typing', async () => {
    const element = document.createElement('div');
    const controller = new AbortController();

    const promise = typeWriter(element, "Hello World", 5, controller.signal);
    setTimeout(() => controller.abort(), 50);

    const result = await promise;
    expect(result).toBe(false);
    expect(element.textContent.length).toBeLessThan(11);
  });
});
```

### Integration Tests

**Scope:**
- Component interactions: Header active state + page navigation
- Modal lifecycle: open → typewriter animation → audience switching → close
- Content collection loading + sorting + rendering

**Approach:**
- Test component renders correctly in context
- Test prop changes trigger expected updates
- Test state management across related components

**Example (when implemented):**
```typescript
describe('ThreeAudiences Component', () => {
  it('loads with intro animation then shows interactive section', async () => {
    const modal = document.querySelector('.three-audiences-modal');

    expect(modal?.hidden).toBe(true);

    const trigger = document.querySelector('.three-audiences-trigger');
    trigger?.click();

    expect(modal?.hidden).toBe(false);

    // Wait for intro animation
    await new Promise(r => setTimeout(r, 3000));

    const interactive = modal?.querySelector('.interactive-section');
    expect(interactive?.hidden).toBe(false);
  });

  it('switches audience content and animates text correctly', async () => {
    const journalistTab = document.querySelector('[data-audience="journalist"]');
    const stafferTab = document.querySelector('[data-audience="staffer"]');

    expect(journalistTab?.classList.contains('active')).toBe(true);

    stafferTab?.click();

    // Wait for erase animation
    await new Promise(r => setTimeout(r, 1000));

    expect(stafferTab?.classList.contains('active')).toBe(true);
    expect(journalistTab?.classList.contains('active')).toBe(false);
  });
});
```

### E2E Tests

**Framework:** Not currently used; recommend Playwright when needed

**Scope:**
- User workflows: navigate site → read blog → view portfolio → contact
- Modal interactions: click trigger → read content → switch audiences → close
- Form submissions (if contact form is added)
- Mobile navigation: open menu → select link → menu closes

**Approach:**
```typescript
// Example with Playwright (when added)
import { test, expect } from '@playwright/test';

test('user can view blog post and navigate back', async ({ page }) => {
  await page.goto('http://localhost:4321');
  await page.click('a[href="/blog"]');

  // Expect blog index page
  await expect(page).toHaveTitle(/Blog/);

  // Click first post
  const firstPost = page.locator('ul li:first-child a');
  await firstPost.click();

  // Expect blog post loaded
  await expect(page.locator('article h1')).toBeVisible();
});
```

## Current Gaps

1. **No test infrastructure** - No runner, no assertion library, no utilities
2. **No content validation tests** - Zod schemas exist but aren't validated in tests
3. **No interaction tests** - Complex TypeScript logic in ThreeAudiences has no automated verification
4. **No accessibility testing** - ARIA attributes and keyboard navigation untested
5. **No responsive design tests** - Media queries verified manually only
6. **No link/route tests** - Navigation correctness depends on manual QA

## Recommended Setup

When implementing tests, follow this setup:

```bash
# Install Vitest (lightweight, Vite-native)
npm install --save-dev vitest @vitest/ui

# Install DOM testing utilities
npm install --save-dev @testing-library/astro @testing-library/dom jsdom

# For E2E testing (later)
npm install --save-dev @playwright/test
```

**Test scripts for package.json:**
```json
{
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:e2e": "playwright test",
  "test:coverage": "vitest --coverage"
}
```

---

*Testing analysis: 2026-02-28*
