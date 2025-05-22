import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { OnePriceRepository } from "./e_price.repository/one_price.repository";
import { PercentPriceRepository } from "./e_price.repository/percent_price.repository";
import { StairPriceRepository } from "./e_price.repository/stair_price.repository";

@Injectable()
export class EPriceService {
    private readonly logger = new Logger(EPriceService.name);
    constructor(
        private readonly onePriceRepository: OnePriceRepository,
        private readonly percentPriceRepository : PercentPriceRepository,
        private readonly stairPriceRepository : StairPriceRepository
    ) {}

    async getOnePriceConfig(userId: string) {
        return this.onePriceRepository.findOneBy({ where: { userId } });
    }

    async editOnePriceConfig(userId: string, price: number) {
        const onePriceConfig = await this.onePriceRepository.findOneBy({ where: { userId } });
        if (onePriceConfig) {
            this.onePriceRepository.updateBy({userId: userId}, { price });
        } else {
            return this.onePriceRepository.create({ userId, price });
        }
    }

    async getPercentPriceConfig(userId: string) {
        return this.percentPriceRepository.findOneBy({ where: { userId } });
    }

    async editPercentPriceConfig( id: string, userId: string, name: string, price: number, percent: number ) {
        try {
            const response = await this.percentPriceRepository.findOneBy({ where: {id: id, userId :userId}});
            await this.percentPriceRepository.updateBy({id, userId}, {name, price, percent})
        }
        catch (error) {
            throw new BadRequestException('cant edit config')
        }
    }

    async deletePercentPriceConfig(userId: string, id: string) {
        try {
            await this.percentPriceRepository.findOneBy({where: {userId, id}});
            await this.percentPriceRepository.delete(id);
        }
        catch (error) {
            throw new BadRequestException('cant delete config');
        }
    }

    async getStairPriceConfig(userId: string) {
        try {
            return this.stairPriceRepository.findOneBy({where: {userId}});
        }
        catch (error) {
            throw new BadRequestException('Cant not find config');
        }
    }

    async editStairPriceConfig(userId: string, id: string, step: number, minKwh: number, maxKwh: number, price: number) {
        try {
            await this.stairPriceRepository.findOneBy({where: {userId, id}});
            return this.stairPriceRepository.updateBy({userId, id}, {step, minKwh, maxKwh, price})
        }
        catch (error) {
            throw new BadRequestException('Can not edit');
        }
    }
    async deleteStairPriceConfig(userId:string, id: string) {
        try {
            await this.stairPriceRepository.findOneBy({where: {userId, id}});
            return this.stairPriceRepository.delete(id);
        }
        catch (error) {
            throw new BadRequestException('can not delete');
        }
    }
}