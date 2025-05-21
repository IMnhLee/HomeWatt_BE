import { Controller, Logger } from "@nestjs/common";
import { FloorService } from "./floor.service";
import {FloorITF} from "@app/common";

@Controller()
@FloorITF.FloorServiceControllerMethods()
export class FloorController implements FloorITF.FloorServiceController {
  private readonly logger = new Logger(FloorController.name);
  
  constructor(private readonly floorService: FloorService) {}

  async getAllFloor(request: FloorITF.GetAllFloorRequest): Promise<FloorITF.FloorsResponse> {
    try {
      const { userId } = request;
      const floors = await this.floorService.getAllFloor(userId);
      return {
        status: {
          code: 200,
          message: 'Get all floors success',
        },
        data: floors
      };
    } catch (error) {
      this.logger.error(`Error getting floors: ${error.message}`, error.stack);
      return {
        status: {
          code: error.status || 500,
          message: error.message,
          error: error.error || 'Internal Server Error',
        },
        data: []
      };
    }
  }

  async getAllFloorAndRoom(request: FloorITF.GetAllFloorRequest): Promise<FloorITF.FloorsResponse> {
    try {
      const { userId } = request;
      const floors = await this.floorService.getAllFloorAndRoom(userId);
      
      return {
        status: {
          code: 200,
          message: 'Get all floors and rooms success',
        },
        data: floors
      };
    } catch (error) {
      this.logger.error(`Error getting floors and rooms: ${error.message}`, error.stack);
      return {
        status: {
          code: error.status || 500,
          message: error.message,
          error: error.error || 'Internal Server Error',
        },
        data: []
      }
    }
  }

  async addFloor(request: FloorITF.AddFloorRequest): Promise<FloorITF.FloorResponse> {
    try {
      const { userId, name } = request;
      const floor = await this.floorService.addFloor(userId, name);
      
      return {
        status: {
          code: 200,
          message: 'Add floor success',
        },
        data: floor,
      };
    } catch (error) {
      this.logger.error(`Error adding floor: ${error.message}`, error.stack);
      return {
        status: {
          code: error.status || 500,
          message: error.message,
          error: error.error || 'Internal Server Error',
        },
      };
    }
  }

  async editFloor(request: FloorITF.EditFloorRequest): Promise<FloorITF.FloorResponse> {
    try {
      const { floorId, userId, name } = request;
      const result = await this.floorService.editFloor(floorId, userId, name);
      
      return {
        status: {
          code: 200,
          message: 'Edit floor success',
        },
        data: result
      };
    } catch (error) {
      this.logger.error(`Error editing floor: ${error.message}`, error.stack);
      return {
        status: {
          code: error.status || 500,
          message: error.message,
          error: error.error || 'Internal Server Error',
        },
      };
    }
  }

  async deleteFloor(request: FloorITF.DeleteFloorRequest): Promise<FloorITF.DeleteFloorResponse> {
    try {
      const { floorId, userId } = request;
      await this.floorService.deleteFloor(floorId, userId);
      
      return {
        status: {
          code: 200,
          message: 'Delete floor success',
        },
      };
    } catch (error) {
      this.logger.error(`Error deleting floor: ${error.message}`, error.stack);
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