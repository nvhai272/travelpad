import { Controller, Get, Query } from '@nestjs/common';
import { ItineraryQuerySchema, type ItineraryQuery } from '@travelpad/contracts';
import { Public } from '../../common/decorators/public.decorator.js';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe.js';
import { ItinerariesService } from './itineraries.service.js';

@Controller('itineraries')
export class ItinerariesController {
  constructor(private readonly itineraries: ItinerariesService) {}

  /** Khách dùng được (khám phá); lưu thành hành trình mới cần đăng nhập (TL-506). */
  @Public()
  @Get('suggest')
  suggest(@Query(new ZodValidationPipe(ItineraryQuerySchema)) q: ItineraryQuery) {
    return this.itineraries.suggest(q);
  }
}
