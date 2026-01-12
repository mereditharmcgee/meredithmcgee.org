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

Color palette defined in `src/styles/global.css`:
- Dark olive greens: `--color-dark` (#3d4a2a), `--color-medium` (#6b7c4c), `--color-light` (#a8b18f)
- Gold/cream text: `--color-gold` (#d4c98e), `--color-cream` (#e8e4d0)
- Fonts: Playfair Display (serif headings), Source Sans 3 (body)

### Key Files

- `src/consts.ts` - Site title and description
- `src/styles/global.css` - Global styles, color variables, button styles, responsive breakpoints
- `astro.config.mjs` - Update `site` URL before deploying

### Structure

- `src/pages/` - Page routes (index, about, work, portfolio, resume, contact)
- `src/components/Header.astro` - Fixed navigation with mobile hamburger menu
- `src/components/Footer.astro` - Site footer with contact info
- `public/` - Static assets (images, fonts)

### Styling Conventions

- Use `.bg-dark`, `.bg-medium`, `.bg-light` for section backgrounds
- Use `.bg-pattern` for subtle botanical pattern overlay
- Buttons: `.btn` (outline style), `.btn-small` for smaller variant
- Container: `.container` for max-width content wrapper
- Replace placeholder images in `src/pages/index.astro` with actual photos
