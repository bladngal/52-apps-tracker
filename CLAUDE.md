# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start Vite dev server at http://localhost:5173
npm run build    # Production build to dist/
npm run preview  # Preview production build
```

## Architecture

This is a vanilla JS + Vite app for tracking 52 weekly app completions throughout 2026. No framework, no backend - just ES modules and LocalStorage.

### Entry Points
- `index.html` + `src/main.js` - Details view with full cards
- `overview.html` + `src/overview.js` - Minimal dots-only view

### Module Structure
- `src/data.js` - Data model, LocalStorage persistence (`52_apps_2026` key), status constants (`STATUS.FUTURE`, `STATUS.SUCCESS`, `STATUS.DIDNT_SHIP`)
- `src/card.js` - Card component factory for details view
- `src/overview.js` - Dot component factory for overview view
- `src/style.css` - All styles

### Data Flow
Both views load weeks via `loadWeeks()`, render into quarterly containers (data-quarter="1-4"), and persist changes immediately via `saveWeeks()`. Week data is an array of 52 objects with `weekNumber`, `dateRange`, `appName`, and `status`.

## Design Constraints

Per the PRD, this app intentionally excludes:
- Planning/task features, notes, analytics, charts
- Authentication, mobile optimization, animations
- Any scope beyond "Did I ship this week?"

Keep changes minimal and focused on the core tracking functionality.
