import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { Floor } from "../entities/floor.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Line } from "../entities/line.entity";
import { Room } from "../entities/room.entity";

@Injectable()
export class FloorRepository extends AbstractRepository<Floor> {
    protected readonly logger = new Logger(FloorRepository.name);

    constructor(
        @InjectRepository(Floor)
        private readonly floorRepository: Repository<Floor>
    ) {
        super(floorRepository);
    }
    
    /**
     * Delete a floor and its rooms while preserving lines by setting roomId to null
     */
    async deleteFloorAndPreserveLines(floorId: string, userId: string): Promise<boolean> {
        return this.repository.manager.transaction(async transactionalEntityManager => {
            try {
                // Verify the floor exists and belongs to the user
                const floor = await transactionalEntityManager
                    .createQueryBuilder(Floor, 'floor')
                    .where('floor.id = :floorId AND floor.userId = :userId', { floorId, userId })
                    .getOne();
                
                if (!floor) {
                    throw new Error('Floor not found or does not belong to this user');
                }
                
                // Step 1: Update lines to set roomId to null
                await transactionalEntityManager
                    .createQueryBuilder()
                    .update(Line)
                    .set({ roomId: null })
                    .where(`"line"."room_id" IN (SELECT "room"."id" FROM "room" WHERE "room"."floor_id" = :floorId)`, { floorId })
                    .execute();
                
                // Step 2: Delete rooms
                await transactionalEntityManager
                    .createQueryBuilder()
                    .delete()
                    .from(Room)
                    .where('"floor_id" = :floorId', { floorId })
                    .execute();
                
                // Step 3: Delete floor
                await transactionalEntityManager
                    .createQueryBuilder()
                    .delete()
                    .from(Floor)
                    .where('"id" = :floorId', { floorId })
                    .execute();
                
                return true;
            } catch (error) {
                this.logger.error(`Failed to delete floor: ${floorId}`, error.stack);
                throw error;
            }
        });
    }
}