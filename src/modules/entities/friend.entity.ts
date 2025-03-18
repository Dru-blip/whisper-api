import { Entity, ManyToOne } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { User } from './users.entity';

@Entity({ tableName: 'friends' })
export class Friend extends BaseEntity {
  @ManyToOne({ entity: () => User, inversedBy: 'initiatedFriendships' })
  initiator!: User;

  @ManyToOne({ entity: () => User, inversedBy: 'receivedFriendships' })
  receiver!: User;
}
