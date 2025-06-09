import { EnergyITF, handleMicroserviceResponse } from "@app/common";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

@Injectable()
export class EnergyService implements OnModuleInit {
    private energyService: EnergyITF.EnergyRecordServiceClient;
    
    constructor(@Inject(EnergyITF.ENERGY_RECORD_PACKAGE_NAME) private client: ClientGrpc) {}
    onModuleInit() {
        this.energyService = this.client.getService<EnergyITF.EnergyRecordServiceClient>(EnergyITF.ENERGY_RECORD_SERVICE_NAME);
    }
    
    async getEnergyConsumptionAndCost (request: EnergyITF.GetEnergyConsumptionRequest) {
        const response = await firstValueFrom(this.energyService.getEnergyConsumptionAndCost(request));
        return handleMicroserviceResponse(response);
    }

    async getEnergyConsumption (request: EnergyITF.GetTimeEnergyConsumptionRequest) {
        const response = await firstValueFrom(this.energyService.getEnergyConsumption(request));
        return handleMicroserviceResponse(response);
    }
}