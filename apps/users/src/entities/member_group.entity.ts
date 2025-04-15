import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn, CreateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { UserGroup } from "./user_group.entity";

@Entity()
export class MemberGroup {
  @PrimaryColumn({ name: "user_id" })
  userId: string;

  @PrimaryColumn({ name: "group_id" })
  groupId: string;

  @Column({ type: "varchar", default: "member" })
  role: string;

  @CreateDateColumn()
  joinedAt: Date;

  // Định nghĩa mối quan hệ với User
  @ManyToOne(() => User, user => user.memberGroups, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "user_id" }) // Liên kết với cột userId
  user: User;

  // Định nghĩa mối quan hệ với UserGroup
  @ManyToOne(() => UserGroup, group => group.memberGroups, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "group_id" }) // Liên kết với cột groupId
  group: UserGroup;
}