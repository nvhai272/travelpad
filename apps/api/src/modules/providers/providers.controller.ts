import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import {
  CreateConnectRequestSchema, CreateReviewSchema, ProviderQuerySchema,
  type CreateConnectRequestInput, type CreateReviewInput, type ProviderQuery,
} from '@travelpad/contracts';
import { CurrentUser, type AuthUser } from '../../common/decorators/current-user.decorator.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe.js';
import { ProvidersService } from './providers.service.js';
import { ProviderRatingService } from './provider-rating.service.js';

@Controller('providers')
export class ProvidersController {
  constructor(private readonly providers: ProvidersService, private readonly rating: ProviderRatingService) {}

  @Public()
  @Get()
  list(@Query(new ZodValidationPipe(ProviderQuerySchema)) q: ProviderQuery) {
    return this.providers.list(q);
  }

  @Public()
  @Get(':slug')
  bySlug(@Param('slug') slug: string) {
    return this.providers.bySlug(slug);
  }

  /** Liên hệ đầy đủ chỉ cho thành viên (route không @Public) – BR-CONN-03. */
  @Get(':id/contact')
  contact(@Param('id') id: string) {
    return this.providers.contact(id);
  }

  @Post(':id/requests')
  request(@Param('id') id: string, @CurrentUser() user: AuthUser, @Body(new ZodValidationPipe(CreateConnectRequestSchema)) input: CreateConnectRequestInput) {
    return this.providers.request(id, user.id, input);
  }

  @Put(':id/reviews/me')
  rate(@Param('id') id: string, @CurrentUser() user: AuthUser, @Body(new ZodValidationPipe(CreateReviewSchema)) input: CreateReviewInput) {
    return this.rating.rate(id, user.id, input);
  }

  @Get(':id/reviews/me')
  mine(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.rating.mine(id, user.id);
  }

  @Delete(':id/reviews/me')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.rating.remove(id, user.id);
  }
}
