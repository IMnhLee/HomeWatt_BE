import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MemberITF } from '@app/common';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MemberITF.MEMBER_GROUP_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: MemberITF.MEMBER_GROUP_PACKAGE_NAME,
          protoPath: join(__dirname, '../member.proto'),
          url: 'identity:50051'
        },
      },
    ]),
  ],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
