import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { GroupRepository } from './group.repository';
import { CreateGroupRequest } from './dto/creatGroup.request';
import { GroupIdParam } from './dto/groupId.param';
import { User } from '../user/entities/user.entity';
import { UserIdParam } from '../user/dto/userId.param';
import { UserGroup } from './entities/user_group.entity';

@Injectable()
export class GroupService {
    private readonly logger = new Logger(GroupService.name);
    constructor(
        private readonly groupRepository: GroupRepository,
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