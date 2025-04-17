import { NestFactory } from '@nestjs/core';
import { IdentityModule } from './identity.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(IdentityModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT') ?? 3000);
  }
bootstrap();
