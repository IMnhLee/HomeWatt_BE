import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { FloorRepository } from "./floor.repository";

@Injectable()
export class FloorService {
    private readonly logger = new Logger(FloorService.name);
    constructor(
        private readonly floorRepository: FloorRepository,
        // private readonly monitoringRepository: MonitoringRepository,
    ) {}

    async getAllFloor (userId: string) {
        try {
            const floors = await this.floorRepository.findWithOptions({
                where: { userId: userId },
                relations: ['rooms', 'rooms.lines', 'rooms.lines.monitoring'], // Still need this relation for the code
                order: {
                    createdAt: 'ASC',
                    rooms: {
                        createdAt: 'ASC',
                        lines: {
                            createdAt: 'ASC'
                        }
                    }
                }
            });
            
            // Transform the result to include monitoring code but remove the monitoring object
            return floors.map(floor => ({
                ...floor,
                rooms: floor.rooms.map(room => ({
                    ...room,
                    lines: room.lines.map(line => {
                        // Extract monitoring code
                        const monitoringCode = line.monitoring?.code;
                        
                        // Create a new object without the monitoring field
                        const { monitoring, ...lineWithoutMonitoring } = line;
                        
                        // Return the line with monitoring code but without monitoring object
                        return {
                            ...lineWithoutMonitoring,
                            monitoringCode
                        };
                    })
                }))
            }));
        }
        catch (error) {
            this.logger.error(`Error finding all floors by user: ${userId}`, error);
            throw new BadRequestException('fail to find floors');
        }
    }

    async getAllFloorAndRoom (userId: string) {
        try {
            const floors = await this.floorRepository.findWithOptions({
                where: { userId: userId },
                relations: ['rooms'], // Sửa từ 'rooms.line' thành 'rooms.lines'
                order: {
                    createdAt: 'ASC',
                    rooms: {
                        createdAt: 'ASC',
                    }
                }
            });
            return floors;
        }
        catch (error) {
            this.logger.error(`Error finding all floors by user: ${userId}`, error);
            throw new BadRequestException('fail to find floors');
        }
    }

    async addFloor (userId: string, name: string) {
        try {
            const floor = await this.floorRepository.create({
                userId: userId,
                name: name,
            })
            return floor;
        }
        catch (error) {
            this.logger.error(`Error creating floor: ${name}`, error);
            throw new BadRequestException('fail to create floor');
        }
    }

    async editFloor (floorId: string, userId: string, name: string) {
        const floor = await this.floorRepository.findOneBy({where: {id: floorId, userId: userId}})
        if (!floor) {
            throw new BadRequestException('Floor not found');
        }
        try {
            const response = await this.floorRepository.update(floor.id, {
                name: name,
            })
            return response
        }
        catch (error) {
            this.logger.error(`Error updating floor by user: ${floorId}`, error);
            throw new BadRequestException('fail to update floor');
        }
    }

    //delete floor and all rooms
    async deleteFloor(floorId: string, userId: string) {
        try {
            const result = await this.floorRepository.deleteFloorAndPreserveLines(floorId, userId);
            return { success: result };
        } catch (error) {
            this.logger.error(`Error deleting floor: ${floorId}`, error);
            throw new BadRequestException('Failed to delete floor: ' + error.message);
        }
    }
}