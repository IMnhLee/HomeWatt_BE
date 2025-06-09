import { IsBoolean, IsNotEmpty } from "class-validator";

export class ManageUserDto {
    @IsNotEmpty()
    @IsBoolean()
    active: boolean;
}