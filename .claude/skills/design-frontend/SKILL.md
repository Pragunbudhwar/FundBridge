---
name: design-frontend
description: UI/UX design and frontend work for FundBridge. Use when asked to improve design, restyle a component, change layout, fix spacing, update colors, improve UX, make the UI look better, or review the visual design of any page or component.
---

FundBridge is a React + Vite SPA styled exclusively with **Tailwind CSS v4**. There is no separate design token file — all design decisions live as Tailwind utility classes directly in `.jsx` files. When making any visual change, always screenshot before and after to verify the result.

## Tech stack

| Layer | Tool |
|---|---|
| Framework | React 19 |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite` plugin) |
| Font | Inter (system fallback stack in `src/index.css`) |
| Build | Vite 8 |
| No CSS Modules, no styled-components, no Sass |

## Design system — what exists today

### Color palette (Tailwind semantic usage)

| Role | Class |
|---|---|
| Primary action | `bg-blue-600`, hover `bg-blue-700` |
| Background | `bg-slate-50` (page), `bg-white` (cards) |
| Border | `border-slate-200`, hover `border-blue-200` |
| Text primary | `text-slate-900` |
| Text secondary | `text-slate-500`, `text-slate-600` |
| Success / tax | `text-emerald-600`, `bg-emerald-50` |
| Risk high | `bg-red-50 text-red-700` |
| Risk medium | `bg-amber-50 text-amber-700` |
| Risk low | `bg-emerald-50 text-emerald-700` |

### Shared components

**`src/components/Badge.jsx`** — pill labels with named variants:
`sector` | `stage` | `tax` | `equity` | `risk_high` | `risk_medium` | `risk_medium_high` | `risk_low` | `success` | `pending`

Add a new variant by adding an entry to the `variants` object in `Badge.jsx`.

**`src/components/StatCard.jsx`** — KPI card with colored accent bar. Props: `label`, `value`, `sub`, `accent` (blue / indigo / emerald / amber / red / violet).

**`src/components/ProgressBar.jsx`** — milestone progress bar.

**`src/components/Navbar.jsx`** — sticky top nav, `bg-white/80 backdrop-blur-md`. Active link: `bg-blue-50 text-blue-700`.

**`src/components/StartupCard.jsx`** — marketplace card. `rounded-2xl border border-slate-200 shadow-sm`, hover lifts shadow and turns border blue.

### Pages

| File | Route (state) | Description |
|---|---|---|
| `src/pages/Landing.jsx` | `home` | Hero, stat row, feature pillars |
| `src/pages/Marketplace.jsx` | `marketplace` | Search + 3-column card grid |
| `src/pages/StartupDetail.jsx` | `detail` | Full startup detail + invest CTA |
| `src/pages/InvestorDashboard.jsx` | `investor` | Portfolio, proposal activity, simulation |
| `src/pages/GovernmentDashboard.jsx` | `government` | Oversight metrics |

## Workflow for any UI/UX change

1. **Screenshot the current state** so you have a before:
   ```bash
   npm run dev -- --port 5173 &
   sleep 2
   node .claude/skills/run-fundbridge/driver.mjs --url=http://localhost:5173 --out=/tmp/fb-before
   ```

2. **Edit the component** — use Tailwind utilities only, no inline styles except for dynamic values (e.g. `style={{ width: \`${score}%\` }}`).

3. **Screenshot after** and read the image to verify:
   ```bash
   node .claude/skills/run-fundbridge/driver.mjs --url=http://localhost:5173 --out=/tmp/fb-after
   ```
   Then `Read /tmp/fb-after/<relevant-screenshot>.png`.

4. If something looks off — iterate on the classes, re-screenshot, re-read.

## Design conventions to follow

- **Rounded corners**: cards use `rounded-2xl`, buttons `rounded-xl`, badges `rounded-full`, small elements `rounded-lg`.
- **Shadows**: default `shadow-sm`, hover states `shadow-md`. Never `shadow-lg` or higher on cards.
- **Spacing**: use Tailwind scale (`p-6`, `gap-4`, `mt-1`) — no arbitrary values like `p-[22px]` unless there's a real reason.
- **Typography**: headings `font-semibold` or `font-bold`, body `text-sm`, captions `text-xs`. Never use font sizes outside the Tailwind scale.
- **Buttons**: primary = `bg-blue-600 hover:bg-blue-700 text-white`, secondary = `border border-slate-200 hover:bg-slate-50`. Always include a hover and transition class.
- **Transitions**: use `transition-all duration-200` for layout changes, `transition-colors duration-150` for color-only changes.
- **No hardcoded hex colors** — always use Tailwind palette names so the design stays consistent.

## Adding a new component

Create it in `src/components/`. Follow the existing pattern:
- Functional component, default export
- Props destructured at the top
- Tailwind utilities only
- No internal state unless the component truly owns it

## Gotchas

- **Tailwind v4 — no `tailwind.config.js`**: Config is done via CSS `@theme` in `src/index.css` if you need custom tokens. Don't create a `tailwind.config.js` — it's the v3 API and won't be picked up.
- **Dynamic class names must be complete strings**: Tailwind v4 still needs full class names present in source. Don't build class names with string interpolation like `` `text-${color}-500` `` — write out each variant explicitly (in a lookup object, as in `Badge.jsx` and `StatCard.jsx`).
- **`backdrop-blur-md` on Navbar** needs `bg-white/80` (semi-transparent) to be visible — don't change Navbar background to fully opaque white or the blur effect disappears.
