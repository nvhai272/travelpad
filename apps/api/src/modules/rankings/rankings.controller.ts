import { Controller, Get, Query } from '@nestjs/common';
import {
  CreatorRankingQuerySchema, ProviderRankingQuerySchema, RankingQuerySchema,
  type CreatorRankingQuery, type ProviderRankingQuery, type RankingQuery,
} from '@travelpad/contracts';
import { Public } from '../../common/decorators/public.decorator.js';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe.js';
import { CreatorRankingsService } from './creator-rankings.service.js';
import { RankingsService } from './rankings.service.js';

@Controller('rankings')
export class RankingsController {
  constructor(private readonly rankings: RankingsService, private readonly creators: CreatorRankingsService) {}

  /** Top địa điểm theo tổng số người vote (toàn thời gian). */
  @Public()
  @Get('places')
  places(@Query(new ZodValidationPipe(RankingQuerySchema)) q: RankingQuery) {
    return this.rankings.mostVotedPlaces(q.limit);
  }

  /** Dịch vụ du lịch uy tín (vote sao các mục Kết nối du lịch). */
  @Public()
  @Get('providers')
  providers(@Query(new ZodValidationPipe(ProviderRankingQuerySchema)) q: ProviderRankingQuery) {
    return this.rankings.trustedProviders(q.limit, q.group);
  }

  /** Top người đóng góp: ?by=likes (tổng tim bài chia sẻ) | helpful (tổng "Hữu ích" nhận xét). */
  @Public()
  @Get('creators')
  creatorRanking(@Query(new ZodValidationPipe(CreatorRankingQuerySchema)) q: CreatorRankingQuery) {
    return q.by === 'likes' ? this.creators.byLikes(q.limit) : this.creators.byHelpful(q.limit);
  }
}
