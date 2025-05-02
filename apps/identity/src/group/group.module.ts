import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { UserGroup } from '../group/entities/user_group.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupRepository } from './group.repository';
import { MemberGroupModule } from '../member_group/member_group.module';
@Module({
  imports: [
    MemberGroupModule,
    TypeOrmModule.forFeature([UserGroup]),
  ],
  providers: [GroupRepository, GroupService],
  controllers: [GroupController]
})
export class GroupModule {}
