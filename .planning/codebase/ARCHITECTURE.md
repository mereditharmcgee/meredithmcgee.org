# Architecture

**Analysis Date:** 2026-02-28

## Pattern Overview

**Overall:** Static Site Generation (SSG) with Content Collections

**Key Characteristics:**
- Astro 5.x framework for SSG with file-based routing
- Declarative content schemas using Astro Content Collections
- Component-based UI with scoped Astro components
- Static pre-rendered pages at build time
- No backend API or database - content stored as markdown files with frontmatter
- MDX support for blog posts allowing markdown + JSX interoperability

## Layers

**Content Layer:**
- Purpose: Structured markdown files with schema validation
- Location: `src/content/blog/` and `src/content/portfolio/`
- Contains: Blog posts (.md, .mdx) and portfolio project entries (.md)
- Depends on: Astro Content Collections schema defined in `src/content.config.ts`
- Used by: Dynamic pages via `getCollection()` API

**Page/Routing Layer:**
- Purpose: File-based routes that generate static pages
- Location: `src/pages/`
- Contains: Astro components that export `getStaticPaths()` for dynamic routes, static page templates
- Depends on: Content Collection data, Layout components, Utility components
- Used by: Astro build system to generate HTML files

**Component Layer:**
- Purpose: Reusable UI components (layouts, headers, footers, interactive elements)
- Location: `src/components/` and `src/layouts/`
- Contains: Astro components with scoped styles
- Depends on: Global styles, type definitions from Astro
- Used by: Page components for composition

**Styling Layer:**
- Purpose: Global design system, CSS variables, responsive typography
- Location: `src/styles/global.css`
- Contains: CSS custom properties, typography scales, button styles, layout utilities
- Depends on: Google Fonts API (Playfair Display, Source Sans 3)
- Used by: All Astro components via `<BaseHead>` import

**Configuration Layer:**
- Purpose: Site-wide constants and build configuration
- Location: `src/consts.ts`, `astro.config.mjs`, `tsconfig.json`
- Contains: Site title/description, Astro integrations, TypeScript options
- Depends on: Nothing
- Used by: Pages, BaseHead, RSS generation

## Data Flow

**Static Build Pipeline:**

1. Astro reads frontmatter + content from `src/content/blog/` and `src/content/portfolio/`
2. Content validates against schemas in `src/content.config.ts`
3. Dynamic route pages (`[slug].astro`, `[...slug].astro`) call `getStaticPaths()`
4. `getStaticPaths()` calls `getCollection()` to fetch all content
5. Astro renders each page with data injected as `Astro.props`
6. Components import `BaseHead` which loads global styles
7. HTML + CSS generated to `dist/` at build time
8. `sitemap.xml` and `rss.xml` generated automatically via integrations

**Content Rendering:**

1. Blog post: `[...slug].astro` uses `getCollection('blog')`
2. Renders `BlogPost.astro` layout with content from `await render(post)`
3. Portfolio item: `portfolio/[slug].astro` uses `getCollection('portfolio')`
4. Displays metadata fields (role, challenge, impact, skills, timeline)
5. Renders video or image from frontmatter
6. Renders markdown content via `await entry.render()`

**State Management:**
- No client-side state - all state is server-rendered at build time
- Mobile menu state managed via vanilla JS in `Header.astro` (click handlers)
- Interactive "Three Audiences" demo uses client-side JS for tab switching and typewriter effect

## Key Abstractions

**Content Collections Schema:**
- Purpose: Define structure for blog posts and portfolio items
- Location: `src/content.config.ts`
- Pattern: Zod schema validation with optional hero images
- Examples:
  - Blog: `title`, `description`, `pubDate`, `updatedDate`, `heroImage`
  - Portfolio: `title`, `category`, `image`, `description`, `tags`, `size`, `order`, `role`, `challenge`, `impact`, `skills`, `timeline`, `organization`, `video`

**Layout Components:**
- Purpose: Wrapper templates applied to content pages
- Location: `src/layouts/BlogPost.astro`
- Pattern: Receives data via `type Props = CollectionEntry<'blog'>['data']`
- Usage: `<BlogPost {...post.data}><Content /></BlogPost>`

**Reusable Components:**
- Purpose: UI building blocks used across pages
- Location: `src/components/`
- Components:
  - `BaseHead.astro` - SEO meta tags, fonts, canonical URLs, OG tags
  - `Header.astro` - Fixed navigation with mobile hamburger menu
  - `Footer.astro` - Site footer with contact info and copyright
  - `FormattedDate.astro` - Date formatting utility
  - `HeaderLink.astro` - Navigation link (unused, superseded by Header logic)
  - `ThreeAudiences.astro` - Large interactive modal demo with typewriter effect

**Page Templates:**
- Purpose: Route handlers that fetch and render content
- Pattern: Use frontmatter for imports, export `getStaticPaths()` for dynamic routes
- Example pattern:
  ```astro
  export async function getStaticPaths() {
    const items = await getCollection('portfolio');
    return items.map(item => ({
      params: { slug: item.slug },
      props: { item },
    }));
  }
  ```

## Entry Points

**Home Page:**
- Location: `src/pages/index.astro`
- Triggers: Navigation to `/`
- Responsibilities: Hero section, three-card "approach" section, featured work cards, about preview, interactive ThreeAudiences demo

**Blog Index:**
- Location: `src/pages/blog/index.astro`
- Triggers: Navigation to `/blog`
- Responsibilities: Fetch all blog posts, sort by pubDate descending, render as grid with images and dates

**Blog Post Dynamic:**
- Location: `src/pages/blog/[...slug].astro`
- Triggers: Navigation to `/blog/{id}`
- Responsibilities: Fetch single post, render with BlogPost layout, display hero image if present, render markdown content

**Portfolio Index:**
- Location: `src/pages/portfolio.astro`
- Triggers: Navigation to `/portfolio`
- Responsibilities: Fetch all portfolio items, sort by order field, render filterable grid with flip-card animation

**Portfolio Detail Dynamic:**
- Location: `src/pages/portfolio/[slug].astro`
- Triggers: Navigation to `/portfolio/{slug}`
- Responsibilities: Fetch single portfolio item, display metadata (role, challenge, impact), render video or image, display tags and skills

**Static Pages:**
- Location: `src/pages/{about, contact, resume, work}.astro`
- Triggers: Navigation to corresponding routes
- Responsibilities: Render fixed content (no dynamic data)

**RSS Feed:**
- Location: `src/pages/rss.xml.js`
- Triggers: Automatic generation during build
- Responsibilities: Generate RSS feed from blog collection via `@astrojs/rss` integration

## Error Handling

**Strategy:** Server-side only (no client error handling needed for SSG)

**Patterns:**
- Build-time validation: Zod schemas in `src/content.config.ts` validate all content frontmatter
- Missing images: Fallback placeholder used if `heroImage` not provided
- Optional fields: Render conditionally - e.g., `{role && <div>{role}</div>}`
- Broken links: No runtime error handling (SSG generates static files)

## Cross-Cutting Concerns

**Logging:** No logging (static generation, no runtime errors)

**Validation:** Frontmatter validated at build-time by Zod schemas in `src/content.config.ts`

**Authentication:** Not applicable (static site, no protected content)

**SEO:** Handled via:
- Canonical URLs in `BaseHead.astro`
- Open Graph meta tags for social sharing
- Twitter Card tags
- Auto-generated sitemap via `@astrojs/sitemap` integration
- Auto-generated RSS feed via `@astrojs/rss` integration

---

*Architecture analysis: 2026-02-28*
