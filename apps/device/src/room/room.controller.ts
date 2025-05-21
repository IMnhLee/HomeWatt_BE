import { Controller, Logger } from "@nestjs/common";
import { RoomService } from "./room.service";
import {RoomITF} from "@app/common";

@Controller()
@RoomITF.RoomServiceControllerMethods()
export class RoomController implements RoomITF.RoomServiceController {
    private readonly logger = new Logger(RoomController.name);
    
    constructor(
        private readonly roomService: RoomService,
    ) {}

    async addRoom(request: RoomITF.AddRoomRequest): Promise<RoomITF.RoomResponse> {
        try {
            const { name, floorId } = request;
            const response = await this.roomService.addRoomByUser(name, floorId);
            
            return {
                status: {
                    code: 200,
                    message: 'Room created successfully',
                },
                data: response,
            };
        } catch (error) {
            this.logger.error(`Error creating room: ${error.message}`, error.stack);
            
            return {
                status: {
                    code: error.status || 500,
                    message: error.message,
                    error: error.error || 'Internal Server Error',
                },
            };
        }
    }

    async editRoom(request: RoomITF.EditRoomRequest): Promise<RoomITF.RoomResponse> {
        try {
            const { roomId, name } = request;
            const response = await this.roomService.editRoomByUser(roomId, name);
            
            return {
                status: {
                    code: 200,
                    message: 'Room updated successfully',
                },
                data: response,
            };
        } catch (error) {
            this.logger.error(`Error updating room: ${error.message}`, error.stack);
            
            return {
                status: {
                    code: error.status || 500,
                    message: error.message,
                    error: error.error || 'Internal Server Error',
                },
            };
        }
    }

    async deleteRoom(request: RoomITF.DeleteRoomRequest): Promise<RoomITF.DeleteRoomResponse> {
        try {
            const { roomId } = request;
            await this.roomService.deleteRoomByUser(roomId);
            
            return {
                status: {
                    code: 200,
                    message: 'Room deleted successfully',
                },
            };
        } catch (error) {
            this.logger.error(`Error deleting room: ${error.message}`, error.stack);
            
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