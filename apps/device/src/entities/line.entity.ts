import { AbstractEntity } from "@app/common";
import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { Monitoring } from "./monitoring.entity";
import { Room } from "./room.entity";

@Entity()
export class Line extends AbstractEntity {
    @Column({ type: "varchar", unique: true, nullable: false })
    code: string;

    @Column({ type: "varchar", nullable: true })
    name: string;

    @ManyToOne(() => Monitoring, monitoring => monitoring.lines)
    @JoinColumn({ name: "monitoring_id" })
    monitoring: Monitoring;

    @Column({ name: "monitoring_id", nullable: true })
    monitoringId: string;

    @ManyToOne(() => Room, room => room.lines)
    @JoinColumn({ name: "room_id" })
    room: Room;

    @Column({ name: "room_id", nullable: true })
    roomId: string;

    @Column({ type: "boolean", default: false })
    active: boolean;
}