import { AbstractEntity } from "@app/common";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MemberGroup } from "./member_group.entity";

@Entity()
export class User extends AbstractEntity {
  @Column({ type: "varchar", unique: true, nullable: false })
  email: string;

  @Column({ type: "varchar", nullable: false })
  phoneNumber: string;

  @Column({ type: "varchar", nullable: false })
  password: string;

  @Column()
  username: string;

  @Column()
  address: string;

  @Column({type: "varchar", nullable: true,})
  refreshToken: string;

  @Column({type: "varchar", nullable: true,})
  emailCode: string;

  @Column({ type: "varchar", default: "user"})
  role: string;

  @OneToMany(() => MemberGroup, memberGroup => memberGroup.group)
  memberGroups: MemberGroup[];
}