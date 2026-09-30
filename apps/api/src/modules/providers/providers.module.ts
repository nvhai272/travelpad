import { Module } from '@nestjs/common';
import { AdminProvidersController } from './admin-providers.controller.js';
import { MyProvidersController } from './my-providers.controller.js';
import { ProviderModerationService } from './provider-moderation.service.js';
import { ProviderRatingService } from './provider-rating.service.js';
import { ProviderRegistrationService } from './provider-registration.service.js';
import { ProvidersController } from './providers.controller.js';
import { ProvidersService } from './providers.service.js';

@Module({
  controllers: [ProvidersController, MyProvidersController, AdminProvidersController],
  providers: [ProvidersService, ProviderRatingService, ProviderRegistrationService, ProviderModerationService],
})
export class ProvidersModule {}
