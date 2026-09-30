import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES } from '../decorators/roles.decorator.js';
import type { AuthUser } from '../decorators/current-user.decorator.js';

/** Chạy sau JwtAuthGuard: route có @Roles(...) chỉ cho vai trò tương ứng. */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<AuthUser['role'][] | undefined>(ROLES, [ctx.getHandler(), ctx.getClass()]);
    if (!roles?.length) return true;
    const user: AuthUser | undefined = ctx.switchToHttp().getRequest().user;
    if (user && roles.includes(user.role)) return true;
    throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Bạn không có quyền làm việc này' });
  }
}
