// one-price-config.entity.ts
import { AbstractEntity } from '@app/common';
import { Entity, Column } from 'typeorm';

@Entity('one_price_configs')
export class OnePriceConfig extends AbstractEntity {
    @Column({type: 'uuid', nullable: false})
    userId: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;
}
