import { AbstractEntity } from "@app/common";
import { Column, Entity, OneToMany } from "typeorm";
import { MemberGroup } from "../../member_group/enities/member_group.entity";

export enum UserRole {
  ADMIN = 'admin',
  ADMINI = 'admini',
  USER = 'user'
}

@Entity()
export class User extends AbstractEntity {
    @Column({ type: "varchar", unique: true, nullable: false })
    email: string;

    @Column({ type: "varchar", nullable: true })
    phoneNumber: string;

    @Column({ type: "varchar", nullable: false })
    password: string;

    @Column({ type: "varchar", nullable: false })
    username: string;

    @Column({ nullable: true })
    address: string;

    @Column({type: "varchar", nullable: true,})
    refreshToken: string;

    @Column({type: "varchar", nullable: true,})
    emailCode: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER
    })
    role: string;

    @OneToMany(() => MemberGroup, memberGroup => memberGroup.user)
    memberships: MemberGroup[];
}