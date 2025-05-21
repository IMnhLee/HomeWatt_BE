import { AbstractEntity } from "@app/common";
import { Column, Entity, OneToMany } from "typeorm";
import { Line } from "./line.entity";

@Entity()
export class Monitoring extends AbstractEntity {
    @Column({ type: "uuid", nullable: true })
    userId: string;

    @Column({ type: "varchar", unique: true, nullable: false })
    code: string;

    @Column({ type: "varchar", nullable: true })
    name: string;

    @Column({ type: "varchar", nullable: true })
    location: string;

    @Column({ type: "boolean", default: true })
    active: boolean;

    @OneToMany(() => Line, line => line.monitoring)
    lines: Line[];
}