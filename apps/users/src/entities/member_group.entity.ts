import { Column, ManyToOne } from "typeorm";
import { User } from "./user.entity";
import { UserGroup } from "./user_group.entity";
import { AbstractEntity } from "@app/common";

export class MemberGroup extends AbstractEntity {
  @Column({ type: "varchar", nullable: false })
  userId: string;

  @Column({ type: "varchar", nullable: false })
  groupId: string;

  @Column({ type: "varchar", default: "member" })
  role: string;

  // Add relationship to User
  @ManyToOne(() => User, user => user.memberGroups)
  user: User;

  // Add relationship to UserGroup
  @ManyToOne(() => UserGroup, group => group.memberGroups)
  group: UserGroup;
}