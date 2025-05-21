import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { MonitoringRepository } from "./monitoring.repository";
import { CreateMonitoringRequest } from "./dto/createMonitoring.request";
import { updateMonitoringByOwner } from "./dto/updateMonitoringByOwner";
import { GetUserMonitoringRequest } from "./dto/getUserMonitoring";
import { AddMonitoringRequest } from "./dto/addMonitoring.request";

@Injectable()
export class MonitoringService {
  private readonly logger = new Logger(MonitoringService.name);
  constructor(
    private readonly monitoringRepository: MonitoringRepository,
  ) {}
  
  async findAll() {
    return this.monitoringRepository.findAll();
  }

  async findByMonitoringCode (code: string) {
    try {
      const monitoring = await this.monitoringRepository.findOneBy({where: {code: code}})
      return {
        id: monitoring.id,
        code: monitoring.code,
        active: monitoring.active,
      }
    }
    catch (error) {
      this.logger.error(`Error finding monitoring by code: ${code}`, error);
      throw new Error('Monitoring not found');
    }
  }

  async addMonitoringByUser (request: AddMonitoringRequest) {
    const { userId, code, name, location } = request;
      const monitoring = await this.monitoringRepository.findOneBy({where: {code: code}})
      if (!monitoring) {
        throw new NotFoundException('Monitoring not found');
      }
    try {
      const response = await this.monitoringRepository.update(monitoring.id, {
        userId: userId,
        name: name,
        location: location,
      })
      return response
    }
    catch (error) {
      this.logger.error(`Error adding monitoring by user: ${request}`, error);
      throw new BadRequestException('Monitoring not added');
    }
  }

  async getMonitoringByOwner (userId: string, code: string) {
    try {
      const monitoring = await this.monitoringRepository.findOneBy({where: {userId: userId, code: code}})
      return {
        id: monitoring.id,
        code: monitoring.code,
        name: monitoring.name,
        location: monitoring.location,
        active: monitoring.active,
      }
    }
    catch (error) {
      this.logger.error(`Error finding monitoring by owner: ${userId}`, error);
      throw new Error('Monitoring not found');
    }
  }

  async createMonitoring (request: CreateMonitoringRequest) {
    try {
      const monitoring = await this.monitoringRepository.create({
        code: request.code,
        active: request.active,
      })
      return monitoring
    }
    catch (error) {
      this.logger.error(`Error creating monitoring: ${request}`, error);
      throw new BadRequestException('Monitoring not created');
    }
  }

  async updateMonitoringByOwner (request: updateMonitoringByOwner) {
    try {
      const monitoring = await this.monitoringRepository.findOneBy({where: {id: request.monitoringId, userId: request.userId}})
      if (!monitoring) {
        throw new NotFoundException('Monitoring not found');
      }
      await this.monitoringRepository.update(request.monitoringId, {
        name: request.name,
        location: request.location,
      })
      return {
        message: 'Monitoring updated successfully',
      }
    }
    catch (error) {
      this.logger.error(`Error updating monitoring by owner: ${request}`, error);
      throw new BadRequestException('Monitoring not updated');
    }
  }

  async getAllMonitoringsByOwner(request: GetUserMonitoringRequest) {
    const { userId, page = 1, limit = 10 } = request;
    try {
      const [monitorings, totalCount] = await this.monitoringRepository.findByUserIdWithPagination(
        userId,
        page,
        limit
      );

      const formattedMonitorings = monitorings.map(monitoring => ({
        id: monitoring.id,
        code: monitoring.code,
        name: monitoring.name,
        location: monitoring.location,
        active: monitoring.active,
        lines: monitoring.lines?.map(line => ({
          id: line.id,
          code: line.code,
          name: line.name,
          active: line.active,
          room: line.room ? {
            id: line.room.id,
            name: line.room.name,
            floor: line.room.floor ? {
              id: line.room.floor.id,
              name: line.room.floor.name,
            } : undefined,
          } : undefined,
        })) || [],
      }));

      return {
        data: formattedMonitorings,
        meta: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      };
    } catch (error) {
      this.logger.error(`Error fetching user monitorings for userId: ${userId}`, error);
      throw new BadRequestException('Failed to retrieve monitoring devices');
    }
  }

  async removeMonitoring (monitoringId: string) {
    try {
      const monitoring = await this.monitoringRepository.findOneBy({where: {id: monitoringId}})
      if (!monitoring) {
        throw new NotFoundException('Monitoring not found');
      }
      await this.monitoringRepository.update(monitoringId, {
        userId: null as unknown as string,
      })
      return {
        message: 'Monitoring removed successfully',
      }
    }
    catch (error) {
      this.logger.error(`Error deleting monitoring: ${monitoringId}`, error);
      throw new BadRequestException('Monitoring not deleted');
    }
  }

}