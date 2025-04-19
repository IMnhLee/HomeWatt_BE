import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Req, UnauthorizedException } from '@nestjs/common';
import { MemberGroupService } from './member_group.service';
import { GroupIdParam } from '../group/dto/groupId.param';
import { UserIdParam } from '../user/dto/userId.param';
import { UserService } from '../user/user.service';
import { MemberRole } from './enities/member_group.entity';
import { UserRole } from '../user/entities/user.entity';
import { GroupService } from '../group/group.service';

@Controller('member-group')
export class MemberGroupController {
    constructor(
        private readonly memberGroupService: MemberGroupService,
        private readonly userService: UserService,
        private readonly groupService: GroupService,
    ) {}

    @Post(':groupId/:userId')
    async addMemberToGroup(
        @Param('groupId') groupId: GroupIdParam, 
        @Param('userId') userId: UserIdParam,
        @Req() request,
    ) {
        // Kiểm tra xem người dùng có quyền thêm thành viên vào nhóm hay không
        const thisMembership = await this.memberGroupService.FindByUserIdAndGroupId(request.user, groupId);

        if (thisMembership.role !== MemberRole.OWNER && request.role !== UserRole.ADMIN) {
            throw new UnauthorizedException('You do not have permission to add members to this group.');
        }
        const user = await this.userService.findOneById(userId);
        return this.memberGroupService.addMemberToGroup(groupId, user);
    }

    @Get(':groupId')
    async getMemberGroup(
        @Param('groupId') groupId: GroupIdParam, 
        @Req() request,
    ) {
        return await this.memberGroupService.getAllMembersByGroupId(groupId);
    }

    @Put(':groupId/:userId')
    async updateGroupRole(
        @Param('groupId') groupId: GroupIdParam, 
        @Param('userId') userId: UserIdParam,
        @Body() role: MemberRole,
        @Req() request,
    ) {
        //Tìm chủ của group
        const thisMembership = await this.memberGroupService.FindByUserIdAndGroupId(request.user.id, groupId);

        if (role === MemberRole.OWNER && request.role !== UserRole.ADMIN) {
            throw new UnauthorizedException('You do not have permission to update this role.');
        }

        // Kiểm tra xem người dùng có quyền cập nhật vai trò hay không
        if (request.role === UserRole.ADMIN || thisMembership.role === MemberRole.OWNER) {
            const membership = await this.memberGroupService.FindByUserIdAndGroupId(userId, groupId);
            return this.memberGroupService.updateRole(membership, role);
        }
        else {
            throw new UnauthorizedException('You do not have permission to update this role.');
        }
    }

    @Post(':groupId/:userId')
    async removeMemberFromGroup(
        @Param('groupId') groupId: GroupIdParam, 
        @Param('userId') userId: UserIdParam,
        @Req() request,
    ) {
        // Kiểm tra xem người dùng có quyền xóa thành viên khỏi nhóm hay không
        const thisMembership = await this.memberGroupService.FindByUserIdAndGroupId(request.user, groupId);

        if (thisMembership.role !== MemberRole.OWNER && request.role !== UserRole.ADMIN) {
            throw new UnauthorizedException('You do not have permission to remove members from this group.');
        }
        return this.memberGroupService.removeMemberFromGroup(userId, groupId);
    }
}
