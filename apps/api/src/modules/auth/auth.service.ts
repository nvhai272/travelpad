import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'node:crypto';
import * as argon2 from 'argon2';
import type { AuthTokens, LoginInput, RegisterInput } from '@travelpad/contracts';
import { PrismaService } from '../../prisma/prisma.service.js';
import { env } from '../../config/env.js';

const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const ACCESS_TTL_SECONDS = 15 * 60;

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

  async register(input: RegisterInput, userAgent?: string) {
    const exists = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (exists) throw new ConflictException({ code: 'EMAIL_TAKEN', message: 'Email này đã có tài khoản. Bạn thử đăng nhập nhé' });

    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        displayName: input.displayName,
        username: await this.uniqueUsername(input.email),
        passwordHash: await argon2.hash(input.password),
      },
    });
    return this.issue(user.id, user.role, userAgent);
  }

  async login(input: LoginInput, userAgent?: string) {
    const user = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (!user?.passwordHash || !(await argon2.verify(user.passwordHash, input.password))) {
      throw new UnauthorizedException({ code: 'INVALID_CREDENTIALS', message: 'Email hoặc mật khẩu không đúng' });
    }
    return this.issue(user.id, user.role, userAgent);
  }

  /** Refresh token xoay vòng: token cũ bị thu hồi mỗi lần dùng. */
  async refresh(token: string | undefined, userAgent?: string) {
    if (!token) throw new UnauthorizedException({ code: 'NO_REFRESH_TOKEN', message: 'Phiên đăng nhập đã hết hạn, bạn đăng nhập lại nhé' });
    const stored = await this.prisma.refreshToken.findUnique({ where: { tokenHash: sha256(token) }, include: { user: true } });
    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new UnauthorizedException({ code: 'REFRESH_INVALID', message: 'Phiên đăng nhập đã hết hạn, bạn đăng nhập lại nhé' });
    }
    await this.prisma.refreshToken.update({ where: { id: stored.id }, data: { revokedAt: new Date() } });
    return this.issue(stored.userId, stored.user.role, userAgent);
  }

  async logout(token?: string) {
    if (!token) return;
    await this.prisma.refreshToken.updateMany({ where: { tokenHash: sha256(token), revokedAt: null }, data: { revokedAt: new Date() } });
  }

  private async issue(userId: string, role: string, userAgent?: string): Promise<Required<AuthTokens>> {
    const accessToken = await this.jwt.signAsync({ sub: userId, role }, { secret: env.JWT_ACCESS_SECRET, expiresIn: ACCESS_TTL_SECONDS });
    const refreshToken = randomBytes(48).toString('base64url');
    await this.prisma.refreshToken.create({
      data: {
        userId,
        userAgent,
        tokenHash: sha256(refreshToken),
        expiresAt: new Date(Date.now() + env.JWT_REFRESH_TTL_DAYS * 86_400_000),
      },
    });
    return { accessToken, refreshToken, expiresIn: ACCESS_TTL_SECONDS };
  }

  private async uniqueUsername(email: string) {
    const base = email.split('@')[0]!.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 20) || 'user';
    for (let i = 0; ; i++) {
      const candidate = i === 0 ? base : `${base}${Math.floor(Math.random() * 10_000)}`;
      if (!(await this.prisma.user.findUnique({ where: { username: candidate } }))) return candidate;
    }
  }
}
