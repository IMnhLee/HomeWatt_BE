import { AbstractEntity } from "@app/common";
import { Column, Entity, OneToMany } from "typeorm";
import { Room } from "./room.entity";

@Entity()
export class Floor extends AbstractEntity {
    @Column({ type: "varchar", nullable: false })
    userId: string;

    @Column({ type: "varchar", nullable: true })
    name: string;

    @OneToMany(() => Room, room => room.floor, { 
        cascade: true,
        onDelete: 'CASCADE' 
    })
    rooms: Room[];
}