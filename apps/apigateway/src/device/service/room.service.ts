import { handleMicroserviceResponse } from "@app/common";
import { RoomITF } from "@app/common";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

@Injectable()
export class RoomService implements OnModuleInit {
    private roomService: RoomITF.RoomServiceClient;

    constructor(@Inject('room') private client: ClientGrpc) {}

    onModuleInit() {
        this.roomService = 
            this.client.getService<RoomITF.RoomServiceClient>(RoomITF.ROOM_SERVICE_NAME);
    }

    async addRoom(request: RoomITF.AddRoomRequest) {
        const response = await firstValueFrom(this.roomService.addRoom(request));
        return handleMicroserviceResponse(response);
    }

    async editRoom(request: RoomITF.EditRoomRequest) {
        const response = await firstValueFrom(this.roomService.editRoom(request));
        return handleMicroserviceResponse(response);
    }

    async deleteRoom(request: RoomITF.DeleteRoomRequest) {
        const response = await firstValueFrom(this.roomService.deleteRoom(request));
        return handleMicroserviceResponse(response);
    }
}