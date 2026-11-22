// Regenerates public/Meredith-McGee-CV.pdf from scripts/cv/cv.html.
// Needs Playwright with Chromium (npm i -D playwright, then npx playwright install chromium).
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const here = path.dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('file://' + path.join(here, 'cv.html'), { waitUntil: 'networkidle' });
await page.pdf({ path: path.join(here, '../../public/Meredith-McGee-CV.pdf'), format: 'Letter', preferCSSPageSize: true, printBackground: true });
await browser.close();
console.log('Wrote public/Meredith-McGee-CV.pdf');
