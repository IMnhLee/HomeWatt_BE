import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { OnePriceRepository } from "./e_price.repository/one_price.repository";
import { PercentPriceRepository } from "./e_price.repository/percent_price.repository";
import { StairPriceRepository } from "./e_price.repository/stair_price.repository";
import { SettingRepository } from "../setting/setting.repository";
import { PriceType } from "../entities/setting.entity";

@Injectable()
export class EPriceService {
    private readonly logger = new Logger(EPriceService.name);
    constructor(
        private readonly onePriceRepository: OnePriceRepository,
        private readonly percentPriceRepository : PercentPriceRepository,
        private readonly stairPriceRepository : StairPriceRepository,
        private readonly settingRepository: SettingRepository,
    ) {}

    async getOnePriceConfig(userId: string) {
        return this.onePriceRepository.findOneBy({ where: { userId } });
    }

    async createOnePriceConfig(userId: string, price: number) {
        try {
            const onePriceConfig = await this.onePriceRepository.findOneBy({ where: { userId } });
            if (onePriceConfig) {
                throw new BadRequestException('One price config already exists');
            }
        } catch (error) {
            if (!(error instanceof NotFoundException)) {
                throw error;
            }
            // If NotFoundException is thrown, it means no config exists, so we can proceed
        }
        return this.onePriceRepository.create({ userId, price });
    }

    async editOnePriceConfig(userId: string, price: number) {
        try {
            const onePriceConfig = await this.onePriceRepository.findOneBy({ where: { userId } });
            if (onePriceConfig) {
                return this.onePriceRepository.updateBy({userId: userId}, { price });
            }
        } catch (error) {
            if (!(error instanceof NotFoundException)) {
                throw error;
            }
            else {
                return this.onePriceRepository.create({ userId, price });
            }
        }
    }

    async getPercentPriceConfig(userId: string) {
        return this.percentPriceRepository.findWithOptions({ where: { userId }, order: { percent: 'ASC' } });
    }

    async createPercentPriceConfig(userId: string, name: string, price: number, percent: number) {
        try {
            return this.percentPriceRepository.create({ userId, name, price, percent });
        }
        catch (error) {
            throw new BadRequestException('cant create config');
        }
    }

    async editPercentPriceConfig( id: string, userId: string, name: string, price: number, percent: number ) {
        try {
            await this.percentPriceRepository.findOneBy({ where: {id: id, userId :userId}});
            return this.percentPriceRepository.updateBy({id, userId}, {name, price, percent})
        }
        catch (error) {
            throw new BadRequestException('cant edit config')
        }
    }

    async deletePercentPriceConfig(userId: string, id: string) {
        try {
            await this.percentPriceRepository.findOneBy({where: {userId, id}});
            return this.percentPriceRepository.delete(id);
        }
        catch (error) {
            throw new BadRequestException('cant delete config');
        }
    }

    async getStairPriceConfig(userId: string) {
        try {
            return this.stairPriceRepository.findWithOptions({where: {userId}, order: { step: 'ASC' }});
        }
        catch (error) {
            throw new BadRequestException('Cant not find config');
        }
    }

    async createStairPriceConfig(userId: string, step: number, minKwh: number, maxKwh: number | undefined, price: number) {
    try {
        // Nếu không có maxKwh, đặt giá trị là null hoặc một số rất lớn
        const finalMaxKwh = maxKwh === undefined || maxKwh === null ? null : maxKwh;
        return this.stairPriceRepository.create({ userId, step, minKwh, maxKwh: finalMaxKwh as unknown as number, price });
    }
    catch (error) {
        throw new BadRequestException('Can not create config');
    }
    }

    async editStairPriceConfig(userId: string, id: string, step: number, minKwh: number, maxKwh: number | undefined, price: number) {
        try {
            await this.stairPriceRepository.findOneBy({where: {userId, id}});
            // Nếu không có maxKwh, đặt giá trị là null hoặc một số rất lớn
            const finalMaxKwh = maxKwh === undefined || maxKwh === null ? null : maxKwh;
            return this.stairPriceRepository.updateBy({userId, id}, {step, minKwh, maxKwh: finalMaxKwh as unknown as number, price})
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

    async getConfigPrice(userId: string) {
        try {
            return this.settingRepository.findOneBy({where: {userId}});
        }
        catch (error) {
            throw new BadRequestException('Can not get config');
        }
    }

    async editConfigPrice(userId: string, priceType: PriceType) {
        try {
            const setting = await this.settingRepository.findOneBy({where: {userId}});
            if (setting) {
                return this.settingRepository.updateBy({userId}, {priceType});
            }
        }
        catch (error) {
            if (!(error instanceof NotFoundException)) {
                throw error;
            }
            else {
                return this.settingRepository.create({userId, priceType});
            }
        }
    }

    async getBillingStartDate(userId: string) {
        try {
            return this.settingRepository.findOneBy({where: {userId}});
        }
        catch (error) {
            throw new BadRequestException('Can not get billing start date');
        }
    }

    async editBillingStartDate(userId: string, billingCycleStartDay: number) {
        try {
            const setting = await this.settingRepository.findOneBy({where: {userId}});
            if (setting) {
                return this.settingRepository.updateBy({userId}, {billingCycleStartDay});
            }
        } catch (error) {
            if (!(error instanceof NotFoundException)) {
                throw error;
            } else {
                return this.settingRepository.create({ userId, billingCycleStartDay });
            }
        }
    }
}