import { IsDate, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserRequest {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    username: string;
}