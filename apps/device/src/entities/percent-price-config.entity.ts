// percent-price-config.entity.ts
import { AbstractEntity } from '@app/common';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('percent_price_configs')
export class PercentPriceConfig extends AbstractEntity{
    @Column({type: 'uuid'})
    userId: string;

    @Column({ type: 'varchar' })
    name: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column('decimal', { precision: 5, scale: 2 })
    percent: number;
}
