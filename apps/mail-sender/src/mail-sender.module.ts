import { Module } from '@nestjs/common';
import { MailSenderController } from './mail-sender.controller';
import { MailSenderService } from './mail-sender.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { RmqModule } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_MAIL_QUEUE: Joi.string().required(),
        MAIL_HOST: Joi.string().required(),
        MAIL_PORT: Joi.number().required(),
        MAIL_SECURE: Joi.boolean().required(),
        MAIL_USER: Joi.string().required(),
        MAIL_PASSWORD: Joi.string().required(),
        MAIL_FROM_NAME: Joi.string().required(),
        MAIL_FROM_ADDRESS: Joi.string().required(),
        FRONTEND_URL: Joi.string().required(),
      }),
    }),
    RmqModule,
  ],
  controllers: [MailSenderController],
  providers: [MailSenderService],
})
export class MailSenderModule {}
