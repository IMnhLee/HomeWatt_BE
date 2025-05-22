import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { StairPriceConfig } from "../../entities/stair-price-config.entity";

@Injectable()
export class StairPriceRepository extends AbstractRepository<StairPriceConfig> {
    protected readonly logger = new Logger(StairPriceRepository.name);
    constructor(
        @InjectRepository(StairPriceConfig)
        private readonly stairPriceRepository: Repository<StairPriceConfig>
    ) {
        super(stairPriceRepository);
    }
}