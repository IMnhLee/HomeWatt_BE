import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AuthDTO } from '@app/common';
// import { RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.GRPC,
      options: {
        url: '0.0.0.0:50052',
        protoPath: join(__dirname, '../auth.proto'),
        package: AuthDTO.AUTH_PACKAGE_NAME,
      },
    },
  );
  app.listen();
}
bootstrap();
