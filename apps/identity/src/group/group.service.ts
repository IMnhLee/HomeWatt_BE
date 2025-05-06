import { BadRequestException, Inject, Injectable, Logger, NotFoundException, forwardRef } from '@nestjs/common';
import { GroupRepository } from './group.repository';
import { CreateGroupRequest } from './dto/creatGroup.request';
import { GroupIdParam } from './dto/groupId.param';
import { User } from '../user/entities/user.entity';
import { UserIdParam } from '../user/dto/userId.param';
import { UserGroup } from './entities/user_group.entity';
import { MemberRole } from '../member_group/enities/member_group.entity';
import { MemberGroupService } from '../member_group/member_group.service';
import { GroupDTO } from '@app/common';

@Injectable()
export class GroupService {
    private readonly logger = new Logger(GroupService.name);
    constructor(
        private readonly groupRepository: GroupRepository,
        @Inject(forwardRef(() => MemberGroupService))
        private readonly memberGroupService: MemberGroupService,
    ) {}

    async createGroup(createGroupRequest: CreateGroupRequest) {
        try {
            const newGroup = await this.groupRepository.create(createGroupRequest);
            return newGroup
        }
        catch (error) {
            throw new BadRequestException('failed to create group')
        }
    }

    async createGroupWithOwner( request: CreateGroupRequest, owner: UserIdParam) {
        return this.groupRepository.transaction(async () => {
            //Create the group
            const newGroup = await this.createGroup(
                {
                    name: request.name,
                    description: request.description,
                }
            );
          
          //Add the owner to the group
          await this.memberGroupService.addMemberToGroup(
            { id: newGroup.id },
            owner,
            MemberRole.OWNER
          );
      
          return newGroup;
        });
      }

    async findAllGroup() {
        return this.groupRepository.findAll();
    }

    async findGroupById(id: GroupIdParam) {
        try {
            return this.groupRepository.findOneById(id.id);
        }
        catch (error) {
            throw new NotFoundException('Group not found.');
        }
    }

    async updateGroup(id: GroupIdParam, data: CreateGroupRequest) {
        try {
            return this.groupRepository.update(id.id, data);
        }
        catch (error) {
            throw new BadRequestException('Invalid data provided.');
        }
    }

    async deleteGroup(id: GroupIdParam) {
        try {
            return this.groupRepository.delete(id.id);
        }
        catch (error) {
            throw new BadRequestException('Invalid data provided.');
        }
    }
}