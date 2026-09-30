import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { RegisterProviderSchema, type RegisterProviderInput } from '@travelpad/contracts';
import { CurrentUser, type AuthUser } from '../../common/decorators/current-user.decorator.js';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe.js';
import { ProviderRegistrationService } from './provider-registration.service.js';

/** "Dịch vụ của tôi" – mọi route cần đăng nhập. */
@Controller('me/providers')
export class MyProvidersController {
  constructor(private readonly registration: ProviderRegistrationService) {}

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.registration.listMine(user.id);
  }

  @Get(':id')
  detail(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.registration.getMine(user.id, id);
  }

  /** Đăng ký nhà cung cấp mới → chờ duyệt. */
  @Post()
  register(@CurrentUser() user: AuthUser, @Body(new ZodValidationPipe(RegisterProviderSchema)) input: RegisterProviderInput) {
    return this.registration.register(user.id, input);
  }

  /** Sửa hồ sơ đang chờ / bị từ chối rồi gửi lại. */
  @Put(':id')
  resubmit(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body(new ZodValidationPipe(RegisterProviderSchema)) input: RegisterProviderInput) {
    return this.registration.resubmit(user.id, id, input);
  }
}
