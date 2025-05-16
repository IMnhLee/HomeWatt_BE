import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RmqModule } from '@app/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RmqModule.register({
      name: 'MAIL',
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository
  ],
  exports: [UserService]
})
export class UserModule {}
