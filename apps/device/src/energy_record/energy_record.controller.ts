import { Controller } from "@nestjs/common";
import { EnergyRecordService } from "./energy_record.service";
import { EnergyITF } from "@app/common";
import { ConsumptionService } from "./consumpton.service";

@Controller()
@EnergyITF.EnergyRecordServiceControllerMethods()
export class EnergyRecordController implements EnergyITF.EnergyRecordServiceController {
    constructor(
        private readonly energyRecordService: EnergyRecordService,
        private readonly consumptionService: ConsumptionService
    ) {}

    async getEnergyConsumptionAndCost(request: EnergyITF.GetEnergyConsumptionRequest): Promise<EnergyITF.GetEnergyConsumptionResponse> {
        try {
            const response = await this.energyRecordService.getEnergyConsumptionAndCost(request.userId);
            return {
                status: {
                    code: 200,
                    message: 'Get energy consumption and cost success',
                },
                data: response,
            };
        } catch (error) {
            return {
                status: {
                    code: error.status || 500,
                    message: error.message,
                    error: error.error || 'Internal Server Error',
                },
            };
        }
    }

    async getEnergyConsumption(request: EnergyITF.GetTimeEnergyConsumptionRequest): Promise<EnergyITF.GetTimeEnergyConsumptionResponse> {
        try {
            const viewType = request.viewType as 'daily' | 'monthly';
            const response = await this.consumptionService.getEnergyConsumption(
                request.userId,
                request.date,
                viewType
            );
            return {
                status: {
                    code: 200,
                    message: 'Get energy consumption success',
                },
                data: response,
            };
        } catch (error) {
            return {
                status: {
                    code: error.status || 500,
                    message: error.message,
                    error: error.error || 'Internal Server Error',
                },
            };
        }
    }
}