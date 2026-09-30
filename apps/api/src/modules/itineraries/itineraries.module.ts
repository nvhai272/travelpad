import { Module } from '@nestjs/common';
import { ItinerariesController } from './itineraries.controller.js';
import { ItinerariesService } from './itineraries.service.js';

@Module({ controllers: [ItinerariesController], providers: [ItinerariesService] })
export class ItinerariesModule {}
