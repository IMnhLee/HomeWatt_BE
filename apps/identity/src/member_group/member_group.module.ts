import { Module } from '@nestjs/common';
import { MemberGroupService } from './member_group.service';
import { MemberGroupController } from './member_group.controller';
import { MemberGroup } from '../member_group/enitities/member_group.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    TypeOrmModule.forFeature([MemberGroup]),
  ],
  providers: [MemberGroupService],
  controllers: [MemberGroupController]
})
export class MemberGroupModule {}
