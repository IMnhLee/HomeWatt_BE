import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Line } from "../entities/line.entity";

Injectable()
export class LineRepository extends AbstractRepository<Line> {
    protected readonly logger = new Logger(LineRepository.name);

    constructor(
        @InjectRepository(Line)
        private readonly lineRepository: Repository<Line>
    ) {
        super(lineRepository);
    }
}