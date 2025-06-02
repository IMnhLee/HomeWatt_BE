import { EnergyITF, EPriceITF, FloorITF, LineITF, MonitoringITF, RoomITF } from '@app/common';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { MonitoringController } from './controller/monitoring.controller';
import { LineController } from './controller/line.controller';
import { FloorController } from './controller/floor.controller';
import { RoomController } from './controller/room.controller';
import { MonitoringService } from './service/monitoring.service';
import { LineService } from './service/line.service';
import { FloorService } from './service/floor.service';
import { RoomService } from './service/room.service';
import { EpriceConfigController } from './controller/epriceConfig.controller';
import { EpriceConfigService } from './service/epriceConfig.service';
import { EnergyController } from './controller/energy.controller';
import { EnergyService } from './service/energy.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MonitoringITF.MONITORING_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: MonitoringITF.MONITORING_PACKAGE_NAME,
          protoPath: join(__dirname, '../monitoring.proto'),
          url: 'device:50054'
        },
      },
      {
        name: LineITF.LINE_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: LineITF.LINE_PACKAGE_NAME,
          protoPath: join(__dirname, '../line.proto'),
          url: 'device:50054'
        },
      },
      {
        name: FloorITF.FLOOR_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: FloorITF.FLOOR_PACKAGE_NAME,
          protoPath: join(__dirname, '../floor.proto'),
          url: 'device:50054'
        },
      },
      {
        name: RoomITF.ROOM_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: RoomITF.ROOM_PACKAGE_NAME,
          protoPath: join(__dirname, '../room.proto'),
          url: 'device:50054'
        },
      },
      {
        name: EPriceITF.E_PRICE_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: EPriceITF.E_PRICE_PACKAGE_NAME,
          protoPath: join(__dirname, '../eprice.proto'),
          url: 'device:50054'
        },
      },
      {
        name: EnergyITF.ENERGY_RECORD_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: EnergyITF.ENERGY_RECORD_PACKAGE_NAME,
          protoPath: join(__dirname, '../energy.proto'),
          url: 'device:50054'
        },
      }
    ]),
  ],
  controllers: [MonitoringController, LineController, FloorController, RoomController, EpriceConfigController, EnergyController],
  providers: [MonitoringService, LineService, FloorService, RoomService, EpriceConfigService, EnergyService],
})
export class DeviceModule {}
