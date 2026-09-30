import { Controller, Delete, HttpCode, Param, Put } from '@nestjs/common';
import { CurrentUser, type AuthUser } from '../../common/decorators/current-user.decorator.js';
import { ReviewHelpfulService } from './review-helpful.service.js';

@Controller('reviews')
export class ReviewHelpfulController {
  constructor(private readonly helpful: ReviewHelpfulService) {}

  @Put(':id/helpful')
  @HttpCode(204)
  mark(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.helpful.mark(id, user.id);
  }

  @Delete(':id/helpful')
  @HttpCode(204)
  unmark(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.helpful.unmark(id, user.id);
  }
}
