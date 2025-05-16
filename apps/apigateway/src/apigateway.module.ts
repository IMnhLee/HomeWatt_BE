import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_ACCESS_SECRET: Joi.string().required(),
        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_CLIENT_SECRET: Joi.string().required(),
        GOOGLE_CALLBACK_URL: Joi.string().required(),
        AUTH_GRPC_URL: Joi.string().required(),
        IDENTITY_GRPC_URL: Joi.string().required(),
        PORT: Joi.number().default(3000),
      }),
      envFilePath: './apps/apigateway/.env',
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class apigatewayModule {}
