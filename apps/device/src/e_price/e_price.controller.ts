import { Controller, Logger } from "@nestjs/common";
import { EPriceService } from "./e_price.service";
import { EPriceITF } from "@app/common"; 
import { PriceType } from "../entities/setting.entity";

@Controller('e_price')
@EPriceITF.EPriceServiceControllerMethods()
export class EPriceController implements EPriceITF.EPriceServiceController {
    private readonly logger = new Logger(EPriceController.name);

    constructor(
        private readonly ePriceService: EPriceService,
    ) {}

    // One Price Config methods
    async createOnePriceConfig(request: EPriceITF.OnePriceRequest): Promise<EPriceITF.OnePriceResponse> {
        try {
            const { userId, price } = request;
            const response = await this.ePriceService.createOnePriceConfig(userId, price);
            return {
                status: {
                    code: 200,
                    message: 'Create Price success',
                },
                data: response,
            };
        }
        catch (error) {
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

    async getOnePriceConfig(request: EPriceITF.GetOnePriceConfigRequest): Promise<EPriceITF.OnePriceResponse> {
        try {
            const response = await this.ePriceService.getOnePriceConfig(request.userId);
            return {
                status: {
                    code: 200,
                    message: 'Get Price success',
                },
                data: response || [],
            };
        }
        catch (error) {
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

    async editOnePriceConfig(request: EPriceITF.OnePriceRequest): Promise<EPriceITF.OnePriceResponse> {
        try {
            const { userId, price } = request;
            const response = await this.ePriceService.editOnePriceConfig(userId, price);
            return {
                status: {
                    code: 200,
                    message: 'Edit Price success',
                },
                data: response,
            };
        }
        catch (error) {
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

    // Percent Price Config methods
    async createPercentPriceConfig(request: EPriceITF.CreatePercentPriceConfigRequest): Promise<EPriceITF.PercentPriceResponse> {
        try {
            const { userId, name, price, percent } = request;
            const response = await this.ePriceService.createPercentPriceConfig(userId, name, price, percent);
            return {
                status: {
                    code: 200,
                    message: 'Create Percent Price success',
                },
                data: [response],
            };
        }
        catch (error) {
            return {
                status: {
                    code: error.status || 500,
                    message: error.message,
                    error: error.error || 'Internal Server Error',
                },
                data: [],
            };
        }
    }

    async getPercentPriceConfig(request: EPriceITF.GetPercentPriceConfigRequest): Promise<EPriceITF.PercentPriceResponse> {
        try {
            const response = await this.ePriceService.getPercentPriceConfig(request.userId);
            return {
                status: {
                    code: 200,
                    message: 'Get Price success',
                },
                data: response || [],
            };
        }
        catch (error) {
            return {
                status: {
                    code: error.status || 500,
                    message: error.message,
                    error: error.error || 'Internal Server Error',
                },
                data: [],
            };
        }
    }

    async editPercentPriceConfig(request: EPriceITF.EditPercentPriceConfigRequest): Promise<EPriceITF.PercentPriceResponse> {
        try {
            const { id, userId, name, price, percent } = request;
            const response = await this.ePriceService.editPercentPriceConfig(id, userId, name, price, percent);
            return {
                status: {
                    code: 200,
                    message: 'Edit Price success',
                },
                data: [response],
            };
        }
        catch (error) {
            return {
                status: {
                    code: error.status || 500,
                    message: error.message,
                    error: error.error || 'Internal Server Error',
                },
                data: [],
            };
        }
    }

    async deletePercentPriceConfig(request: EPriceITF.DeletePercentPriceConfigRequest): Promise<EPriceITF.DeletePriceConfigResponse> {
        try {
            const { userId, id } = request;
            await this.ePriceService.deletePercentPriceConfig(userId, id);
            return {
                status: {
                    code: 200,
                    message: 'Delete Price success',
                },
            };
        }
        catch (error) {
            return {
                status: {
                    code: error.status || 500,
                    message: error.message,
                    error: error.error || 'Internal Server Error',
                },
            };
        }
    }

    // Stair Price Config methods
    async createStairPriceConfig(request: EPriceITF.CreateStairPriceConfigRequest): Promise<EPriceITF.StairPriceResponse> {
        try {
            const { userId, step, minKwh, maxKwh, price } = request;
            const response = await this.ePriceService.createStairPriceConfig(userId, step, minKwh, maxKwh, price);
            return {
                status: {
                    code: 200,
                    message: 'Create Stair Price success',
                },
                data: [response],
            };
        }
        catch (error) {
            return {
                status: {
                    code: error.status || 500,
                    message: error.message,
                    error: error.error || 'Internal Server Error',
                },
                data: [],
            };
        }
    }

    async getStairPriceConfig(request: EPriceITF.GetStairPriceConfigRequest): Promise<EPriceITF.StairPriceResponse> {
        try {
            const response = await this.ePriceService.getStairPriceConfig(request.userId);
            return {
                status: {
                    code: 200,
                    message: 'Get Price success',
                },
                data: response || [],
            };
        }
        catch (error) {
            return {
                status: {
                    code: error.status || 500,
                    message: error.message,
                    error: error.error || 'Internal Server Error',
                },
                data: [],
            };
        }
    }

    async editStairPriceConfig(request: EPriceITF.EditStairPriceConfigRequest): Promise<EPriceITF.StairPriceResponse> {
        try {
            const { userId, id, step, minKwh, maxKwh, price } = request;
            const response = await this.ePriceService.editStairPriceConfig(userId, id, step, minKwh, maxKwh, price);
            return {
                status: {
                    code: 200,
                    message: 'Edit Price success',
                },
                data: [response],
            };
        }
        catch (error) {
            return {
                status: {
                    code: error.status || 500,
                    message: error.message,
                    error: error.error || 'Internal Server Error',
                },
                data: [],
            };
        }
    }

    async deleteStairPriceConfig(request: EPriceITF.DeleteStairPriceConfigRequest): Promise<EPriceITF.DeletePriceConfigResponse> {
        try {
            const { userId, id } = request;
            await this.ePriceService.deleteStairPriceConfig(userId, id);
            return {
                status: {
                    code: 200,
                    message: 'Delete Price success',
                },
            };
        }
        catch (error) {
            return {
                status: {
                    code: error.status || 500,
                    message: error.message,
                    error: error.error || 'Internal Server Error',
                },
            };
        }
    }

    async getConfigPrice(request: EPriceITF.GetConfigRequest): Promise<EPriceITF.ConfigResponse> {
        try {
            const response = await this.ePriceService.getConfigPrice(request.userId);
            return {
                status: {
                    code: 200,
                    message: 'Get Config Price success',
                },
                data: response,
            };
        }
        catch (error) {
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

    async editConfigPrice(request: EPriceITF.EditConfigRequest): Promise<EPriceITF.ConfigResponse> {
        try {
            const { userId, priceType } = request;
            const response = await this.ePriceService.editConfigPrice(userId, priceType as PriceType);
            return {
                status: {
                    code: 200,
                    message: 'Edit Config Price success',
                },
                data: response,
            };
        }
        catch (error) {
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

    async getStartBillingDate(request: EPriceITF.GetConfigRequest): Promise<EPriceITF.BillingStartDateResponse> {
        try {
            const response = await this.ePriceService.getBillingStartDate(request.userId);
            return {
                status: {
                    code: 200,
                    message: 'Get Billing Start Date success',
                },
                data: response,
            };
        }
        catch (error) {
            return {
                status: {
                    code: error.status || 500,
                    message: error.message,
                    error: error.error || 'Internal Server Error',
                },
            };
        }
    }

    async editStartBillingDate(request: EPriceITF.EditBillingStartDateRequest): Promise<EPriceITF.BillingStartDateResponse> {
        try {
            const { userId, billingCycleStartDay } = request;
            const response = await this.ePriceService.editBillingStartDate(userId, billingCycleStartDay);
            return {
                status: {
                    code: 200,
                    message: 'Edit Billing Start Date success',
                },
                data: response,
            };
        }
        catch (error) {
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