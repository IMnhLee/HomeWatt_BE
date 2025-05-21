// create monitoring request include code, active
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateMonitoringRequest {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsBoolean()
  active: boolean;
}