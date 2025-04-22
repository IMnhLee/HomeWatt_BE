import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseModule, RmqModule } from '@app/common';
import { UserModule } from './user/user.module';
import { GroupModule } from './group/group.module';
import { MemberGroupModule } from './member_group/member_group.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(5432),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_IDENTITY_QUEUE: Joi.string().required(),
      }),
      envFilePath: './apps/identity/.env',
    }),
    DatabaseModule,
    // RmqModule,
    UserModule,
    GroupModule,
    MemberGroupModule,
  ],
  controllers: [],
  providers: [],
})
export class IdentityModule {}
