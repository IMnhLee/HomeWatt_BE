import { Module, forwardRef } from '@nestjs/common';
import { MemberGroupController } from './member_group.controller';
import { MemberGroupService } from './member_group.service';
import { MemberGroup } from './enities/member_group.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberGroupRepository } from './member_group.repository';
import { UserModule } from '../user/user.module';
import { DatabaseModule } from '@app/common';
import { GroupModule } from '../group/group.module';

@Module({
    imports: [
      UserModule,
      forwardRef(() => GroupModule),
      DatabaseModule,
      TypeOrmModule.forFeature([MemberGroup]),
    ],
  controllers: [MemberGroupController],
  providers: [
    MemberGroupService,
    MemberGroupRepository,
  ],
  exports: [MemberGroupService],
})
export class MemberGroupModule {}
