# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at localhost:4321
npm run build    # Build production site to ./dist/
npm run preview  # Preview production build locally
```

## Architecture

Professional portfolio website for Meredith McGee, MPH - a public health writer, evaluator, and researcher. Built with Astro.

### Design System

Tokens are defined once in the `:root` block of `src/styles/global.css`, copied from the approved preview. Use the tokens, not raw color values.

- Neutrals: `--paper` (#fcf9f8, page background), `--linen` (bands), `--line` (rules), `--muted`, `--ink` (#221013, text)
- Brand: raspberry, `--raspberry-700` (#5f0c27), also available as `--brand`
- Ramps: `--raspberry-*`, `--tea-*`, `--olive-*`, `--blue-*` (100, 300, 500, 700)
- The four verbs each own a color everywhere on the site: study is tea, write is raspberry, build is blue, fund is olive
- Links are `--olive-700` and turn `--brand` on hover
- `--tea-500`, `--olive-500` and `--blue-500` are never text on a light background. Text on a dark fill is `--paper`
- Fonts: Fraunces for headlines (`--font-display`, self-hosted in `public/fonts/`, always with `font-variation-settings: 'SOFT' 100`), Recia for everything else (`--font-body`, loaded from Fontshare in `BaseHead.astro` because its license does not allow the files to be committed). Nothing loads from Google Fonts
- Brand mark: the MM avatar in `public/img/brand/`. Do not redraw, recolor or crop it

### Key Files

- `src/consts.ts` - Site title and description
- `src/styles/global.css` - Global styles, color variables, button styles, responsive breakpoints
- `astro.config.mjs` - Update `site` URL before deploying

### Structure

- `src/pages/` - Page routes: index, about, work, work/[slug] (case studies), work/archive, how-i-work, writing, contact, work-with-me, work-with-me/[slug] (the three packages), observatory (unlisted)
- `src/components/` - Header, Footer and Wordmark; Scene (the shared pinned scroll engine) and LogicModel; ConsultForm and PackageBlocks; `study/` (the report block pieces); EmberClick (About only); WorkCard (archive only)
- `src/data/` - All wording and facts: home, approach, logicModel, study, work, projects, writing, packages (every price on the site), packageScenes, consultForm
- `src/lib/` - Build-time feeds: `groundLevel.ts` (Ground Level posts), `parabola.ts` (Parabola Papers pieces), `covers.ts` (which post covers show). Each falls back to a saved copy in `src/data/*-cache.json`
- `src/scripts/` - Page behavior: motion (reveal, counting numbers), scenes, logicModel, page helpers
- `src/styles/` - `global.css` (tokens, base, header and footer) plus one stylesheet per page family: home, how-i-work, work-with-me, pages (About, Work, case studies, Writing, Contact), and the shared walk, scene and logic-model sheets
- `scripts/refresh-ground-level.mjs` - Run by a daily scheduled task to refresh the saved Ground Level posts
- `public/` - Static assets. Page images live in `public/img/`, already compressed. `public/tools/kappa/` is a prebuilt app from another repository

### Styling Conventions

- Wrap page content in `<main id="main">`, with `<Header />` before it and `<Footer />` after
- `.wrap` is the max-width content wrapper, `.sec` gives a section its vertical padding, `.stack` spaces its children, `.band` is a linen background band
- Type roles: `.label`, `.lede`, `.h2`, `.h3`, `.h4`, `.body-lg`, `.card-text`, `.caption`, `.stat`
- Buttons: `.btn` (outline) and `.btn.solid`. Text links that act as actions: `.textlink`, `.more`, `.go`
- Page headers: `.phero` with `.p-plain`, or `.p-study`, `.p-write`, `.p-build`, `.p-fund` for a verb's color
- Sections that rise in on scroll take `.rv`. Everything must still read with scripts off and with reduced motion
- No em dashes anywhere, including comments. Do not rewrite Meredith's wording; it lives in `src/data/` or in named constants at the top of a page
