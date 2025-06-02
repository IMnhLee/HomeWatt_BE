import { IsNotEmpty } from "class-validator";

export class GetTimeEnergyConsumptionDto {
    @IsNotEmpty()
    date!: string;
    
    @IsNotEmpty()
    viewType!: 'daily' | 'monthly';
}