# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start dev server at http://localhost:5173
npm run build      # production build → dist/
npm run preview    # serve dist/ locally
npm run lint       # run oxlint
```

No test suite exists yet.

## Architecture

Single-page React app with **client-side state routing** — there is no React Router. `App.jsx` owns a `page` string (`'home' | 'marketplace' | 'detail' | 'investor' | 'government'`) and renders the matching page component. Navigation calls `setPage()` via props. Startup detail requires `selectedStartup` state to be set first; navigating directly to `'detail'` without it renders nothing.

All data is static mock data in `src/data/mockData.js` — two exports: `startups` (10 items, full detail objects) and `portfolioStartups` (2 items for the investor dashboard). There is no API or backend.

## Styling rules

Tailwind CSS v4 via `@tailwindcss/vite` plugin. **No `tailwind.config.js`** — that's the v3 API and will be silently ignored. Custom tokens go in `src/index.css` under `@theme`. Dynamic class names must be complete strings in source; never build them with template literals (e.g. `` `text-${color}-500` ``), or Tailwind won't include them. Use a lookup object instead — see `Badge.jsx` and `StatCard.jsx` for the pattern.

## Design conventions

- Cards: `rounded-2xl border border-slate-200 shadow-sm`, hover `shadow-md border-blue-200`
- Buttons: primary `bg-blue-600 hover:bg-blue-700 text-white rounded-xl`, secondary `border border-slate-200 hover:bg-slate-50`
- Transitions: `transition-all duration-200` for layout, `transition-colors duration-150` for color-only
- Navbar uses `bg-white/80 backdrop-blur-md` — keep it semi-transparent or the blur disappears

## Verifying UI changes

Start the dev server, then run the Playwright driver to screenshot all views:

```bash
npm run dev -- --port 5173 &
sleep 2
node .claude/skills/run-fundbridge/driver.mjs --url=http://localhost:5173 --out=/tmp/fb-ss
```

Read the PNG files with the `Read` tool to visually confirm changes before reporting done.
