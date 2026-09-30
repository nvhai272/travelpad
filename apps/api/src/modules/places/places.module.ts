import { Module } from '@nestjs/common';
import { PlacesController } from './places.controller.js';
import { PlacesService } from './places.service.js';
import { PlaceRatingService } from './place-rating.service.js';
import { ReviewHelpfulController } from './review-helpful.controller.js';
import { ReviewHelpfulService } from './review-helpful.service.js';

@Module({
  controllers: [PlacesController, ReviewHelpfulController],
  providers: [PlacesService, PlaceRatingService, ReviewHelpfulService],
})
export class PlacesModule {}
