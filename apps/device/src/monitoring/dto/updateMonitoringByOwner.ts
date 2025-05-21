// create monitoring request include code, active
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class updateMonitoringByOwner {

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  monitoringId: string;

  @IsString()
  location?: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}