import { Controller, Delete, Get, HttpCode, Param, Put } from '@nestjs/common';
import { CurrentUser, type AuthUser } from '../../common/decorators/current-user.decorator.js';
import { FollowsService } from './follows.service.js';

/** Mọi route cần đăng nhập. */
@Controller()
export class FollowsController {
  constructor(private readonly follows: FollowsService) {}

  @Put('users/:username/follow')
  @HttpCode(204)
  follow(@CurrentUser() user: AuthUser, @Param('username') username: string) {
    return this.follows.follow(user.id, username);
  }

  @Delete('users/:username/follow')
  @HttpCode(204)
  unfollow(@CurrentUser() user: AuthUser, @Param('username') username: string) {
    return this.follows.unfollow(user.id, username);
  }

  @Get('me/following')
  following(@CurrentUser() user: AuthUser) {
    return this.follows.following(user.id);
  }
}
