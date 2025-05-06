import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { MemberService } from './member.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { MemberITF } from '@app/common';

@Controller('membergroup')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post('/:groupId/user/:userId')
  @UseGuards(JwtAuthGuard)
  async addMemberToGroup(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
    @CurrentUser() user
  ) {
    const request: MemberITF.MemberRequest = {
      groupId: groupId,
      userId: userId,
      requestor: user
    };
    return this.memberService.AddMemberToGroup(request);
  }

  @Get('/:groupId')
  @UseGuards(JwtAuthGuard)
  async getMembersByGroupId(
    @Param('groupId') groupId: string,
    @CurrentUser() user
  ) {
    const request: MemberITF.GroupIdRequest = {
      groupId: groupId,
      requestor: user
    };
    return this.memberService.GetMemberByGroupId(request);
  }

  @Put('/:groupId/user/:userId/role')
  @UseGuards(JwtAuthGuard)
  async updateMemberRole(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
    @Body('role') role: string,
    @CurrentUser() user
  ) {
    const request: MemberITF.UpdateRoleRequest = {
      groupId: groupId,
      userId: userId,
      role,
      requestor: user
    };
    return this.memberService.UpdateMemberRole(request);
  }

  @Delete('/:groupId/user/:userId')
  @UseGuards(JwtAuthGuard)
  async removeMemberFromGroup(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
    @CurrentUser() user
  ) {
    const request: MemberITF.MemberRequest = {
      groupId: groupId,
      userId: userId,
      requestor: user
    };
    return this.memberService.RemoveMemberFromGroup(request);
  }
}
