import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from '@app/common';
import { join } from 'path';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: UserDTO.USER_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: UserDTO.USER_PACKAGE_NAME,
          protoPath: join(__dirname, '../user.proto'),
          url: 'identity:50051'
        },
      },
    ]),
  ],
  controllers: [],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
