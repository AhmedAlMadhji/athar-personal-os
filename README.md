# Self Profile System

A lightweight personal knowledge base for tracking strengths, weaknesses, skills, and reflections over time. All data is stored locally in your browser using IndexedDB — no backend, no authentication.

## Tech Stack

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Dexie.js** (IndexedDB wrapper)
- **Recharts** (data visualization)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you will be redirected to `/en` automatically (or use `/ar` for Arabic).

> **Note:** Do not use old paths like `/add` or `/timeline` without the locale prefix. Use `/en/add`, `/ar/timeline`, etc.

## Languages

- **English** (`/en`) — LTR
- **Arabic** (`/ar`) — RTL with full UI translation

Use the language switcher in the sidebar. Your preference is saved in `localStorage` (language only — app data stays in IndexedDB).

## Desktop App (Electron)

Run the app as a native desktop window:

```bash
npm run desktop
```

This starts the Next.js dev server, waits for [http://localhost:3000](http://localhost:3000), then opens Electron automatically.

Other commands:

- `npm run electron` — Open Electron only (Next.js must already be running)
- `npm run dev` — Browser-only development

## Features

- **Dashboard** — Animated stats, growth pulse, and recent entries
- **Analytics** — Growth line chart, distribution pie chart, activity heatmap, and insights
- **Add Entry** — Create strengths, weaknesses, skills, or notes
- **Timeline** — Browse all entries with type and tag filters
- **Detail Page** — View, edit, or delete individual entries
- **Export Profile** — Download all data as grouped JSON

## Data Storage

Database name: `self-profile-db`

All CRUD operations go through the service layer:

- `src/lib/db.ts` — Dexie database setup
- `src/lib/entriesService.ts` — Entry CRUD and export logic

No LocalStorage is used. Application data persists only in IndexedDB.

## Project Structure

```
electron/
└── main.js           # Electron main process
src/
├── app/              # Next.js pages
├── components/       # UI components
├── lib/              # Database & services
└── types/            # TypeScript types
```

## Build for Production

```bash
npm run build
npm start
```
