import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Room } from "../entities/room.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Line } from "../entities/line.entity";

@Injectable()
export class RoomRepository extends AbstractRepository<Room> {
    protected readonly logger = new Logger(RoomRepository.name);
    constructor(
        @InjectRepository(Room)
        private readonly roomRepository: Repository<Room>,
        private readonly dataSource: DataSource,
    ) {
        super(roomRepository);
    }

    /**
     * Xóa room và giữ nguyên các line (set roomId = null cho các line)
     * @param roomId ID của room cần xóa
     * @returns Kết quả của quá trình xóa
     */
    async deleteAndKeepLines(roomId: string) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Cập nhật tất cả Line để gỡ liên kết với Room này
            await queryRunner.manager.update(Line, 
                { roomId: roomId }, 
                { roomId: null as unknown as string }
            );
            
            // Sau đó xóa Room
            const deleteResult = await queryRunner.manager.delete(Room, roomId);
            
            // Commit transaction
            await queryRunner.commitTransaction();
            return deleteResult;
        } catch (error) {
            // Rollback nếu có lỗi
            await queryRunner.rollbackTransaction();
            this.logger.error(`Failed to delete room ${roomId}`, error);
            throw error;
        } finally {
            // Giải phóng queryRunner
            await queryRunner.release();
        }
    }
}