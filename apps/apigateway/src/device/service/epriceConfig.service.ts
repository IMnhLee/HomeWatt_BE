import { EPriceITF, handleMicroserviceResponse } from "@app/common";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EpriceConfigService implements OnModuleInit {
    private epriceConfigService: EPriceITF.EPriceServiceClient;
    
    constructor(@Inject(EPriceITF.E_PRICE_PACKAGE_NAME) private client: ClientGrpc) {}
    
    onModuleInit() {
        this.epriceConfigService = this.client.getService<EPriceITF.EPriceServiceClient>(EPriceITF.E_PRICE_SERVICE_NAME);
    }

    async getConfigPrice(request: EPriceITF.GetConfigRequest) {
        const response = await firstValueFrom(this.epriceConfigService.getConfigPrice(request));
        return handleMicroserviceResponse(response);
    }

    async editConfigPrice(request: EPriceITF.EditConfigRequest) {
        const response = await firstValueFrom(this.epriceConfigService.editConfigPrice(request));
        return handleMicroserviceResponse(response);
    }

    async getStartBillingDate(request: EPriceITF.GetConfigRequest) {
        const response = await firstValueFrom(this.epriceConfigService.getStartBillingDate(request));
        return handleMicroserviceResponse(response);
    }

    async editStartBillingDate(request: EPriceITF.EditBillingStartDateRequest) {
        const response = await firstValueFrom(this.epriceConfigService.editStartBillingDate(request));
        return handleMicroserviceResponse(response);
    }

    // One Price Config methods
    async createOnePriceConfig(request: EPriceITF.OnePriceRequest) {
        const response = await firstValueFrom(this.epriceConfigService.createOnePriceConfig(request));
        return handleMicroserviceResponse(response);
    }
    
    async getOnePriceConfig(request: EPriceITF.GetOnePriceConfigRequest) {
        const response = await firstValueFrom(this.epriceConfigService.getOnePriceConfig(request));
        return handleMicroserviceResponse(response);
    }

    async editOnePriceConfig(request: EPriceITF.OnePriceRequest) {
        const response = await firstValueFrom(this.epriceConfigService.editOnePriceConfig(request));
        return handleMicroserviceResponse(response);
    }

    // Percent Price Config methods
    async createPercentPriceConfig(request: EPriceITF.CreatePercentPriceConfigRequest) {
        const response = await firstValueFrom(this.epriceConfigService.createPercentPriceConfig(request));
        return handleMicroserviceResponse(response);
    }
    
    async getPercentPriceConfig(request: EPriceITF.GetPercentPriceConfigRequest) {
        const response = await firstValueFrom(this.epriceConfigService.getPercentPriceConfig(request));
        return handleMicroserviceResponse(response);
    }

    async editPercentPriceConfig(request: EPriceITF.EditPercentPriceConfigRequest) {
        const response = await firstValueFrom(this.epriceConfigService.editPercentPriceConfig(request));
        return handleMicroserviceResponse(response);
    }

    async deletePercentPriceConfig(request: EPriceITF.DeletePercentPriceConfigRequest) {
        const response = await firstValueFrom(this.epriceConfigService.deletePercentPriceConfig(request));
        return handleMicroserviceResponse(response);
    }

    // Stair Price Config methods
    async createStairPriceConfig(request: EPriceITF.CreateStairPriceConfigRequest) {
        const response = await firstValueFrom(this.epriceConfigService.createStairPriceConfig(request));
        return handleMicroserviceResponse(response);
    }
    
    async getStairPriceConfig(request: EPriceITF.GetStairPriceConfigRequest) {
        const response = await firstValueFrom(this.epriceConfigService.getStairPriceConfig(request));
        return handleMicroserviceResponse(response);
    }

    async editStairPriceConfig(request: EPriceITF.EditStairPriceConfigRequest) {
        const response = await firstValueFrom(this.epriceConfigService.editStairPriceConfig(request));
        return handleMicroserviceResponse(response);
    }

    async deleteStairPriceConfig(request: EPriceITF.DeleteStairPriceConfigRequest) {
        const response = await firstValueFrom(this.epriceConfigService.deleteStairPriceConfig(request));
        return handleMicroserviceResponse(response);
    }
}