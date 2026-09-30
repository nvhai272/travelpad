#!/usr/bin/env node
/**
 * Kiểm tra quy ước clean code của dự án (docs/conventions.md §Cấu trúc code).
 * Chạy: `./dev check` (hoặc `pnpm check:structure` trong container). Thoát mã 1 nếu vi phạm.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SCAN = ['apps/api/src', 'apps/api/prisma/seed', 'apps/web/src', 'packages'];
const SKIP = /node_modules|\/dist\/|\/\.next\//;

/** Giới hạn số dòng theo loại file (quy tắc nào khớp trước thì dùng). */
const LIMITS = [
  { test: /apps\/web\/src\/app\/.*page\.tsx$/, max: 100, why: 'trang Next.js phải mỏng: chỉ tải dữ liệu + ghép component' },
  { test: /\.tsx$/, max: 150, why: 'component React' },
  { test: /\.ts$/, max: 200, why: 'module TypeScript' },
];

/** Luật phụ thuộc giữa các tầng. */
const RULES = [
  { file: /\.controller\.ts$/, forbid: /prisma\.service/, why: 'controller không gọi DB trực tiếp – đi qua service' },
  { file: /\.module\.ts$/, forbid: /@(Controller|Injectable)\(/, why: 'file *.module.ts chỉ khai báo @Module – controller/service để file riêng' },
  { file: /^packages\//, forbid: /from ['"](\.\.\/)+apps\/|from ['"]@travelpad\/(api|web)['"]/, why: 'package dùng chung không được phụ thuộc vào apps' },
  { file: /^apps\/web\//, forbid: /from ['"]@travelpad\/api['"]|apps\/api\//, why: 'web chỉ gọi API qua HTTP (@travelpad/api-client)' },
];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (SKIP.test(p)) continue;
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(name) && !name.endsWith('.d.ts')) out.push(p);
  }
  return out;
}

const problems = [];
for (const base of SCAN) {
  for (const abs of walk(join(ROOT, base))) {
    const file = relative(ROOT, abs);
    const src = readFileSync(abs, 'utf8');
    const lines = src.split('\n').length;
    const limit = LIMITS.find((l) => l.test.test(file));
    if (limit && lines > limit.max) problems.push(`${file}: ${lines} dòng > ${limit.max} (${limit.why})`);
    for (const r of RULES) if (r.file.test(file) && r.forbid.test(src)) problems.push(`${file}: ${r.why}`);
  }
}

if (problems.length) {
  console.error(`✗ ${problems.length} vi phạm quy ước cấu trúc:\n  - ${problems.join('\n  - ')}`);
  process.exit(1);
}
console.log('✓ Cấu trúc code đạt quy ước (độ dài file, phân tầng, phụ thuộc).');
