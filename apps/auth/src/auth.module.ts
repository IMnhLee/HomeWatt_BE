import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RedisModule } from './redis/redis.module';
import { UserModule } from './user/user.module';
import * as Joi from 'joi';
import { OAuth2Client } from 'google-auth-library';

@Module({
  imports: [
    RedisModule,
    PassportModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(3001),
        // JWT access token settings
        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_ACCESS_EXPIRATION: Joi.string().default('15m'),
        JWT_ACCESS_EXPIRATION_SECONDS: Joi.number().default(900),
        // JWT refresh token settings
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_REFRESH_EXPIRATION: Joi.string().default('7d'),
        JWT_REFRESH_EXPIRATION_SECONDS: Joi.number().default(604800),
        // Redis connection
        REDIS_URL: Joi.string().required(),
        // Google OAuth
        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_CLIENT_SECRET: Joi.string().required(),
        GOOGLE_CALLBACK_URL: Joi.string().required(),
        // RabbitMQ and microservice connection
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_IDENTITY_QUEUE: Joi.string().required(),
      }),
      envFilePath: './apps/auth/.env',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_ACCESS_EXPIRATION'),
        },
      }),
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: 'GOOGLE_CLIENT',
      useFactory: (configService: ConfigService) => {
        return new OAuth2Client(
          configService.get('GOOGLE_CLIENT_ID'),
          configService.get('GOOGLE_CLIENT_SECRET')
        );
      },
      inject: [ConfigService],
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}