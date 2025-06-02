import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { EnergyService } from "../service/energy.service";
import { EnergyITF } from "@app/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import { GetTimeEnergyConsumptionDto } from "../dto/consumption.dto";

@Controller("energy")
export class EnergyController {
    constructor(private readonly energyService: EnergyService) {}

    @Get("consumption")
    @UseGuards(JwtAuthGuard)
    async getEnergyConsumption(@CurrentUser() user) {
        const request: EnergyITF.GetEnergyConsumptionRequest = {
            userId: user.id
        };
        return await this.energyService.getEnergyConsumptionAndCost(request);
    }

    @Post("consumption")
    @UseGuards(JwtAuthGuard)
    async getTimeEnergyConsumption(@CurrentUser() user,@Body() body: GetTimeEnergyConsumptionDto) {
        const request: EnergyITF.GetTimeEnergyConsumptionRequest = {
            userId: user.id,
            date: body.date,
            viewType: body.viewType
        };
        return await this.energyService.getEnergyConsumption(request);
    }
}