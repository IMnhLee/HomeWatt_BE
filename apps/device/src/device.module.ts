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
import { EPriceService } from './e_price/e_price.service';
import { OnePriceRepository } from './e_price/e_price.repository/one_price.repository';
import { StairPriceRepository } from './e_price/e_price.repository/stair_price.repository';
import { PercentPriceRepository } from './e_price/e_price.repository/percent_price.repository';
import { EPriceController } from './e_price/e_price.controller';
import { OnePriceConfig } from './entities/one-price-config.entity';
import { PercentPriceConfig } from './entities/percent-price-config.entity';
import { StairPriceConfig } from './entities/stair-price-config.entity';
import { SettingRepository } from './setting/setting.repository';
import { Setting } from './entities/setting.entity';
import { RedisModule } from './energy_record/redis/redis.module';
import { EnergyRecord } from './entities/energy-record.entity';
import { EnergyRecordController } from './energy_record/energy_record.controller';
import { EnergyRecordService } from './energy_record/energy_record.service';
import { EnergyRecordRepository } from './energy_record/energy_record.repository';
import { ConsumptionService } from './energy_record/consumpton.service';

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
    TypeOrmModule.forFeature([Line, Floor, Room, Monitoring, OnePriceConfig, PercentPriceConfig, StairPriceConfig, Setting, EnergyRecord]),
    // RmqModule,
    RedisModule
  ],
  controllers: [MonitoringController, LineController, FloorController, RoomController, EPriceController,EnergyRecordController],
  providers: [
    MonitoringService,
    LineService,
    FloorService,
    RoomService,
    EPriceService,
    EnergyRecordService,
    ConsumptionService,
    MonitoringRepository,
    LineRepository,
    FloorRepository,
    RoomRepository,
    OnePriceRepository,
    StairPriceRepository,
    PercentPriceRepository,
    SettingRepository,
    EnergyRecordRepository
  ],
})
export class DeviceModule {}
