import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { Monitoring } from "../entities/monitoring.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";

@Injectable()
export class MonitoringRepository extends AbstractRepository<Monitoring> {
    protected readonly logger = new Logger(MonitoringRepository.name);

    constructor(
        @InjectRepository(Monitoring)
        private readonly monitoringRepository: Repository<Monitoring>
    ) {
        super(monitoringRepository);
    }

    async findByUserIdWithPagination(
        userId: string,
        page: number = 1,
        limit: number = 10,
    ): Promise<[Monitoring[], number]> {
        const skip = (page - 1) * limit;

        // Đầu tiên lấy danh sách các monitoring không kèm relations
        const [monitorings, total] = await this.repository.findAndCount({
            where: { userId },
            skip,
            take: limit,
            order: {
                code: 'ASC'
            }
        });

        // Sau đó load relationship riêng cho từng monitoring
        if (monitorings.length > 0) {
            const monitoringIds = monitorings.map(m => m.id);
            const monitoringsWithRelations = await this.repository.find({
                where: { id: In(monitoringIds) },
                relations: {
                    lines: {
                        room: {
                            floor: true,
                        },
                    },
                },
                order: {
                    code: 'ASC',
                    lines: {
                        code: 'ASC'
                    }
                }
            });

            // Map kết quả theo thứ tự ban đầu
            const monitoringMap = new Map();
            monitoringsWithRelations.forEach(m => monitoringMap.set(m.id, m));
            
            const result = monitorings.map(m => monitoringMap.get(m.id) || m);
            return [result, total];
        }

        return [monitorings, total];
    };

    async findByUserIdWithRelations(userId: string): Promise<Monitoring[]> {
        return this.repository.find({
            where: { userId },
            relations: {
                lines: {
                    room: {
                        floor: true,
                    },
                },
            },
        });
    };

    async findLinesByUserId(userId: string) {
        return this.repository.find({
            where: { userId },
            relations: {
                lines: true
            },
        });
    }

}