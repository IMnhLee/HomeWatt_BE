import { NestFactory } from '@nestjs/core';
import { IdentityModule } from './identity.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { GroupDTO, MemberITF, UserDTO } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    IdentityModule,
    {
      transport: Transport.GRPC,
      options: {
        url: '0.0.0.0:50051',
        protoPath: [
          join(__dirname, '../user.proto'),
          join(__dirname, '../group.proto'),
          join(__dirname, '../member.proto'),
        ],
        package: [UserDTO.USER_PACKAGE_NAME, GroupDTO.GROUP_PACKAGE_NAME, MemberITF.MEMBER_GROUP_PACKAGE_NAME],
      },
    },
  );
  await app.listen();
}
bootstrap();
