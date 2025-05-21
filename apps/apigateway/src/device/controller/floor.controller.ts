import { FloorITF } from "@app/common";
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { FloorService } from "../service/floor.service";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";

@Controller('floor')
export class FloorController {
    constructor(private readonly floorService: FloorService) {}
    
    @Get()
    @UseGuards(JwtAuthGuard)
    async getAllFloors(@CurrentUser() user) {
        const request: FloorITF.GetAllFloorRequest = {
            userId: user.id
        };
        return await this.floorService.getAllFloors(request);
    }
    
    @Post()
    @UseGuards(JwtAuthGuard)
    async addFloor(@Body() body, @CurrentUser() user) {
        const request: FloorITF.AddFloorRequest = {
            userId: user.id,
            name: body.name
        };
        return await this.floorService.addFloor(request);
    }
    
    @Put()
    @UseGuards(JwtAuthGuard)
    async editFloor(@Body() body, @CurrentUser() user) {
        const request: FloorITF.EditFloorRequest = {
            floorId: body.floorId,
            userId: user.id,
            name: body.name
        };
        return await this.floorService.editFloor(request);
    }
    
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteFloor(@Param('id') floorId: string, @CurrentUser() user) {
        const request: FloorITF.DeleteFloorRequest = {
            floorId: floorId,
            userId: user.id
        };
        return await this.floorService.deleteFloor(request);
    }
}