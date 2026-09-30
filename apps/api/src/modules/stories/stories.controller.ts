import { Controller, Get, Query, UnauthorizedException } from '@nestjs/common';
import { StoryQuerySchema, type StoryQuery } from '@travelpad/contracts';
import { CurrentUser, type AuthUser } from '../../common/decorators/current-user.decorator.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe.js';
import { StoriesService } from './stories.service.js';

@Controller('stories')
export class StoriesController {
  constructor(private readonly stories: StoriesService) {}

  /** Công khai; riêng `following=true` cần đăng nhập. */
  @Public()
  @Get()
  list(@Query(new ZodValidationPipe(StoryQuerySchema)) q: StoryQuery, @CurrentUser() viewer?: AuthUser) {
    if (q.following && !viewer) throw new UnauthorizedException({ code: 'UNAUTHENTICATED', message: 'Bạn cần đăng nhập để tiếp tục' });
    return this.stories.list(q, viewer?.id);
  }
}
