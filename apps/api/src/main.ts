import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module.js';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter.js';
import { env } from './config/env.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('trust proxy', env.TRUST_PROXY);
  app.setGlobalPrefix('v1');
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({ origin: env.CORS_ORIGINS.split(','), credentials: true });
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableShutdownHooks();

  const doc = SwaggerModule.createDocument(
    app,
    new DocumentBuilder().setTitle('TravelPad API').setVersion('v1').addBearerAuth().build(),
  );
  SwaggerModule.setup('docs', app, doc);

  await app.listen(env.API_PORT);
  console.log(`API: http://localhost:${env.API_PORT}/v1  ·  Docs: http://localhost:${env.API_PORT}/docs`);
}
void bootstrap();
