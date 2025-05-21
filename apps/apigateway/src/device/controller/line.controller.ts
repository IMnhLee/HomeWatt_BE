import { LineITF } from "@app/common";
import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { LineService } from "../service/line.service";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import { AdminRoleGuard } from "../../auth/guards/admin-role.guard";
import { UpdateLineByUser } from "../dto/updateLineByUser.dto";

@Controller('line')
export class LineController {
    constructor(private readonly lineService: LineService) {}
    
    @Post()
    @UseGuards(JwtAuthGuard)
    async createLine(@Body() request: LineITF.CreateLineRequest) {
        return await this.lineService.createLine(request);
    }
    
    @Post('edit')
    @UseGuards(JwtAuthGuard)
    async editLine(@Body() body: UpdateLineByUser, @CurrentUser() user) {
        const request: LineITF.EditLineRequest = {
            userId: user.id,
            monitoringId: body.monitoringId,
            lineId: body.lineId,
            name: body.name,
            roomId: body.roomId
        };
        return await this.lineService.editLineByUser(request);
    }
    
    @Post('disconnect')
    @UseGuards(JwtAuthGuard)
    async disconnectLine(@Body() body, @CurrentUser() user) {
        const request: LineITF.DisconnectLineRequest = {
            userId: user.id,
            monitoringId: body.monitoringId,
            lineId: body.lineId
        };
        return await this.lineService.disconnectLine(request);
    }
}