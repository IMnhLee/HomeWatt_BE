import { Module } from '@nestjs/common';
import { MemberGroupController } from './member_group.controller';
import { MemberGroupService } from './member_group.service';
import { MemberGroup } from './enities/member_group.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberGroupRepository } from './member_group.repository';

@Module({
    imports: [
      TypeOrmModule.forFeature([MemberGroup]),
    ],
  controllers: [MemberGroupController],
  providers: [MemberGroupService, MemberGroupRepository]
})
export class MemberGroupModule {}
