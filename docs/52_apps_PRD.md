# App #1 PRD — 52 Apps Tracker

## Purpose
A simple, calm accountability app that tracks completion status for 52 weekly apps across the year 2026.

This app exists to reinforce **shipping**, not planning, ideation, or optimization.  
It serves as proof that the 52-apps challenge has begun and establishes continuity for the year.

---

## Core Concept
- One app per week
- 52 total weeks
- Each week has a visible outcome
- Progress is readable at a glance

---

## Core Interaction: Status Click Cycle

Each weekly card contains a single status indicator that cycles on click.

### Status States (in order)
1. **Future project**
   - Visual: neutral / empty circle
   - Label text: `Future project`
   - Meaning: the week has not occurred yet or work is not complete

2. **Success**
   - Visual: filled green circle
   - Label text: `Success`
   - Meaning: the app shipped that week

3. **Didn’t ship**
   - Visual: filled muted red or gray circle
   - Label text: `Didn’t ship`
   - Meaning: the week passed without shipping an app

### Click Behavior
- Each click advances to the next state
- After the final state, it loops back to **Future project**
- No confirmation dialogs
- No undo button (clicking again is the undo)

The interaction should feel frictionless and forgiving.

---

## Data Model (Non-Technical)

Each week is represented by a single record.

### Fields per Week
- **Week number** (1–52)
- **Date range** (e.g., “Jan 15–21”)
- **App name**
  - Editable free-text
  - Optional to fill in ahead of time
- **Status**
  - One of:
    - `future`
    - `success`
    - `didnt_ship`

No additional metadata is required.

---

## Layout Requirements

### Platform
- Desktop only

### Page Structure
- Page title: **52 Apps · 2026**
- Four sections:
  - Q1 (Weeks 1–13)
  - Q2 (Weeks 14–26)
  - Q3 (Weeks 27–39)
  - Q4 (Weeks 40–52)

### Grid
- Each quarter displays exactly 13 cards in a 4-column grid
- Cards arranged as 4 rows (4 + 4 + 4 + 1)
- Cards are uniform in size
- Layout should allow one full quarter to be visible on a standard desktop screen without scrolling

---

## Card Content Requirements

Each card must display:
- Week number
- Date range
- App name (editable)
- Status indicator and status label text

### Visual Hierarchy
1. App name (primary)
2. Status indicator + label (clearly visible)
3. Week number and date (secondary, muted)

---

## Explicit Non-Goals (Anti–Scope Creep)

This app must not include:
- Planning or task management features
- Notes, descriptions, or documentation fields
- Technology stack or implementation metadata
- Analytics, charts, or statistics
- Filters, sorting, or reordering
- Authentication or user accounts
- Mobile optimization
- Animations or gamification

---

## Persistence Requirements
- State must persist across page refreshes
- No requirement for cross-device sync
- No requirement for cloud storage

---

## Stretch Goal (Optional)
- Deploy a live version accessible via URL

The stretch goal must not alter scope, layout, or functionality.

---

## Success Criteria

The app is considered complete when:
- All 52 weeks are visible
- Status cycles correctly via click
- App names are editable
- State persists reliably
- One quarter can be viewed at a glance
- The app feels calm, intentional, and finished
