// create monitoring request include code, active
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class AddMonitoringRequest {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    code: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    location?: string;
}