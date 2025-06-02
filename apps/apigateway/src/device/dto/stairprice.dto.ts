import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateStairPriceDto {
    @IsNumber()
    @IsNotEmpty()
    step!: number;

    @IsNumber()
    @IsNotEmpty()
    minKwh!: number;

    @IsNumber()
    @IsOptional()
    maxKwh?: number;

    @IsNumber()
    @IsNotEmpty()
    price!: number;
}

export class EditStairPriceDto {
    @IsString()
    @IsNotEmpty()
    id!: string;

    @IsNumber()
    @IsNotEmpty()
    step!: number;

    @IsNumber()
    @IsNotEmpty()
    minKwh!: number;

    @IsNumber()
    @IsOptional()
    maxKwh?: number;

    @IsNumber()
    @IsNotEmpty()
    price!: number;
}

export class DeleteStairPriceDto {
    @IsString()
    @IsNotEmpty()
    id!: string;
}