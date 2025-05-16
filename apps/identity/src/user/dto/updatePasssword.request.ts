import { IsNotEmpty, IsString, MinLength, Matches } from "class-validator";

export class UpdatePasswordRequest {
    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;
    
    @IsString()
    @IsNotEmpty()
    currentPassword?: string;
}