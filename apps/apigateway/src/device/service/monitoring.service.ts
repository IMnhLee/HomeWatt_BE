import { handleMicroserviceResponse, MonitoringITF } from "@app/common";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

@Injectable()
export class MonitoringService implements OnModuleInit {
    private monitoringService: MonitoringITF.MonitoringServiceClient;

    constructor(@Inject('monitoring') private client: ClientGrpc) {}

    onModuleInit() {
        this.monitoringService =
            this.client.getService<MonitoringITF.MonitoringServiceClient>(MonitoringITF.MONITORING_SERVICE_NAME);
    }

    async GetAllMonitors( request: MonitoringITF.GetMonitoringsRequest) { 
        const response = await firstValueFrom(this.monitoringService.getMonitoringsByOwner(request));
        return handleMicroserviceResponse(response);
    }

    async AddMonitoring(request: MonitoringITF.AddMonitoringRequest) {
        const response = await firstValueFrom(this.monitoringService.addMonitoringByUser(request));
        return handleMicroserviceResponse(response);
    }

    async UpdateMonitoring(request: MonitoringITF.UpdateMonitoringRequest) {
        const response = await firstValueFrom(this.monitoringService.updateMonitoringByOwner(request));
        return handleMicroserviceResponse(response);
    }

    async RemoveMonitoring(request: MonitoringITF.RemoveMonitoringRequest) {
        const response = await firstValueFrom(this.monitoringService.removeMonitoringByOwner(request));
        return handleMicroserviceResponse(response);
    }

    async CreateMonitoring(request: MonitoringITF.CreateMonitoringRequest) {
        const response = await firstValueFrom(this.monitoringService.createMonitoring(request));
        return handleMicroserviceResponse(response);
    }
}