import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateGroupRequest {
    @IsString()
    @IsNotEmpty()
    @Length(3, 50)
    name: string;

    @IsString()
    @IsOptional()
    description?: string;
}