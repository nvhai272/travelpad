import { SetMetadata } from '@nestjs/common';
import type { AuthUser } from './current-user.decorator.js';

export const ROLES = 'roles';
/** Giới hạn route theo vai trò (VD quản trị duyệt nhà cung cấp). Kiểm tra bởi RolesGuard. */
export const Roles = (...roles: AuthUser['role'][]) => SetMetadata(ROLES, roles);
