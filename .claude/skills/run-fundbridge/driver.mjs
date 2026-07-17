/**
 * FundBridge smoke driver — runs headless Playwright against the dev server.
 * Usage: node .claude/skills/run-fundbridge/driver.mjs [--url URL] [--out DIR]
 *
 * Outputs screenshots to OUT (default /tmp/fundbridge-screenshots).
 * Expects the dev server to already be running (npm run dev).
 */

import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const args = process.argv.slice(2);
const BASE = args.find(a => a.startsWith('--url='))?.split('=')[1] ?? 'http://localhost:5173';
const OUT  = args.find(a => a.startsWith('--out='))?.split('=')[1] ?? '/tmp/fundbridge-screenshots';

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 900 });

// 1. Landing page
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.screenshot({ path: `${OUT}/01-landing.png` });
console.log('01-landing.png');

// 2. Marketplace (via nav)
await page.click('text=Startups');
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}/02-marketplace.png` });
console.log('02-marketplace.png');

// 3. Search filter
await page.fill('input[placeholder*="Search"]', 'Climate');
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/03-marketplace-search.png` });
console.log('03-marketplace-search.png');
await page.fill('input[placeholder*="Search"]', '');

// 4. Startup detail
await page.click('text=View Startup');
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}/04-startup-detail.png` });
console.log('04-startup-detail.png');

// 5. Proposal modal
const propose = page.locator('button', { hasText: /propose|invest/i }).first();
if (await propose.count() > 0) {
  await propose.click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/05-proposal-modal.png` });
  console.log('05-proposal-modal.png');
  await page.keyboard.press('Escape');
}

// 6. Investor Dashboard
await page.click('text=Investor Dashboard');
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}/06-investor-dashboard.png` });
console.log('06-investor-dashboard.png');

// 7. Government Dashboard
await page.click('text=Government Dashboard');
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}/07-government-dashboard.png` });
console.log('07-government-dashboard.png');

await browser.close();
console.log(`\nDone — screenshots in ${OUT}`);
