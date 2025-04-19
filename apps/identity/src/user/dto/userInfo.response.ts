import { Exclude, Expose } from "class-transformer";

export class UserInfoResponse {
    @Exclude()
    password: string;
}