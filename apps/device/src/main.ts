import { NestFactory } from '@nestjs/core';
import { DeviceModule } from './device.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { EnergyITF, EPriceITF, FloorITF, LineITF, MonitoringITF, RoomITF } from '@app/common';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    DeviceModule,
    {
      transport: Transport.GRPC,
      options: {
        url: '0.0.0.0:50054',
        protoPath: [
          join(__dirname, '../monitoring.proto'),
          join(__dirname, '../line.proto'),
          join(__dirname, '../floor.proto'),
          join(__dirname, '../room.proto'),
          join(__dirname, '../eprice.proto'),
          join(__dirname, '../energy.proto'),
        ],
        package: [
          MonitoringITF.MONITORING_PACKAGE_NAME,
          LineITF.LINE_PACKAGE_NAME,
          FloorITF.FLOOR_PACKAGE_NAME,
          RoomITF.ROOM_PACKAGE_NAME,
          EPriceITF.E_PRICE_PACKAGE_NAME,
          EnergyITF.ENERGY_RECORD_PACKAGE_NAME,
        ],
      },
    },
  );
  await app.listen();
}
bootstrap();
