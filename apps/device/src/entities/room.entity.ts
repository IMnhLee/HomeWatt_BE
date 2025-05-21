import { AbstractEntity } from "@app/common";
import { Column, Entity, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Floor } from "./floor.entity";
import { Line } from "./line.entity";

@Entity()
export class Room extends AbstractEntity {
    @Column({ type: "varchar", nullable: true })
    name: string;

    @ManyToOne(() => Floor, floor => floor.rooms)
    @JoinColumn({ name: "floor_id" })
    floor: Floor;

    @Column({ name: "floor_id", nullable: true })
    floorId: string;

    @OneToMany(() => Line, line => line.room)
    lines: Line[];
}