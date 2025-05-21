import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { Repository } from "typeorm";
import { Room } from "../entities/room.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class RoomRepository extends AbstractRepository<Room> {
    protected readonly logger = new Logger(RoomRepository.name);
    constructor(
        @InjectRepository(Room)
        private readonly roomRepository: Repository<Room>,
    ) {
        super(roomRepository);
    }
}