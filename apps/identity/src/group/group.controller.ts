import { Controller } from '@nestjs/common';
import { GroupService } from './group.service';
import { MemberGroupService } from '../member_group/member_group.service';
import { MemberRole } from '../member_group/enities/member_group.entity';
import { GroupDTO } from '@app/common';

@Controller()
@GroupDTO.GroupServiceControllerMethods()
export class GroupController implements GroupDTO.GroupServiceController {
  constructor(
    private readonly groupService: GroupService,
    private readonly memberGroupService: MemberGroupService,
  ) {}

  async createGroup(request: GroupDTO.CreateGroupRequest): Promise<GroupDTO.GroupResponse> {
    try {
      if (!request.owner) {
        return {
          status: { code: 401, message: 'Unauthorized' }
        };
      }
      const newGroup = await this.groupService.createGroupWithOwner(
        { name: request.name, description: request.description },
        { id: request.owner.id }
      );

      return {
        status: {
          code: 200,
          message: 'Group created successfully'
        },
        data: {
          id: newGroup.id,
          name: newGroup.name,
          description: newGroup.description,
          members: []
        }
      };
    } catch (error) {
      return {
        status: { 
          code: error.status || 400, 
          message: 'Failed to create group', 
          error: error.message 
        }
      };
    }
  }

  async getAllGroups(request: GroupDTO.GetAllGroupsRequest): Promise<GroupDTO.GetAllGroupsResponse> {
    try {
      if (!request.user) {
        return {
          status: { code: 401, message: 'Unauthorized' },
          data: []
        };
      }
      // Check if the user is an admin
      // if (request.user.role !== 'admin') {
      //   return {
      //     status: {
      //       code: 403,
      //       message: 'You do not have permission to view all groups.'
      //     },
      //     data: []
      //   };
      // }

      const groups = await this.groupService.findAllGroup();
      const groupData  = groups.map(group => ({
        id: group.id,
        name: group.name,
        description: group.description,
        members: []
      }));

      return {
        status: { code: 200, message: 'Groups retrieved successfully' },
        data: groupData
      };
    } catch (error) {
      return {
        status: {
          code: error.status,
          message: 'Failed to retrieve groups',
          error: error.message
        },
        data: []
      };
    }
  }

  async getGroupById(request: GroupDTO.GroupIdRequest): Promise<GroupDTO.GroupResponse> {
    try {
      if (!request.user) {
        return {
          status: { code: 401, message: 'Unauthorized' }
        };
      }
      // Check if user is a member of the group
      await this.memberGroupService.FindByUserIdAndGroupId(
        {id: request.user.id}, 
        { id: request.id }
      );

      const group = await this.groupService.findGroupById({id: request.id});
      const response = await this.memberGroupService.getAllMembersByGroupId({id: group.id});
      const members = response.map(member => ({
        id: member.userId,
        username: member.user.username,
        email: member.user.email,
        phoneNumber: member.user.phoneNumber,
        groupRole: member.role
      }))
      
      return {
        status: { code: 200, message: 'Group retrieved successfully' },
        data: {
          id: group.id,
          name: group.name,
          description: group.description,
          members: members
        }
      };
    } catch (error) {
      return {
        status: { 
          code: 404, 
          message: 'Failed to retrieve group', 
          error: error.message 
        }
      };
    }
  }

  async updateGroup(request: GroupDTO.UpdateGroupRequest): Promise<GroupDTO.GroupResponse> {
    try {
      if (!request.user) {
        return {
          status: { code: 401, message: 'Unauthorized' }
        };
      }
      // Check if the user is an admin or group owner
      const thisMembership = await this.memberGroupService.FindByUserIdAndGroupId(
        {id: request.user.id}, 
        { id: request.id }
      );

      if (thisMembership.role !== MemberRole.OWNER && request.user.role !== 'admin') {
        return {
          status: { code: 403, message: 'You do not have permission to update this group.' }
        };
      }

      const updatedGroup = await this.groupService.updateGroup(
        { id: request.id }, 
        { name: request.name, description: request.description }
      );
      
      return {
        status: { code: 200, message: 'Group updated successfully' },
        data: {
          id: updatedGroup.id,
          name: updatedGroup.name,
          description: updatedGroup.description,
          members: []
        }
      };
    } catch (error) {
      return {
        status: { 
          code: 400, 
          message: 'Failed to update group', 
          error: error.message 
        }
      };
    }
  }

  async deleteGroup(request: GroupDTO.GroupIdRequest): Promise<GroupDTO.DeleteGroupResponse> {
    try {
      if (!request.user) {
        return {
          status: { code: 401, message: 'Unauthorized' }
        };
      }
      // Check if the user is an admin or group owner
      const thisMembership = await this.memberGroupService.FindByUserIdAndGroupId(
        { id: request.user.id }, 
        { id: request.id }
      );

      if (thisMembership.role !== MemberRole.OWNER && request.user.role !== 'admin') {
        return {
          status: { code: 403, message: 'You do not have permission to delete this group.' }
        };
      }

      await this.groupService.deleteGroup({ id: request.id });
      
      return {
        status: { code: 200, message: 'Group deleted successfully' }
      };
    } catch (error) {
      return {
        status: { code: 400, message: 'Failed to delete group', error: error.message }
      };
    }
  }
}
