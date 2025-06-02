import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePercentPriceDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsNumber()
    @IsNotEmpty()
    price!: number;

    @IsNumber()
    @IsNotEmpty()
    percent!: number;
}

export class EditPercentPriceDto {
    @IsString()
    @IsNotEmpty()
    id!: string;

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsNumber()
    @IsNotEmpty()
    price!: number;

    @IsNumber()
    @IsNotEmpty()
    percent!: number;
}

export class DeletePercentPriceDto {
    @IsString()
    @IsNotEmpty()
    id!: string;
}