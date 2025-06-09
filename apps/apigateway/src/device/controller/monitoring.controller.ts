import { MonitoringITF } from "@app/common";
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { MonitoringService } from "../service/monitoring.service";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import { AdminRoleGuard } from "../../auth/guards/admin-role.guard";

@Controller('monitoring')
export class MonitoringController {
    constructor(private readonly monitoringService: MonitoringService) {}
    
    @Get()
    @UseGuards(JwtAuthGuard)
    async getAllMonitorings(@Query('page') page: number = 1, @Query('limit') limit: number = 10, @CurrentUser() user) {
        const request = { page: +page, limit: +limit, userId: user.id };
        return await this.monitoringService.GetAllMonitors(request);
    }
    
    @Post()
    @UseGuards(JwtAuthGuard)
    async addMonitoring(@Body() request, @CurrentUser() user) {
        const body: MonitoringITF.AddMonitoringRequest = {
            userId: user.id,
            code: request.code,
            name: request.name,
            location: request.location,
        };
        return await this.monitoringService.AddMonitoring(body);
    }
    
    @Put()
    @UseGuards(JwtAuthGuard)
    async updateMonitoring(@Body() body, @CurrentUser() user) {
        const request: MonitoringITF.UpdateMonitoringRequest = {
            userId: user.id,
            monitoringId: body.id,
            name: body.name,
            location: body.location,
        };
        return await this.monitoringService.UpdateMonitoring(request);
    }
    
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async removeMonitoring(@Param('id') id: string) {
        const request: MonitoringITF.RemoveMonitoringRequest = { monitoringId: id };
        return await this.monitoringService.RemoveMonitoring(request);
    }
    
    @Post('create')
    @UseGuards(JwtAuthGuard)
    async createMonitoring(@Body() body: MonitoringITF.CreateMonitoringRequest) {
        return await this.monitoringService.CreateMonitoring(body);
    }
}