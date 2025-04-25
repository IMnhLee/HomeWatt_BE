import { Module } from '@nestjs/common';
import { AuthService } from './auth.serivce';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleTokenStrategy } from './strategies/google-token.strategy';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AuthDTO } from '@app/common';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_ACCESS_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
    ClientsModule.register([
      {
        name: AuthDTO.AUTH_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: AuthDTO.AUTH_PACKAGE_NAME,
          protoPath: join(__dirname, '../auth.proto'),
          url: 'auth:50052'
        },
      },
    ]),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, GoogleTokenStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}