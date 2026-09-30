import { Controller, Delete, Get, HttpCode, Param, Put, Query } from '@nestjs/common';
import { PostQuerySchema, type PostQuery } from '@travelpad/contracts';
import { CurrentUser, type AuthUser } from '../../common/decorators/current-user.decorator.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe.js';
import { PostsService } from './posts.service.js';

@Controller('posts')
export class PostsController {
  constructor(private readonly posts: PostsService) {}

  @Public()
  @Get()
  feed(@Query(new ZodValidationPipe(PostQuerySchema)) q: PostQuery, @CurrentUser() viewer?: AuthUser) {
    return this.posts.feed(q, viewer?.id);
  }

  @Public()
  @Get(':slug')
  bySlug(@Param('slug') slug: string, @CurrentUser() viewer?: AuthUser) {
    return this.posts.bySlug(slug, viewer?.id);
  }

  @Put(':id/like') @HttpCode(204)
  like(@Param('id') id: string, @CurrentUser() u: AuthUser) { return this.posts.setLike(id, u.id, true); }

  @Delete(':id/like') @HttpCode(204)
  unlike(@Param('id') id: string, @CurrentUser() u: AuthUser) { return this.posts.setLike(id, u.id, false); }

  @Put(':id/bookmark') @HttpCode(204)
  save(@Param('id') id: string, @CurrentUser() u: AuthUser) { return this.posts.setBookmark(id, u.id, true); }

  @Delete(':id/bookmark') @HttpCode(204)
  unsave(@Param('id') id: string, @CurrentUser() u: AuthUser) { return this.posts.setBookmark(id, u.id, false); }

  // TODO(Phase 1): POST /posts, GET/POST /posts/:id/comments (tách CommentsModule)
}
