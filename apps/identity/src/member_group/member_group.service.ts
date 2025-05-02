import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { MemberGroupRepository } from './member_group.repository';
import { GroupIdParam } from '../group/dto/groupId.param';
import { UserIdParam } from '../user/dto/userId.param';
import { MemberGroup, MemberRole } from './enities/member_group.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class MemberGroupService {
    private readonly logger = new Logger(MemberGroupService.name);
    constructor(
        private readonly memberGroupRepository: MemberGroupRepository,
    ) {}

    async addMemberToGroup(groupId: GroupIdParam, user: UserIdParam, role: MemberRole = MemberRole.MEMBER): Promise<MemberGroup> {
        try {
            // Create new membership with composite key
            const memberGroup = new MemberGroup();
            memberGroup.userId = user.id;
            memberGroup.groupId = groupId.id;
            memberGroup.role = role;

            return await this.memberGroupRepository.save(memberGroup);
        }
        catch (error) {
            this.logger.error(`Failed to add member to group: ${error.message}`);
            throw new BadRequestException('Failed to add member to group');
        }
    }

    async FindByUserIdAndGroupId(userId: UserIdParam, groupId: GroupIdParam): Promise<MemberGroup> {
        try {
            return this.memberGroupRepository.findOneBy({
                where: {
                    userId: userId.id,
                    groupId: groupId.id,
                }
            });
        }
        catch (error) {
            this.logger.error(`Failed to find membership: ${error.message}`);
            throw new NotFoundException('Failed to find membership');
        }
    }

    async removeMemberFromGroup(userId: UserIdParam, groupId: GroupIdParam): Promise<{ message: string }> {
        try {
            const result = await this.memberGroupRepository.removeMember(userId, groupId);
            if (!result) {
                this.logger.warn(`Membership not found for userId: ${userId.id}, groupId: ${groupId.id}`);
                throw new NotFoundException('Membership not found');
            }
            return { message: 'Member removed from group successfully' };
        }
        catch (error) {
            this.logger.error(`Failed to remove member from group: ${error.message}`);
            throw new BadRequestException('Failed to remove member from group');
        }
    }

    async updateRole(membership: MemberGroup, role: MemberRole): Promise<MemberGroup> {
        membership.role = role;
        try {
            return await this.memberGroupRepository.save(membership);
        }
        catch (error) {
            this.logger.error(`Failed to update membership role: ${error.message}`);
            throw new BadRequestException('Failed to update membership role');
        }
    }

    async getAllMembersByGroupId(groupId: GroupIdParam): Promise<MemberGroup[]> {
        try {
            return await this.memberGroupRepository.findWithOptions(
                {
                    where: {
                        groupId: groupId.id,
                    },
                    relations: ['user'], // Assuming you want to load the user relation as well
                }
            );
        }
        catch (error) {
            this.logger.error(`Failed to find members by group ID: ${error.message}`);
            throw new NotFoundException('Failed to find members by group ID');
        }
    }

}
