import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC = 'isPublic';
/** Route công khai (không bắt buộc đăng nhập). Nếu có token hợp lệ vẫn gắn req.user. */
export const Public = () => SetMetadata(IS_PUBLIC, true);
