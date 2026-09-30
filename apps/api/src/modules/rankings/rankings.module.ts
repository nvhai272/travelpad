import { Module } from '@nestjs/common';
import { MemoryCache } from '../../common/cache/memory-cache.js';
import { CreatorRankingsService } from './creator-rankings.service.js';
import { RankingsController } from './rankings.controller.js';
import { RankingsService } from './rankings.service.js';

@Module({ controllers: [RankingsController], providers: [RankingsService, CreatorRankingsService, MemoryCache] })
export class RankingsModule {}
