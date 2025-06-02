import { Controller, Logger } from "@nestjs/common";
import { SettingService } from "./setting.service";
import { SettingITF } from "@app/common";

@Controller()
@SettingITF.SettingServiceControllerMethods()
export class SettingController implements SettingITF.SettingServiceController {
    private readonly logger = new Logger(SettingController.name);

    constructor(
        private readonly settingService: SettingService,
    ) {}

    async createSetting(request: SettingITF.CreateSettingRequest): Promise<SettingITF.SettingResponse> {
        try {
            const setting = await this.settingService.createSetting(request.userId);
            return {
                status: {
                    code: 200,
                    message: 'Setting created successfully',
                },
                data: setting,
            };
        } catch (error) {
            this.logger.error(`Error creating setting: ${error.message}`, error.stack);
            return {
                status: {
                    code: error.status || 500,
                    message: error.message,
                    error: error.error || 'Internal Server Error',
                },
                data: undefined,
            };
        }
    }

    async getSetting(request: SettingITF.GetSettingRequest): Promise<SettingITF.SettingResponse> {
        try {
            const setting = await this.settingService.getSetting(request.userId);
            return {
                status: {
                    code: 200,
                    message: 'Setting retrieved successfully',
                },
                data: setting,
            };
        } catch (error) {
            this.logger.error(`Error retrieving setting: ${error.message}`, error.stack);
            return {
                status: {
                    code: error.status || 500,
                    message: error.message,
                    error: error.error || 'Internal Server Error',
                },
                data: undefined,
            };
        }
    }

    async updateSetting(request: SettingITF.UpdateSettingRequest): Promise<SettingITF.SettingResponse> {
        try {
            const updatedSetting = await this.settingService.updateSetting(
                request.userId, 
                request.billingCycleStartDay, 
                request.energyConsumptionThreshold
            );
            return {
                status: {
                    code: 200,
                    message: 'Setting updated successfully',
                },
                data: updatedSetting,
            };
        } catch (error) {
            this.logger.error(`Error updating setting: ${error.message}`, error.stack);
            return {
                status: {
                    code: error.status || 500,
                    message: error.message,
                    error: error.error || 'Internal Server Error',
                },
                data: undefined,
            };
        }
    }
}