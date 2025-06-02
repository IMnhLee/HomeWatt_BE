import { handleMicroserviceResponse, MonitoringITF } from "@app/common";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

@Injectable()
export class MonitoringService implements OnModuleInit {
    private monitoringService: MonitoringITF.MonitoringServiceClient;

    constructor(@Inject(MonitoringITF.MONITORING_PACKAGE_NAME) private client: ClientGrpc) {}

    onModuleInit() {
        this.monitoringService =
            this.client.getService<MonitoringITF.MonitoringServiceClient>(MonitoringITF.MONITORING_SERVICE_NAME);
    }

    async getUserMonitoring (userId: string) {
        const response = await firstValueFrom(this.monitoringService.getUserMonitoring({ userId }));
        return handleMicroserviceResponse(response)
    }
}