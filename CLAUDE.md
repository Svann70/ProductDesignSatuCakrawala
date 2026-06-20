# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **product design repository** for Satu Cakrawala. It contains Product Requirements Documents (PRDs), design system specifications, and HTML/CSS/JS prototypes for internal campus systems. The primary product is an **Academic Schedule Management System** that replaces a fragmented workflow (Mimosa + manual SIAKAD input) with an all-in-one platform.

## Repository Structure

- `PRD-AKADEMIK.md` - Full PRD for the Academic Schedule Management System (requirements, data model, UI references, validation rules)
- `PRD-MEDICAL-PACKAGE.md` - PRD for a separate medical package feature
- `DESIGN.md` - Snowflake design system: color tokens, typography, spacing, shadows, component patterns, accessibility specs
- `taste-SKILL.md` - Anti-slop frontend skill rules for landing pages/portfolios (NOT for dashboard/product UI like this project's prototype)
- `summary.md` - Interview summary and pain points from the academic team
- `revisi.md` - Scope revisions and constraint notes (no Kaprodi approval, no SIAKAD access, sync target TBD)
- `prototype/` - Working HTML/CSS/JS prototype of the academic system

## Key Domain Concepts

- **Dosen** = Lecturer. Inputs preferred teaching days/times at start of semester.
- **Staf Akademik** = Academic staff. The primary user who builds and manages all schedules.
- **Jurusan** = Department/major. Campus is adding 15 new ones, making manual management unsustainable.
- **Ruangan** = Room. Rolling assignment based on dosen preferences and room availability.
- **Kelas Gabungan** = Combined class. Merging students from different jurusan into one room, with auto capacity calculation.
- **Rolling Penempatan Ruangan** = Automatic room allocation that respects dosen preferences and skips occupied slots.

## Prototype Architecture

`prototype/` is a vanilla SPA (no build tools, no frameworks). Open `prototype/index.html` directly in a browser.

**CSS layer** (`prototype/css/`):
- `variables.css` - Snowflake design tokens (colors, spacing, typography, shadows)
- `base.css` - Reset, layout (sidebar + header + content), scrollbar, utilities
- `components.css` - Reusable: buttons, cards, forms, tables, modals, badges, alerts, toasts, tabs
- `pages.css` - Per-page overrides (dashboard stats, jadwal filters, preferensi form, rolling summary)

**JS layer** (`prototype/js/`):
- `data.js` - `DataStore` singleton holding all mock data + CRUD helpers + conflict detection + rolling logic. All pages import this implicitly via script load order.
- `app.js` - `App` singleton: SPA router (`navigate()`), sidebar binding, toast/modal helpers. `el()` utility for DOM creation.
- Each page is a global object (`Dashboard`, `Jadwal`, `Preferensi`, `Rolling`, `Gabungan`, `Sinkronisasi`, `Master`, `Audit`) with a `render(container)` method.

**Script load order matters** - `data.js` and `app.js` must load before page modules.

## Design System (Snowflake)

Primary color: `#29B5E8`. Font: Inter. Base spacing: 8px. Key tokens are in `prototype/css/variables.css`. The design is light, data-forward, blue-accented - optimized for dense tabular data and SQL-style layouts.

Important: `taste-SKILL.md` explicitly excludes dashboards and data tables. Follow `DESIGN.md` for product UI, not taste-SKILL.md.

## Scope Constraints (from revisi.md)

- No Kaprodi approval workflow
- No SIAKAD access (different developer manages it)
- Sync target is TBD (adapter architecture for future integration)
- Dosen must follow rooms assigned by staf akademik
- Room availability filtering is in scope
- Export range: "Hari Ini" (today), "7 Hari Ke Depan" (for classroom walls), "History" (recap)

## Working with PRDs

PRDs contain ASCII UI wireframes in the "UI Reference" section. These are feature/content references only - actual implementation follows the design system tokens, not the ASCII layout.
