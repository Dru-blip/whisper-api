import { Collection, Entity, ManyToOne, OneToMany } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { User } from './users.entity';
import { UserNotification } from './notification.entity';

@Entity({ tableName: 'friend_requests' })
export class FriendRequest extends BaseEntity {
  @ManyToOne({ entity: () => User })
  sender!: User;

  @ManyToOne({ entity: () => User })
  receiver!: User;

  @OneToMany({ entity: () => UserNotification, mappedBy: 'request' })
  notifications? = new Collection<UserNotification[]>(this);
}
