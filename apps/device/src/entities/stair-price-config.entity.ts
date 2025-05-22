// stair-price-config.entity.ts
import { AbstractEntity } from '@app/common';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('stair_price_configs')
export class StairPriceConfig extends AbstractEntity{
    @Column({ type: 'uuid', nullable: false })
    userId: string;

    @Column()
    step: number;

    @Column('decimal', { precision: 10, scale: 2 })
    minKwh: number;

    @Column('decimal', { precision: 10, scale: 2 })
    maxKwh: number;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;
}
