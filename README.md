# 52 Apps Tracker

A calm, minimal accountability app for tracking 52 weekly apps throughout 2026.

![52 Apps Tracker](https://img.shields.io/badge/challenge-52%20apps-00b894)

## About

This app exists to reinforce **shipping**, not planning. It tracks completion status for one app per week across the entire year, providing at-a-glance visibility into your progress.

## Features

- **52 Week Cards** — One card per week with editable app name
- **Status Cycling** — Click to cycle through: Future → Success → Didn't Ship
- **Quarterly Layout** — Cards organized by Q1-Q4 in a clean 4-column grid
- **Overview Page** — Minimal dots-only view for quick year-at-a-glance
- **Persistent Data** — All changes saved to LocalStorage automatically

## Views

### Details View (`/`)
Full cards with week numbers, date ranges, editable app names, and status indicators.

### Overview View (`/overview.html`)
Minimal 4-row display with just status dots — perfect for a quick progress check.

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open http://localhost:5173 in your browser.

## Status States

| Status | Visual | Meaning |
|--------|--------|---------|
| Future project | ○ Gray | Week hasn't occurred or work not complete |
| Success | ● Green | App shipped that week |
| Didn't ship | ● Red | Week passed without shipping |

## Tech Stack

- Vite (vanilla JS)
- Vanilla CSS
- LocalStorage for persistence

## Design Philosophy

This app is intentionally minimal. It must **not** include:
- Planning or task management features
- Notes or documentation fields
- Analytics or charts
- Authentication
- Animations or gamification

The goal is a calm, focused tool that simply answers: "Did I ship this week?"

---

Built as App #1 of the 52 Apps Challenge · 2026
