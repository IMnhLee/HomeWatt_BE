import { IsNotEmpty, IsNumber } from "class-validator";

export class EditOnePriceDto {
    @IsNumber()
    @IsNotEmpty()
    price!: number;
}