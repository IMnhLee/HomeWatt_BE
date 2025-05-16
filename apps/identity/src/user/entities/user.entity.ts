import { AbstractEntity } from "@app/common";
import { Column, Entity, OneToMany } from "typeorm";

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

    @Column({nullable: true})
    emailCodeExpire: Date;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER
    })
    role: string;

    @Column({type: "varchar", nullable: true,})
    googleId: string;

    //status user active or inactive
    @Column({type: "boolean", default: true})
    active: boolean;
}