import { Entity, ManyToOne } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { User } from './users.entity';

@Entity({ tableName: 'friend_requests' })
export class FriendRequest extends BaseEntity {
  @ManyToOne({ entity: () => User })
  sender!: User;

  @ManyToOne({ entity: () => User })
  receiver!: User;
}
