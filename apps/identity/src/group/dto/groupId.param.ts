import { IsNotEmpty, IsUUID } from "class-validator";

export class GroupIdParam {
    @IsUUID()
    @IsNotEmpty()
    id: string;
}