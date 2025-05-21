// create monitoring request include code, active
import { IsBoolean, IsDefined, IsNotEmpty, IsString } from "class-validator";

export class UpdateLineByUser {
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    userId!: string;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    monitoringId!: string;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    lineId!: string;

    @IsString()
    roomId?: string;

    @IsString()
    @IsNotEmpty()
    name: string;
}