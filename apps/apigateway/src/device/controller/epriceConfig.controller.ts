import { EPriceITF } from "@app/common";
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { EpriceConfigService } from "../service/epriceConfig.service";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import { EditOnePriceDto } from "../dto/oneprice.dto";
import { CreatePercentPriceDto, DeletePercentPriceDto, EditPercentPriceDto } from "../dto/percentprice.dto";
import { CreateStairPriceDto, DeleteStairPriceDto, EditStairPriceDto } from "../dto/stairprice.dto";
import { EditConfigPriceDto } from "../dto/configPrice.dto";
import { EditStartBillingDateDto } from "../dto/configStartBillingDate";

@Controller('epriceConfig')
export class EpriceConfigController {
    constructor(private readonly epriceConfigService: EpriceConfigService) {}

    @Get('')
    @UseGuards(JwtAuthGuard)
    async getEpriceConfig(@CurrentUser() user) {
        const request: EPriceITF.GetConfigRequest = {
            userId: user.id
        };
        return await this.epriceConfigService.getConfigPrice(request);
    }

    @Post('edit')
    @UseGuards(JwtAuthGuard)
    async editEpriceConfig(@Body() body: EditConfigPriceDto, @CurrentUser() user) {
        const request: EPriceITF.EditConfigRequest = {
            userId: user.id,
            priceType: body.priceType
        };
        return await this.epriceConfigService.editConfigPrice(request);
    }

    @Get('/startBillingDate')
    @UseGuards(JwtAuthGuard)
    async getBillingStartDate(@CurrentUser() user) {
        const request: EPriceITF.GetConfigRequest = {
            userId: user.id
        };
        return await this.epriceConfigService.getStartBillingDate(request);
    }

    @Post('/startBillingDate/edit')
    @UseGuards(JwtAuthGuard)
    async editBillingStartDate(@Body() body: EditStartBillingDateDto, @CurrentUser() user) {
        const request: EPriceITF.EditBillingStartDateRequest = {
            userId: user.id,
            billingCycleStartDay: body.billingCycleStartDay
        };
        return await this.epriceConfigService.editStartBillingDate(request);
    }

    // One Price Config Endpoints
    @Get('onePrice')
    @UseGuards(JwtAuthGuard)
    async getOnePriceConfig(@CurrentUser() user) {
        const request: EPriceITF.GetOnePriceConfigRequest = {
            userId: user.id
        };
        return await this.epriceConfigService.getOnePriceConfig(request);
    }

    @Post('onePrice/create')
    @UseGuards(JwtAuthGuard)
    async createOnePriceConfig(@Body() body: EditOnePriceDto, @CurrentUser() user) {
        const request: EPriceITF.OnePriceRequest = {
            userId: user.id,
            price: body.price
        };
        return await this.epriceConfigService.createOnePriceConfig(request);
    }

    @Post('onePrice')
    @UseGuards(JwtAuthGuard)
    async editOnePriceConfig(@Body() body: EditOnePriceDto, @CurrentUser() user) {
        const request: EPriceITF.OnePriceRequest = {
            userId: user.id,
            price: body.price
        };
        return await this.epriceConfigService.editOnePriceConfig(request);
    }

    // Percent Price Config Endpoints
    @Get('percentPrice')
    @UseGuards(JwtAuthGuard)
    async getPercentPriceConfig(@CurrentUser() user) {
        const request: EPriceITF.GetPercentPriceConfigRequest = {
            userId: user.id
        };
        return await this.epriceConfigService.getPercentPriceConfig(request);
    }

    @Post('percentPrice/create')
    @UseGuards(JwtAuthGuard)
    async createPercentPriceConfig(@Body() body: CreatePercentPriceDto, @CurrentUser() user) {
        const request: EPriceITF.CreatePercentPriceConfigRequest = {
            userId: user.id,
            name: body.name,
            price: body.price,
            percent: body.percent
        };
        return await this.epriceConfigService.createPercentPriceConfig(request);
    }

    @Post('percentPrice/edit')
    @UseGuards(JwtAuthGuard)
    async editPercentPriceConfig(@Body() body: EditPercentPriceDto, @CurrentUser() user) {
        const request: EPriceITF.EditPercentPriceConfigRequest = {
            id: body.id,
            userId: user.id,
            name: body.name,
            price: body.price,
            percent: body.percent
        };
        return await this.epriceConfigService.editPercentPriceConfig(request);
    }

    @Post('percentPrice/delete')
    @UseGuards(JwtAuthGuard)
    async deletePercentPriceConfig(@Body() body: DeletePercentPriceDto, @CurrentUser() user) {
        const request: EPriceITF.DeletePercentPriceConfigRequest = {
            userId: user.id,
            id: body.id
        };
        return await this.epriceConfigService.deletePercentPriceConfig(request);
    }

    // Stair Price Config Endpoints
    @Get('stairPrice')
    @UseGuards(JwtAuthGuard)
    async getStairPriceConfig(@CurrentUser() user) {
        const request: EPriceITF.GetStairPriceConfigRequest = {
            userId: user.id
        };
        return await this.epriceConfigService.getStairPriceConfig(request);
    }

    @Post('stairPrice/create')
    @UseGuards(JwtAuthGuard)
    async createStairPriceConfig(@Body() body: CreateStairPriceDto, @CurrentUser() user) {
        const request: EPriceITF.CreateStairPriceConfigRequest = {
            userId: user.id,
            step: body.step,
            minKwh: body.minKwh,
            maxKwh: body.maxKwh,
            price: body.price
        };
        return await this.epriceConfigService.createStairPriceConfig(request);
    }

    @Post('stairPrice/edit')
    @UseGuards(JwtAuthGuard)
    async editStairPriceConfig(@Body() body: EditStairPriceDto, @CurrentUser() user) {
        const request: EPriceITF.EditStairPriceConfigRequest = {
            userId: user.id,
            id: body.id,
            step: body.step,
            minKwh: body.minKwh,
            maxKwh: body.maxKwh,
            price: body.price
        };
        return await this.epriceConfigService.editStairPriceConfig(request);
    }

    @Post('stairPrice/delete')
    @UseGuards(JwtAuthGuard)
    async deleteStairPriceConfig(@Body() body: DeleteStairPriceDto, @CurrentUser() user) {
        const request: EPriceITF.DeleteStairPriceConfigRequest = {
            userId: user.id,
            id: body.id
        };
        return await this.epriceConfigService.deleteStairPriceConfig(request);
    }
}