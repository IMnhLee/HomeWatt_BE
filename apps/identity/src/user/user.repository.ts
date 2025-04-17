import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";

@Injectable()
export class UserRepository extends AbstractRepository<User> {
    protected readonly logger = new Logger(UserRepository.name);

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {
        super(userRepository);
    }
}