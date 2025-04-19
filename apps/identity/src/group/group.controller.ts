import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupRequest } from './dto/creatGroup.request';
import { UserService } from '../user/user.service';
import { MemberGroupService } from '../member_group/member_group.service';
import { MemberRole } from '../member_group/enities/member_group.entity';
import { GroupIdParam } from './dto/groupId.param';

@Controller('group')
export class GroupController {
    constructor(
        private readonly groupService: GroupService,
        private readonly memberGroupService: MemberGroupService,
        private readonly userService: UserService,
    ) {}

    @Post('create')
    async createGroup(
        @Body() groupData: CreateGroupRequest,
        @Req() request
    ) {
        const owner = request.user;
        const newGroup = await this.groupService.createGroup(groupData);
        return this.memberGroupService.addMemberToGroup({id: newGroup.id}, owner, MemberRole.OWNER);
    }

    @Get('all')
    async getAllGroups(@Req() request) {
        // Check if the user is an admin or has a specific role to view all groups
        if (request.role !== 'admin') {
            return { message: 'You do not have permission to view all groups.' };
        }
        return this.groupService.findAllGroup();
    }

    @Get(':id')
    async getGroupById(@Param() id: GroupIdParam, @Req() request) {
        // Check if the user is an admin or is a member of group 
        await this.memberGroupService.FindByUserIdAndGroupId(request.user.id, id);
        return this.groupService.findGroupById(id);
    }

    @Put(':id')
    async updateGroup(
        @Param() id: GroupIdParam, 
        @Body() groupData: CreateGroupRequest,
        @Req() request
    ) {
        // Check if the user is an admin or is a member of group 
        const thisMembership = await this.memberGroupService.FindByUserIdAndGroupId(request.user.id, id);
        if (thisMembership.role !== MemberRole.OWNER && request.role !== 'admin') {
            return { message: 'You do not have permission to update this group.' };
        }
        return this.groupService.updateGroup(id, groupData);
    }

    @Delete(':id')
    async deleteGroup(
        @Param() id: GroupIdParam, 
        @Req() request
    ) {
        // Check if the user is an admin or is a member of group 
        const thisMembership = await this.memberGroupService.FindByUserIdAndGroupId(request.user.id, id);
        if (thisMembership.role !== MemberRole.OWNER && request.role !== 'admin') {
            return { message: 'You do not have permission to delete this group.' };
        }
        return this.groupService.deleteGroup(id);
    }
}
