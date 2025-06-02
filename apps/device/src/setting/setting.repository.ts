import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Setting } from "../entities/setting.entity";
import { AbstractRepository } from "@app/common";

@Injectable()
export class SettingRepository extends AbstractRepository<Setting> {
    protected readonly logger = new Logger(SettingRepository.name);
    constructor(
        @InjectRepository(Setting)
        private readonly settingRepository: Repository<Setting>
    ) {
        super(settingRepository);
    }
}