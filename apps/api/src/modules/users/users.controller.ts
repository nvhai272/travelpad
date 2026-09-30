import { Controller, Get, Param } from '@nestjs/common';
import { CurrentUser, type AuthUser } from '../../common/decorators/current-user.decorator.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  me(@CurrentUser() user: AuthUser) {
    return this.users.profile({ id: user.id }, user.id);
  }

  /** Dấu chân của tôi (tab "Của tôi" trên quả cầu). */
  @Get('me/footprints')
  footprints(@CurrentUser() user: AuthUser) {
    return this.users.footprints(user.id);
  }

  @Public()
  @Get(':username')
  byUsername(@Param('username') username: string, @CurrentUser() viewer?: AuthUser) {
    return this.users.profile({ username }, viewer?.id);
  }
}
