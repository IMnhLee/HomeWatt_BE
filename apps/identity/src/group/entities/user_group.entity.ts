import { AbstractEntity } from "@app/common";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MemberGroup } from "../../member_group/enitities/member_group.entity";

@Entity()
export class UserGroup extends AbstractEntity {
  @Column({ type: "varchar", nullable: false })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @OneToMany(() => MemberGroup, memberGroup => memberGroup.group)
  memberGroups: MemberGroup[];
}