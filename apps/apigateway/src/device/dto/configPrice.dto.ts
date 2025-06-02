import { IsNotEmpty, IsEnum } from "class-validator";

export class EditConfigPriceDto {
    @IsNotEmpty()
    @IsEnum(['one_price', 'stair_price', 'percent_price'], { 
        message: 'priceType must be one of: one_price, stair_price, percent_price' 
    })
    priceType!: 'one_price' | 'stair_price' | 'percent_price';
}