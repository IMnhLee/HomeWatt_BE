import { DatabaseModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { Room } from './entities/room.entity';
import { Floor } from './entities/floor.entity';
import { Line } from './entities/line.entity';
import { Monitoring } from './entities/monitoring.entity';
import { MonitoringService } from './monitoring/monitoring.service';
import { LineService } from './line/line.service';
import { FloorService } from './floor/floor.service';
import { RoomService } from './room/room.service';
import { MonitoringController } from './monitoring/monitoring.controller';
import { LineController } from './line/line.controller';
import { MonitoringRepository } from './monitoring/monitoring.repository';
import { LineRepository } from './line/line.repository';
import { FloorRepository } from './floor/floor.repository';
import { RoomRepository } from './room/room.repository';
import { FloorController } from './floor/floor.controller';
import { RoomController } from './room/room.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(5432),
        DB_DIALECT: Joi.string().valid('postgres').default('postgres'),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
      }),
      envFilePath: './apps/device/.env',
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([Line, Floor, Room, Monitoring]),
    // RmqModule,
  ],
  controllers: [MonitoringController, LineController, FloorController, RoomController],
  providers: [
    MonitoringService,
    LineService,
    FloorService,
    RoomService,
    MonitoringRepository,
    LineRepository,
    FloorRepository,
    RoomRepository
  ],
})
export class DeviceModule {}
