import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseModule } from '@app/common';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserGroup } from './entities/user_group.entity';
import { MemberGroup } from './entities/member_group.entity';

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
      }),
      envFilePath: '.apps/users/.env',
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([User, UserGroup, MemberGroup]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository
  ],
})
export class UsersModule {}
