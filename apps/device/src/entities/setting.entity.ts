import { AbstractEntity } from "@app/common";
import { Column, Entity } from "typeorm";

export enum PriceType {
    ONE_PRICE = 'one_price',
    PERCENT_PRICE = 'percent_price',
    STAIR_PRICE = 'stair_price',
}

@Entity()
export class Setting extends AbstractEntity {
    @Column({type: 'uuid'})
    userId: string;

    @Column({type: 'varchar', default: PriceType.ONE_PRICE})
    priceType: PriceType;

    @Column({
        type: 'int',
        default: 1,
        comment: 'Ngày bắt đầu chu kỳ tính tiền điện trong tháng (1-31)'
    })
    billingCycleStartDay: number;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0,
        comment: 'Ngưỡng năng lượng tiêu thụ tối đa cho một chu kỳ (kWh)'
    })
    energyConsumptionThreshold: number;
}