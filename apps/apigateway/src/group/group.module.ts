import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GroupDTO } from '@app/common';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: GroupDTO.GROUP_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: GroupDTO.GROUP_PACKAGE_NAME,
          protoPath: join(__dirname, '../group.proto'),
          url: 'identity:50051'
        },
      },
    ]),
  ],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
