import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module.js';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard.js';
import { RolesGuard } from './common/guards/roles.guard.js';
import { HealthModule } from './modules/health/health.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { PlacesModule } from './modules/places/places.module.js';
import { PostsModule } from './modules/posts/posts.module.js';
import { RankingsModule } from './modules/rankings/rankings.module.js';
import { ItinerariesModule } from './modules/itineraries/itineraries.module.js';
import { ProvidersModule } from './modules/providers/providers.module.js';
import { StoriesModule } from './modules/stories/stories.module.js';
import { FollowsModule } from './modules/follows/follows.module.js';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    PlacesModule,
    PostsModule,
    RankingsModule,
    ItinerariesModule,
    ProvidersModule,
    StoriesModule,
    FollowsModule,
    // Phase 1+: JourneysModule, FriendsModule, CommentsModule, MediaModule, NotificationsModule…
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    // Mặc định mọi route cần đăng nhập; route công khai đánh dấu @Public().
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
