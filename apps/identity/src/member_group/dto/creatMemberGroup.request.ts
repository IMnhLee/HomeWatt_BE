import { IsNotEmpty, IsUUID } from "class-validator";
import { MemberRole } from "../enities/member_group.entity";

export class CreateMemberGroupRequest {
    @IsUUID()
    @IsNotEmpty()
    groupId: string;

    @IsUUID()
    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    role: MemberRole;
}