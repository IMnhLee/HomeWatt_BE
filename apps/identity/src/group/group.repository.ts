import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserGroup } from "./entities/user_group.entity";

@Injectable()
export class GroupRepository extends AbstractRepository<UserGroup> {
    protected readonly logger = new Logger(GroupRepository.name);

    constructor(
        @InjectRepository(UserGroup)
        private readonly groupRepository: Repository<UserGroup>
    ) {
        super(groupRepository);
    }
}