import { Body, Controller, Delete, Get, Param, Put, Query } from '@nestjs/common';
import { CreateReviewSchema, CursorQuerySchema, PlaceQuerySchema, type CreateReviewInput, type CursorQuery, type PlaceQuery } from '@travelpad/contracts';
import { CurrentUser, type AuthUser } from '../../common/decorators/current-user.decorator.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe.js';
import { PlacesService } from './places.service.js';
import { PlaceRatingService } from './place-rating.service.js';

@Controller('places')
export class PlacesController {
  constructor(private readonly places: PlacesService, private readonly rating: PlaceRatingService) {}

  @Public()
  @Get()
  list(@Query(new ZodValidationPipe(PlaceQuerySchema)) q: PlaceQuery) {
    return this.places.list(q);
  }

  @Public()
  @Get(':slug')
  bySlug(@Param('slug') slug: string, @CurrentUser() viewer?: AuthUser) {
    return this.places.bySlug(slug, viewer?.id);
  }

  @Public()
  @Get(':id/reviews')
  reviews(@Param('id') id: string, @Query(new ZodValidationPipe(CursorQuerySchema)) q: CursorQuery) {
    return this.places.reviews(id, q);
  }

  /** Vote sao của tôi – tạo hoặc sửa (1 vote/người/địa điểm). */
  @Put(':id/reviews/me')
  rate(@Param('id') id: string, @CurrentUser() user: AuthUser, @Body(new ZodValidationPipe(CreateReviewSchema)) input: CreateReviewInput) {
    return this.rating.upsertMine(id, user.id, input);
  }

  @Get(':id/reviews/me')
  myRating(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.rating.getMine(id, user.id);
  }

  @Delete(':id/reviews/me')
  removeRating(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.rating.removeMine(id, user.id);
  }
}
