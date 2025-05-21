// create monitoring request include code, active
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateLineByUser {
    // @IsString()
    // @IsNotEmpty()
    // userId: string;

    @IsString()
    @IsNotEmpty()
    monitoringId!: string;

    @IsString()
    @IsNotEmpty()
    lineId: string;

    @IsString()
    @IsOptional()
    roomId?: string;

    @IsString()
    @IsNotEmpty()
    name: string;
}