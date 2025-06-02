import { AbstractEntity } from "@app/common";
import { Column, Entity } from "typeorm";

@Entity()
export class EnergyRecord extends AbstractEntity {
    @Column({ type: 'varchar', length: 50 })
    lineCode: string; // Line code to which this record belongs

    @Column({ type: 'timestamp' })
    date: Date;

    @Column({ type: 'decimal', precision: 12, scale: 3 })
    energy: number; // kWh

    @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
    current: number; // Amperes (A)

    @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
    voltage: number; // Volts (V)

    @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
    power: number; // Watts (W)
}