import { NestFactory } from '@nestjs/core';
import { MailSenderModule } from './mail-sender.module';
import { RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(MailSenderModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('MAIL'));
  await app.startAllMicroservices();
}
bootstrap();
