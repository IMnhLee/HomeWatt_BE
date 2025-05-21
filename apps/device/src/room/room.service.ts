import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { RoomRepository } from "./room.repository";

@Injectable()
export class RoomService {
    private readonly logger = new Logger(RoomService.name);
    constructor(
        private readonly roomRepository: RoomRepository,
    ) {}

    async editRoomByUser (roomId: string, name: string) {
        const room = await this.roomRepository.findOneBy({where: {id: roomId}})
        if (!room) {
            throw new Error('Room not found');
        }
        try {
            const response = await this.roomRepository.update(room.id, {
                name: name,
            })
            return response
        }
        catch (error) {
            this.logger.error(`Error updating room by user: ${roomId}`, error);
            throw new NotFoundException('Room not found');
        }
    }

    async addRoomByUser (name: string, floorId: string) {
        try {
            const room = await this.roomRepository.create({
                name: name,
                floorId: floorId,
            })
            return room;
        }
        catch (error) {
            this.logger.error(`Error creating room: ${name}`, error);
            throw new BadRequestException('fail to create room');
        }
    }

    async deleteRoomByUser (roomId: string) {
        const room = await this.roomRepository.findOneBy({where: {id: roomId}})
        if (!room) {
            throw new NotFoundException('Room not found');
        }
        try {
            const response = await this.roomRepository.delete(room.id)
            return response
        }
        catch (error) {
            this.logger.error(`Error deleting room by user: ${roomId}`, error);
            throw new NotFoundException('Room not found');
        }
    }
}