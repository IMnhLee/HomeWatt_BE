import { IsNotEmpty } from "class-validator";
import { MemberRole } from "../enities/member_group.entity";

export class RoleDTO {
    @IsNotEmpty()
    role: MemberRole;
}