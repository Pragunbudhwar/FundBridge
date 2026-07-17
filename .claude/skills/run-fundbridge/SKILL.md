---
name: run-fundbridge
description: Run, start, build, screenshot, or test the FundBridge app. Use when asked to launch the app, verify a UI change, take a screenshot, or drive a user flow.
---

FundBridge is a React + Vite SPA — a marketplace connecting government-backed startups with private investors. It has five views: Landing, Startup Marketplace, Startup Detail, Investor Dashboard, and Government Dashboard. The agent path is: start the dev server, then run `.claude/skills/run-fundbridge/driver.mjs` with Playwright headless to screenshot and interact.

## Prerequisites

Node 18+ (project uses Node 24 in dev). Playwright's chromium headless shell must be installed once:

```bash
npx playwright install chromium
```

Playwright itself is already in `devDependencies` — `npm install` is sufficient.

## Build

```bash
npm install
```

No separate compile step for dev. Production build:

```bash
npm run build   # outputs to dist/
```

## Run (agent path)

**Step 1 — start the dev server in the background:**

```bash
npm run dev -- --port 5173 &
sleep 2
```

The server is ready when it prints `VITE … ready`.

**Step 2 — run the driver:**

```bash
node .claude/skills/run-fundbridge/driver.mjs --url=http://localhost:5173 --out=/tmp/fb-ss
```

The driver navigates through every major view in order and writes numbered PNGs to `--out`:

| File | View |
|---|---|
| 01-landing.png | Landing / hero |
| 02-marketplace.png | Startup Marketplace (all 10 cards) |
| 03-marketplace-search.png | Marketplace with "Climate" search active |
| 04-startup-detail.png | GreenCell AI detail page |
| 05-proposal-modal.png | Investment proposal modal |
| 06-investor-dashboard.png | Investor Dashboard with portfolio |
| 07-government-dashboard.png | Government Dashboard |

Read the screenshots with the `Read` tool to visually verify changes.

**Taking a single targeted screenshot** — run the driver then read a specific file:

```bash
node .claude/skills/run-fundbridge/driver.mjs --url=http://localhost:5173
```

Then `Read /tmp/fundbridge-screenshots/02-marketplace.png`.

## Run (human path)

```bash
npm run dev
# opens http://localhost:5173 in your browser
```

Not useful headless — use the driver above instead.

## Gotchas

- **`playwright` import fails from `/tmp/`** — the script must run from inside the project directory (or somewhere with `node_modules/playwright` resolvable). The driver at `.claude/skills/run-fundbridge/driver.mjs` is inside the project, so `node .claude/skills/run-fundbridge/driver.mjs` from the project root always works.
- **Port conflict** — Vite defaults to 5173 but increments if busy. Pass `--port 5173` explicitly to pin it: `npm run dev -- --port 5173`. Pass the matching `--url` to the driver.
- **No `<select>` filter in marketplace** — the filter is a text search input (`<input placeholder="Search by startup name, sector…">`), not a `<select>`. Selector `select.first()` returns nothing.
- **Startup detail requires navigating from Marketplace** — there's no direct URL for detail views; state is managed in React. The driver clicks "View Startup" on the first card.
- **Proposal modal needs a "Propose Investment" button on the detail page** — it only appears when a startup is selected. The driver clicks it after landing on the detail page.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `Cannot find package 'playwright'` | Run the driver from the project root, not `/tmp/` |
| Screenshot is blank / white | Dev server not ready yet — increase `sleep` before running driver, or poll `curl -s http://localhost:5173` |
| `net::ERR_CONNECTION_REFUSED` | Dev server isn't running; start it first |
| `npx playwright install chromium` hangs | Check disk space; the chromium-headless-shell download is ~94 MB |
