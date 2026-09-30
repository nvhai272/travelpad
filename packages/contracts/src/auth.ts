import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(72),
  displayName: z.string().min(2).max(50),
});
export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});
export type LoginInput = z.infer<typeof LoginSchema>;

export const AuthTokensSchema = z.object({
  accessToken: z.string(),
  /** Web nhận refresh token qua cookie httpOnly; mobile nhận trong body. */
  refreshToken: z.string().optional(),
  expiresIn: z.number(),
});
export type AuthTokens = z.infer<typeof AuthTokensSchema>;
