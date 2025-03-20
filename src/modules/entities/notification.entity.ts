import { Entity, Enum, ManyToOne, OneToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { User } from './users.entity';
import { FriendRequest } from './friend-request.entity';

export enum NotificationType {
  MESSAGE = 'message',
  FRIEND_REQUEST = 'friend_request',
  FRIEND_ACCEPTED = 'friend_accepted',
}

@Entity({ tableName: 'notifications' })
export class UserNotification extends BaseEntity {
  @Enum({ items: () => NotificationType, nativeEnumName: 'notification_type' })
  notificationType!: NotificationType;

  @Property({ type: 'text' })
  content!: string;

  @ManyToOne({ entity: () => User })
  user!: User;

  @Property({ type: 'boolean', default: false })
  read?: boolean = false;

  @Property({ nullable: true })
  link?: string;

  @ManyToOne({
    entity: () => FriendRequest,
    inversedBy: 'notifications',
    nullable: true,
  })
  request?: FriendRequest;
}
