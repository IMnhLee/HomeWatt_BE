import { handleMicroserviceResponse } from "@app/common";
import { FloorITF } from "@app/common";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

@Injectable()
export class FloorService implements OnModuleInit {
    private floorService: FloorITF.FloorServiceClient;

    constructor(@Inject('floor') private client: ClientGrpc) {}

    onModuleInit() {
        this.floorService = 
            this.client.getService<FloorITF.FloorServiceClient>(FloorITF.FLOOR_SERVICE_NAME);
    }

    async getAllFloors(request: FloorITF.GetAllFloorRequest) {
        const response = await firstValueFrom(this.floorService.getAllFloor(request));
        return handleMicroserviceResponse(response);
    }

    async addFloor(request: FloorITF.AddFloorRequest) {
        const response = await firstValueFrom(this.floorService.addFloor(request));
        return handleMicroserviceResponse(response);
    }

    async editFloor(request: FloorITF.EditFloorRequest) {
        const response = await firstValueFrom(this.floorService.editFloor(request));
        return handleMicroserviceResponse(response);
    }

    async deleteFloor(request: FloorITF.DeleteFloorRequest) {
        const response = await firstValueFrom(this.floorService.deleteFloor(request));
        return handleMicroserviceResponse(response);
    }
}