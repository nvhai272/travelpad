import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC } from '../decorators/public.decorator.js';
import { env } from '../../config/env.js';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly jwt: JwtService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [ctx.getHandler(), ctx.getClass()]);
    const req = ctx.switchToHttp().getRequest();
    const [type, token] = (req.headers.authorization ?? '').split(' ');

    if (type === 'Bearer' && token) {
      try {
        const payload = await this.jwt.verifyAsync<{ sub: string; role: string }>(token, { secret: env.JWT_ACCESS_SECRET });
        req.user = { id: payload.sub, role: payload.role };
      } catch {
        if (!isPublic) throw new UnauthorizedException({ code: 'TOKEN_INVALID', message: 'Phiên đăng nhập đã hết hạn, bạn đăng nhập lại nhé' });
      }
    }
    if (!isPublic && !req.user) throw new UnauthorizedException({ code: 'UNAUTHENTICATED', message: 'Bạn cần đăng nhập để tiếp tục' });
    return true;
  }
}
