import { AbstractRepository } from "@app/common";
import { Logger } from "@nestjs/common";
import { MemberGroup } from "./enities/member_group.entity";
import { Repository } from "typeorm";
import { UserIdParam } from "../user/dto/userId.param";
import { GroupIdParam } from "../group/dto/groupId.param";

export class MemberGroupRepository extends AbstractRepository<MemberGroup> {
    protected readonly logger = new Logger(MemberGroupRepository.name);
    
    constructor(
        protected readonly repository: Repository<MemberGroup>,
    ) {
        super(repository);
    }
    async removeMember(userId: UserIdParam, groupId: GroupIdParam): Promise<boolean>{
        const result = await this.repository.delete({
            userId: userId.id,
            groupId: groupId.id,
        });
        return (result.affected ?? 0) > 0;
    }

    async save(memberGroup: MemberGroup): Promise<MemberGroup> {
        return this.repository.save(memberGroup);
    }
}