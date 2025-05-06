import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { UserGroup } from '../../group/entities/user_group.entity';
import { AbstractEntity } from '@app/common';

export enum MemberRole {
  OWNER = 'owner',
  MEMBER = 'member',
  GUEST = 'guest'
}

@Entity()
export class MemberGroup extends AbstractEntity {
    @PrimaryColumn({ name: 'user_id' })
    userId: string;

    @PrimaryColumn({ name: 'group_id' })
    groupId: string;
    
    @ManyToOne(() => User, user => user.memberships)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => UserGroup, group => group.members)
    @JoinColumn({ name: 'group_id' })
    group: UserGroup;

    @Column({
        type: 'enum',
        enum: MemberRole,
        default: MemberRole.GUEST
    })
    role: MemberRole;
}