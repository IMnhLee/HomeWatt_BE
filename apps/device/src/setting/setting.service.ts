import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { SettingRepository } from "./setting.repository";

@Injectable()
export class SettingService {
    private readonly logger = new Logger(SettingService.name);
    constructor (
        private readonly settingRepository: SettingRepository
    ) {}

    async createSetting(userId: string) {
        try {
            const setting = await this.settingRepository.findOneBy({ where: { userId } });
            if (setting) {
                return setting;
            }
        } catch (error) {
            if (!(error instanceof NotFoundException)) {
                throw error;
            }
            else {
                return this.settingRepository.create({ userId });
            }
        }
    }

    async getSetting(userId: string) {
        const setting = await this.settingRepository.findOneBy({ where: { userId } });
        return setting;
    }

    async updateSetting(userId: string, billingCycleStartDay: number, energyConsumptionThreshold: number) {
        const setting = await this.settingRepository.findOneBy({ where: { userId } });
        return this.settingRepository.updateBy({ userId }, { billingCycleStartDay, energyConsumptionThreshold });
    }
}