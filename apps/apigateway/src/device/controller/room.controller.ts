import { RoomITF } from "@app/common";
import { Body, Controller, Delete, Param, Post, Put, UseGuards } from "@nestjs/common";
import { RoomService } from "../service/room.service";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";

@Controller('room')
export class RoomController {
    constructor(private readonly roomService: RoomService) {}
    
    @Post()
    @UseGuards(JwtAuthGuard)
    async addRoom(@Body() request: RoomITF.AddRoomRequest) {
        return await this.roomService.addRoom(request);
    }
    
    @Put()
    @UseGuards(JwtAuthGuard)
    async editRoom(@Body() request: RoomITF.EditRoomRequest) {
        return await this.roomService.editRoom(request);
    }
    
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteRoom(@Param('id') roomId: string) {
        const request: RoomITF.DeleteRoomRequest = {
            roomId: roomId
        };
        return await this.roomService.deleteRoom(request);
    }
}