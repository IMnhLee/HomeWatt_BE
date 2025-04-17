import { IsEmail, IsNotEmpty } from "class-validator";

export class UserEmailParam {
    @IsEmail()
    @IsNotEmpty()
    email: string;
}