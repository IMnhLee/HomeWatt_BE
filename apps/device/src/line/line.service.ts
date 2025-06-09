import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { LineRepository } from "./line.repository";
import { UpdateLineByUser } from "./dto/UpdateLineByUser";
import { MonitoringRepository } from "../monitoring/monitoring.repository";

@Injectable()
export class LineService {
    private readonly logger = new Logger(LineService.name);
    constructor(
        private readonly lineRepository: LineRepository,
        private readonly monitoringRepository: MonitoringRepository,
    ) {}
    async findAll() {
        return this.lineRepository.findAll();
    }

    async createLine (code: string, monitoringId: string) {
        try {
            const monitoring = await this.monitoringRepository.findOneBy({where: {id: monitoringId}})
            if (!monitoring) {
                throw new Error('Monitoring not found');
            }
            const line = await this.lineRepository.create({
                code: code,
                monitoringId: monitoringId,
            })
            return line;
        }
        catch (error) {
            this.logger.error(`Error creating line: ${code}`, error);
            throw new Error('Line not created');
        }
    }

    async findLinesByMonitoring (monitoringId: string) {
        try {
            const lines = await this.lineRepository.findOneBy({where: {monitoringId: monitoringId}})
            return lines;
        }
        catch (error) {
            this.logger.error(`Error finding line by code: ${monitoringId}`, error);
            throw new Error('Line not found');
        }
    }

    async updateLineByUser (request: UpdateLineByUser) {
        const { userId, monitoringId, lineId, name, roomId } = request;
        const monitoring = await this.monitoringRepository.findOneBy({where: {id: monitoringId}})
        if (!monitoring) {
            throw new NotFoundException('Monitoring not found');
        }
        if (monitoring.active === false) {
            throw new BadRequestException('Monitoring is not active');
        }

        if (monitoring.userId !== userId) {
            throw new UnauthorizedException('User is not owner of monitoring');
        }

        try {
            const line = await this.lineRepository.findOneBy({where: {id: lineId, monitoringId: monitoringId}})
            if (!line) {
                throw new Error('Line not found');
            }
            const response = await this.lineRepository.update(line.id, {
                name: name,
                roomId: roomId || null as unknown as string,
                active: true,
            })
            return response
        }
        catch (error) {
            this.logger.error(`Error updating line by user: ${userId}`, error);
            throw new Error('Line not updated');
        }
    }

    async disconnectLine (lineId: string, userId: string, monitoringId: string) {
        const monitoring = await this.monitoringRepository.findOneBy({where: {id: monitoringId}})
        if (!monitoring) {
            throw new NotFoundException('Monitoring not found');
        }
        if (monitoring.active === false) {
            throw new BadRequestException('Monitoring is not active');
        }
        if (monitoring.userId !== userId) {
            throw new UnauthorizedException('User is not owner of monitoring');
        }
        try {
            const line = await this.lineRepository.findOneBy({where: {id: lineId, monitoringId: monitoringId}})
            if (!line) {
                throw new Error('Line not found');
            }
            const response = await this.lineRepository.update(line.id, {
                roomId: null as unknown as string,
                name: null as unknown as string,
                active: false,
            })
            return response
        }
        catch (error) {
            this.logger.error(`Error disconnecting line: ${lineId}`, error);
            throw new Error('Line not dísconnected');
        }
    }
}