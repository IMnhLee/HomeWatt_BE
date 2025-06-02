import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { EnergyRecord } from "../entities/energy-record.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class EnergyRecordRepository extends AbstractRepository<EnergyRecord> {
    protected readonly logger = new Logger(EnergyRecordRepository.name);

    constructor(
        @InjectRepository(EnergyRecord)
        private readonly energyRecordRepository: Repository<EnergyRecord>
    ) {
        super(energyRecordRepository);
    }

    // Additional methods for managing energy records can be added here
}