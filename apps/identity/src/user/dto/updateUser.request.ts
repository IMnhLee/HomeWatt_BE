import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, IsUUID } from "class-validator";

export class UpdateUserRequest {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsPhoneNumber()
    phoneNumber: string;

    @IsString()
    address: string;
}