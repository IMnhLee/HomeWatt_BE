import { MonitoringITF } from "@app/common";
import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from 'path';
import { MonitoringService } from "./monitoring.service";

@Module({
    imports: [
        ClientsModule.register([
            {
                name: MonitoringITF.MONITORING_PACKAGE_NAME,
                transport: Transport.GRPC,
                options: {
                    package: MonitoringITF.MONITORING_PACKAGE_NAME,
                    protoPath: join(__dirname, '../monitoring.proto'),
                    url: 'device:50054'
                },
            }
        ])
    ],
    controllers: [],
    providers: [MonitoringService],
    exports: [MonitoringService]
})
export class MonitoringModule {}