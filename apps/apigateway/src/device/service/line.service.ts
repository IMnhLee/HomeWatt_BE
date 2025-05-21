import { handleMicroserviceResponse } from "@app/common";
import { LineITF } from "@app/common";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

@Injectable()
export class LineService implements OnModuleInit {
    private lineService: LineITF.LineServiceClient;

    constructor(@Inject('line') private client: ClientGrpc) {}

    onModuleInit() {
        this.lineService = 
            this.client.getService<LineITF.LineServiceClient>(LineITF.LINE_SERVICE_NAME);
    }

    async createLine(request: LineITF.CreateLineRequest) {
        const response = await firstValueFrom(this.lineService.createLine(request));
        return handleMicroserviceResponse(response);
    }

    async editLineByUser(request: LineITF.EditLineRequest) {
        const response = await firstValueFrom(this.lineService.editLineByUser(request));
        return handleMicroserviceResponse(response);
    }

    async disconnectLine(request: LineITF.DisconnectLineRequest) {
        const response = await firstValueFrom(this.lineService.disConnectLine(request));
        return handleMicroserviceResponse(response);
    }
}