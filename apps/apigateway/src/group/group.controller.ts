import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { GroupService } from './group.service';
import { AdminRoleGuard } from '../auth/guards/admin-role.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GroupDTO } from '@app/common';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get()
  // @UseGuards(AdminRoleGuard)
  @UseGuards(JwtAuthGuard)
  async getAllGroups(@CurrentUser() user) {
    return this.groupService.GetAllGroups({user});
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getGroupById(@Param('id') id: string, @CurrentUser() user) {
    return this.groupService.GetGroupById({ id, user });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createGroup(@Body() createGroupDto: {name: string, description: string}, @CurrentUser() user) {
    const request: GroupDTO.CreateGroupRequest = {
      ...createGroupDto,
      owner: user
    };
    return this.groupService.CreateGroup(request);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateGroup(
    @Param('id') id: string,
    @Body() updateGroupDto: Omit<GroupDTO.UpdateGroupRequest, 'id' | 'user'>,
    @CurrentUser() user
  ) {
    const request: GroupDTO.UpdateGroupRequest = {
      id,
      ...updateGroupDto,
      user
    };
    return this.groupService.UpdateGroup(request);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteGroup(@Param('id') id: string, @CurrentUser() user) {
    return this.groupService.DeleteGroup({ id, user });
  }
}
