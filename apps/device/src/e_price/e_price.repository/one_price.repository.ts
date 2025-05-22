import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { OnePriceConfig } from "../../entities/one-price-config.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class OnePriceRepository extends AbstractRepository<OnePriceConfig> {
    protected readonly logger = new Logger(OnePriceRepository.name);
    constructor(
        @InjectRepository(OnePriceConfig)
        private readonly onePriceRepository: Repository<OnePriceConfig>
    ) {
        super(onePriceRepository);
    }
}