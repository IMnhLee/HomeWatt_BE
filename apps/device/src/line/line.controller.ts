import { Controller, Logger } from "@nestjs/common";
import { LineService } from "./line.service";
import { LineITF } from "@app/common";

@Controller('line')
@LineITF.LineServiceControllerMethods()
export class LineController implements LineITF.LineServiceController {
    private readonly logger = new Logger(LineController.name);
    
    constructor(
        private readonly lineService: LineService,
    ) {}

    async createLine(request: LineITF.CreateLineRequest): Promise<LineITF.LineResponse> {
        try {
            const { code, monitoringId } = request;
            const response = await this.lineService.createLine(code, monitoringId);
            return {
                status: {
                    code: 200,
                    message: 'Create line success',
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

    async editLineByUser(request: LineITF.EditLineRequest): Promise<LineITF.LineResponse> {
        try {
            const response = await this.lineService.updateLineByUser(request);
            return {
                status: {
                    code: 200,
                    message: 'Update line success',
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

    async disConnectLine(request: LineITF.DisconnectLineRequest): Promise<LineITF.LineResponse> {
        try {
            const { lineId, userId, monitoringId } = request;
            const response = await this.lineService.disconnectLine(lineId, userId, monitoringId);
            return {
                status: {
                    code: 200,
                    message: 'Disconnect line success',
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