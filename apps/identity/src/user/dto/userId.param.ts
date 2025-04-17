import { IsNotEmpty, IsUUID } from "class-validator";

export class UserIdParam {
    @IsUUID()
    @IsNotEmpty()
    id: string;
}