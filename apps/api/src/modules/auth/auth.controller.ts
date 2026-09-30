import { Body, Controller, HttpCode, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { LoginSchema, RegisterSchema, type AuthTokens, type LoginInput, type RegisterInput } from '@travelpad/contracts';
import { Public } from '../../common/decorators/public.decorator.js';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe.js';
import { env } from '../../config/env.js';
import { AuthService } from './auth.service.js';

const REFRESH_COOKIE = 'travelpad_rt';

/**
 * Web: refresh token nằm trong cookie httpOnly (không lộ cho JS).
 * Mobile: gửi header `X-Client: mobile` → refresh token trả trong body để lưu SecureStore.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body(new ZodValidationPipe(RegisterSchema)) input: RegisterInput, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.respond(await this.auth.register(input, req.headers['user-agent']), req, res);
  }

  @Public()
  @HttpCode(200)
  @Post('login')
  async login(@Body(new ZodValidationPipe(LoginSchema)) input: LoginInput, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.respond(await this.auth.login(input, req.headers['user-agent']), req, res);
  }

  @Public()
  @HttpCode(200)
  @Post('refresh')
  async refresh(@Body() body: { refreshToken?: string }, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = body?.refreshToken ?? req.cookies?.[REFRESH_COOKIE];
    return this.respond(await this.auth.refresh(token, req.headers['user-agent']), req, res);
  }

  @Public()
  @HttpCode(204)
  @Post('logout')
  async logout(@Body() body: { refreshToken?: string }, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.auth.logout(body?.refreshToken ?? req.cookies?.[REFRESH_COOKIE]);
    res.clearCookie(REFRESH_COOKIE, { path: '/v1/auth' });
  }

  private respond(tokens: Required<AuthTokens>, req: Request, res: Response): AuthTokens {
    if (req.headers['x-client'] === 'mobile') return tokens;
    res.cookie(REFRESH_COOKIE, tokens.refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/v1/auth',
      maxAge: env.JWT_REFRESH_TTL_DAYS * 86_400_000,
    });
    return { accessToken: tokens.accessToken, expiresIn: tokens.expiresIn };
  }
}
