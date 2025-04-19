import { AbstractEntity } from "@app/common";
import { Column, Entity, OneToMany } from "typeorm";
import { MemberGroup } from "../../member_group/enities/member_group.entity";

@Entity()
export class UserGroup extends AbstractEntity {
  @Column({ type: "varchar", nullable: false })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @OneToMany(() => MemberGroup, memberGroup => memberGroup.group)
  members: MemberGroup[];
}