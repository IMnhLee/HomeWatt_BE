import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PercentPriceConfig } from "../../entities/percent-price-config.entity";

@Injectable()
export class PercentPriceRepository extends AbstractRepository<PercentPriceConfig> {
    protected readonly logger = new Logger(PercentPriceRepository.name);
    constructor(
        @InjectRepository(PercentPriceConfig)
        private readonly percentPriceRepository: Repository<PercentPriceConfig>
    ) {
        super(percentPriceRepository);
    }
}