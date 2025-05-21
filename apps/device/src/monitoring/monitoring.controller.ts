import { Controller } from "@nestjs/common";
import { MonitoringService } from "./monitoring.service";
import { MonitoringITF } from "@app/common";

@Controller()
@MonitoringITF.MonitoringServiceControllerMethods()
export class MonitoringController implements MonitoringITF.MonitoringServiceController {
    constructor(
        private readonly monitoringService: MonitoringService,
    ) {}

    async createMonitoring(request: MonitoringITF.CreateMonitoringRequest): Promise<MonitoringITF.MonitoringResponse> {
        try {
            const response = await this.monitoringService.createMonitoring(request);
            return {
                status: {
                    code: 200,
                    message: 'Create monitoring success',
                    error: '',
                },
                data: response,
            };
        } catch (error) {
            return {
                status: {
                    code: error.status || 500,
                    message: error.message,
                    error: error.error || 'Internal Server Error',
                },
            };
        }
    }

    async addMonitoringByUser(request: MonitoringITF.AddMonitoringRequest): Promise<MonitoringITF.MonitoringResponse> {
        try {
            const response = await this.monitoringService.addMonitoringByUser(request);
            return {
                status: {
                    code: 200,
                    message: 'Add monitoring success',
                    error: '',
                },
                data: response,
            };
        } catch (error) {
            return {
                status: {
                    code: error.status || 500,
                    message: error.message,
                    error: error.error || 'Internal Server Error',
                },
            };
        }
    }

    async updateMonitoringByOwner(request: MonitoringITF.UpdateMonitoringRequest): Promise<MonitoringITF.StatusResponse> {
        try {
            await this.monitoringService.updateMonitoringByOwner(request);
            return {
                status: {
                    code: 200,
                    message: 'Update monitoring success',
                    error: '',
                }
            };
        } catch (error) {
            return {
                status: {
                    code: error.status || 500,
                    message: error.message,
                    error: error.error || 'Internal Server Error',
                }
            };
        }
    }

    async removeMonitoringByOwner(request: MonitoringITF.RemoveMonitoringRequest): Promise<MonitoringITF.StatusResponse> {
        try {
            await this.monitoringService.removeMonitoring(request.monitoringId);
            return {
                status: {
                    code: 200,
                    message: 'Remove monitoring success',
                    error: '',
                }
            };
        } catch (error) {
            return {
                status: {
                    code: error.status || 500,
                    message: error.message,
                    error: error.error || 'Internal Server Error',
                }
            };
        }
    }

    async getMonitoringsByOwner(request: MonitoringITF.GetMonitoringsRequest): Promise<MonitoringITF.GetMonitoringsResponse> {
        try {
            const response = await this.monitoringService.getAllMonitoringsByOwner(request);
            return {
                status: {
                    code: 200,
                    message: 'Get monitoring success',
                    error: '',
                },
                data: response,
            };
        } catch (error) {
            return {
                status: {
                    code: error.status || 500,
                    message: error.message,
                    error: error.error || 'Internal Server Error',
                },
            };
        }
    }
}