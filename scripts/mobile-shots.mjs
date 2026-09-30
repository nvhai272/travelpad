#!/usr/bin/env node
/**
 * Chụp màn hình giao diện điện thoại để review thiết kế mobile (chạy trong Docker Playwright – xem `./dev shots`).
 * Env: BASE (mặc định http://localhost:3000), API (http://localhost:4000/v1), OUT (.shots), PAGES (danh sách, phẩy),
 *      LOGIN_EMAIL / LOGIN_PASSWORD (tài khoản dev để chụp trạng thái đã đăng nhập), FULL=1 (chụp cả trang),
 *      DEVICE=desktop (1440×900) | wide (1920×1080) – mặc định iPhone 14.
 */
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';

const { chromium, devices } = createRequire(`${process.env.PW_DIR ?? '/tmp/pw'}/`)('playwright');
const BASE = process.env.BASE ?? 'http://localhost:3000';
const API = process.env.API ?? 'http://localhost:4000/v1';
const OUT = process.env.OUT ?? '.shots';
const PAGES = (process.env.PAGES ?? '/,/map,/itinerary?destination=sa-pa&days=2,/connect,/connect/huong-dan-vien-a-su,/places/dinh-fansipan,/stories,/u/hoanglong').split(',');
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
async function shoot(label, login) {
  const sizes = { desktop: { width: 1440, height: 900 }, wide: { width: 1920, height: 1080 } };
  const device = sizes[process.env.DEVICE] ? { viewport: sizes[process.env.DEVICE] } : devices['iPhone 14'];
  const ctx = await browser.newContext({ ...device, locale: 'vi-VN' });
  if (login) await ctx.request.post(`${API}/auth/login`, { data: login }); // cookie refresh → web tự khôi phục phiên
  const page = await ctx.newPage();
  for (const path of PAGES) {
    await page.goto(BASE + path, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    const name = `${label}${path.replace(/[/?&=]+/g, '_') || '_home'}`.replace(/_+$/, '');
    await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: process.env.FULL === '1' });
    console.log(`✓ ${OUT}/${name}.png`);
  }
  await ctx.close();
}

await shoot('guest', null);
if (process.env.LOGIN_EMAIL) await shoot('member', { email: process.env.LOGIN_EMAIL, password: process.env.LOGIN_PASSWORD });
await browser.close();
