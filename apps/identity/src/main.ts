import { NestFactory } from '@nestjs/core';
import { IdentityModule } from './identity.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { RmqService } from '@app/common';
import { MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(IdentityModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  
  const configService = app.get(ConfigService);
  const rmqService = app.get<RmqService>(RmqService);
  
  // Set up as microservice
  app.connectMicroservice<MicroserviceOptions>(
    rmqService.getOptions('IDENTITY', true)
  );
  
  await app.startAllMicroservices();
  await app.listen(configService.get('PORT') ?? 3000);
}
bootstrap();
