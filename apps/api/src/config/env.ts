import { z } from 'zod';

/** Validate biến môi trường ngay khi khởi động – fail sớm nếu thiếu cấu hình. */
const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string(),
  JWT_ACCESS_SECRET: z.string().min(8),
  JWT_REFRESH_SECRET: z.string().min(8),
  JWT_ACCESS_TTL: z.string().default('15m'),
  JWT_REFRESH_TTL_DAYS: z.coerce.number().default(30),
  CORS_ORIGINS: z.string().default('http://localhost:3000'),
  /** 'true' khi chạy sau proxy (Render, Vercel rewrite) → req.ip lấy từ X-Forwarded-For, rate limit tính đúng từng người. */
  TRUST_PROXY: z.enum(['true', 'false']).default('false').transform((v) => v === 'true'),
});

export const env = EnvSchema.parse(process.env);
export type Env = z.infer<typeof EnvSchema>;
