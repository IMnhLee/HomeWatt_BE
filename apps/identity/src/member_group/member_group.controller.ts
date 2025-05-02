import { Controller } from '@nestjs/common';
import { MemberGroupService } from './member_group.service';
import { UserService } from '../user/user.service';
import { MemberRole } from './enities/member_group.entity';
import { UserRole } from '../user/entities/user.entity';
import { MemberITF } from '@app/common';

@Controller()
@MemberITF.MemberGroupServiceControllerMethods()
export class MemberGroupController implements MemberITF.MemberGroupServiceController {
    constructor(
        private readonly memberGroupService: MemberGroupService,
        private readonly userService: UserService,
    ) {}

    async addMemberToGroup(request: MemberITF.MemberRequest): Promise<MemberITF.MemberResponse> {
        try {
            // Extract parameters from gRPC request
            const groupId = { id: request.groupId };
            const userId = { id: request.userId };
            const requestor = request.requestor;

            if (!requestor) {
                return {
                    status: { code: 403, message: 'Unauthorized' },
                };
            }

            // Check if user has permission to add members
            const thisMembership = await this.memberGroupService.FindByUserIdAndGroupId(
                { id: requestor.id }, 
                groupId
            );

            if (thisMembership.role !== MemberRole.OWNER && requestor.role !== UserRole.ADMIN) {
                return {
                    status: { code: 403, message: 'You do not have permission to add members to this group.' },
                };
            }

            const user = await this.userService.findOneById(userId);
            const memberData = await this.memberGroupService.addMemberToGroup(groupId, user);

            return {
                status: { code: 200, message: 'Member added successfully' },
                data: {
                    id: memberData.id,
                    userId: memberData.userId,
                    groupId: memberData.groupId,
                    role: memberData.role,
                }
            };
        } catch (error) {
            return {
                status: { 
                    code: error.status || 400, 
                    message: error.message || 'Failed to add member', 
                    error: error.error || undefined 
                },
            };
        }
    }

    async getMembersByGroupId(request: MemberITF.GroupIdRequest): Promise<MemberITF.GetMembersResponse> {
        try {
            const groupId = { id: request.groupId };
            const requestor = request.requestor;

            if (!requestor) {
                return {
                    status: { code: 403, message: 'Unauthorized' },
                    data: []
                };
            }

            // Check if user has permission to view members
            const thisMembership = await this.memberGroupService.FindByUserIdAndGroupId(
                { id: requestor.id }, 
                groupId
            );

            if (thisMembership.groupId !== request.groupId && requestor.role !== UserRole.ADMIN) {
                return {
                    status: { code: 403, message: 'You do not have permission to view members of this group.' },
                    data: []
                };
            }

            const members = await this.memberGroupService.getAllMembersByGroupId(groupId);

            // Map the members to the expected response format
            const memberData = members.map(member => ({
                id: member.id,
                userId: member.userId,
                groupId: member.groupId,
                role: member.role,
                user: {
                    id: member.user.id,
                    email: member.user.email,
                    username: member.user.username || '',
                    phoneNumber: member.user.phoneNumber || '',
                    role: member.user.role
                }
            }));

            return {
                status: { code: 200, message: 'Members retrieved successfully' },
                data: memberData
            };
        } catch (error) {
            return {
                status: { 
                    code: error.status || 400, 
                    message: error.message || 'Failed to retrieve members', 
                    error: error.error || undefined
                },
                data: []
            };
        }
    }

    async updateMemberRole(request: MemberITF.UpdateRoleRequest): Promise<MemberITF.MemberResponse> {
        try {
            const groupId = { id: request.groupId };
            const userId = { id: request.userId };
            const role = request.role as MemberRole;
            const requestor = request.requestor;

            if (!requestor) {
                return {
                    status: { code: 403, message: 'Unauthorized' },
                };
            }

            // Find the membership of the requestor
            const thisMembership = await this.memberGroupService.FindByUserIdAndGroupId(
                { id: requestor.id }, 
                groupId
            );

            if (role === MemberRole.OWNER && requestor.role !== UserRole.ADMIN) {
                return {
                    status: { code: 403, message: 'You do not have permission to update this role.' },
                };
            }

            // Check if user has permission to update roles
            if (requestor.role === UserRole.ADMIN || thisMembership.role === MemberRole.OWNER) {
                const membership = await this.memberGroupService.FindByUserIdAndGroupId(userId, groupId);
                const updatedMember = await this.memberGroupService.updateRole(membership, role);

                return {
                    status: { code: 200, message: 'Role updated successfully' },
                    data: {
                        id: updatedMember.id,
                        userId: updatedMember.userId,
                        groupId: updatedMember.groupId,
                        role: updatedMember.role,
                        user: {
                            id: updatedMember.user.id,
                            email: updatedMember.user.email,
                            username: updatedMember.user.username || '',
                            phoneNumber: updatedMember.user.phoneNumber || '',
                            role: updatedMember.user.role
                        }
                    }
                };
            } else {
                return {
                    status: { code: 403, message: 'You do not have permission to update this role.' },
                };
            }
        } catch (error) {
            return {
                status: { 
                    code: error.status || 400, 
                    message: error.message || 'Failed to update role', 
                    error: error.error || undefined
                },
            };
        }
    }

    async removeMemberFromGroup(request: MemberITF.MemberRequest): Promise<MemberITF.RemoveResponse> {
        try {
            const groupId = { id: request.groupId };
            const userId = { id: request.userId };
            const requestor = request.requestor;

            if (!requestor) {
                return {
                    status: { code: 403, message: 'Unauthorized' }
                };
            }

            // Check if user has permission to remove members
            const thisMembership = await this.memberGroupService.FindByUserIdAndGroupId(
                { id: requestor.id }, 
                groupId
            );

            if (thisMembership.role !== MemberRole.OWNER && requestor.role !== UserRole.ADMIN) {
                return {
                    status: { code: 403, message: 'You do not have permission to remove members from this group.' }
                };
            }

            await this.memberGroupService.removeMemberFromGroup(userId, groupId);

            return {
                status: { code: 200, message: 'Member removed successfully' }
            };
        } catch (error) {
            return {
                status: { 
                    code: error.status || 400, 
                    message: error.message || 'Failed to remove member', 
                    error: error.error || undefined 
                }
            };
        }
    }
}
