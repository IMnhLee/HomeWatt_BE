import { Controller, Logger } from "@nestjs/common";
import { EPriceService } from "./e_price.service";

@Controller('e_price')
export class EPriceController {
    private readonly logger = new Logger(EPriceController.name);

    constructor(
        private readonly ePriceService: EPriceService,
    ) {}

    async getOnePriceConfig (request: any) {
        try {
            const response = await this.ePriceService.getOnePriceConfig(request.userId);
            return {
                status: {
                    code: 200,
                    message: 'Get Price success',
                    error: '',
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

    async editOnePriceConfig (request: any) {
        try {
            const { userId, price } = request;
            const response = await this.ePriceService.editOnePriceConfig(userId, price);
            return {
                status: {
                    code: 200,
                    message: 'Edit Price success',
                    error: '',
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

    async getPercentPriceConfig (request: any) {
        try {
            const response = await this.ePriceService.getPercentPriceConfig(request.userId);
            return {
                status: {
                    code: 200,
                    message: 'Get Price success',
                    error: '',
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

    async editPercentPriceConfig (request: any) {
        try {
            const { id, userId, name, price, percent } = request;
            const response = await this.ePriceService.editPercentPriceConfig(id, userId, name, price, percent);
            return {
                status: {
                    code: 200,
                    message: 'Edit Price success',
                    error: '',
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

    async getStairPriceConfig (request: any) {
        try {
            const response = await this.ePriceService.getStairPriceConfig(request.userId);
            return {
                status: {
                    code: 200,
                    message: 'Get Price success',
                    error: '',
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

    async editStairPriceConfig (request: any) {
        try {
            const { userId, id, step, minKwh, maxKwh, price } = request;
            const response = await this.ePriceService.editStairPriceConfig(userId, id, step, minKwh, maxKwh, price);
            return {
                status: {
                    code: 200,
                    message: 'Edit Price success',
                    error: '',
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

    async deleteStairPriceConfig (request: any) {
        try {
            const { userId, id } = request;
            const response = await this.ePriceService.deleteStairPriceConfig(userId, id);
            return {
                status: {
                    code: 200,
                    message: 'Delete Price success',
                    error: '',
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

    async deletePercentPriceConfig (request: any) {
        try {
            const { userId, id } = request;
            const response = await this.ePriceService.deletePercentPriceConfig(userId, id);
            return {
                status: {
                    code: 200,
                    message: 'Delete Price success',
                    error: '',
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


}