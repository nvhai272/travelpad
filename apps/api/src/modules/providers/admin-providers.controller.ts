import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApproveProviderSchema, ProviderStatusSchema, RejectProviderSchema,
  type ApproveProviderInput, type ProviderStatus, type RejectProviderInput,
} from '@travelpad/contracts';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe.js';
import { ProviderModerationService } from './provider-moderation.service.js';

/** Hàng đợi duyệt nhà cung cấp – chỉ quản trị & kiểm duyệt viên. */
@Controller('admin/providers')
@Roles('ADMIN', 'MODERATOR')
export class AdminProvidersController {
  constructor(private readonly moderation: ProviderModerationService) {}

  @Get()
  list(@Query('status', new ZodValidationPipe(ProviderStatusSchema.default('pending'))) status: ProviderStatus) {
    return this.moderation.list(status);
  }

  @Post(':id/approve')
  approve(@Param('id') id: string, @Body(new ZodValidationPipe(ApproveProviderSchema)) input: ApproveProviderInput) {
    return this.moderation.approve(id, input);
  }

  @Post(':id/reject')
  reject(@Param('id') id: string, @Body(new ZodValidationPipe(RejectProviderSchema)) input: RejectProviderInput) {
    return this.moderation.reject(id, input);
  }
}
