import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { FriendRequest } from './friend-request.entity';
import { Friend } from './friend.entity';

@Entity({ tableName: 'users' })
export class User extends BaseEntity {
  @Property({ nullable: true })
  name: string;

  @Property({ nullable: false, unique: true })
  email: string;

  @Property()
  onboarded: boolean = false;

  @Property({ nullable: true })
  bio: string;

  @Property({ nullable: true })
  discriminator: number;

  @Property({ nullable: true })
  profilePicture?: string;

  @OneToMany({ entity: () => FriendRequest, mappedBy: 'receiver' })
  incomingFriendRequests = new Collection<FriendRequest>(this);

  @OneToMany({ entity: () => FriendRequest, mappedBy: 'sender' })
  outgoingFriendRequests = new Collection<FriendRequest>(this);

  @OneToMany({ entity: () => Friend, mappedBy: 'initiator' })
  initiatedFriendships = new Collection<Friend>(this);

  @OneToMany({ entity: () => Friend, mappedBy: 'receiver' })
  receivedFriendships = new Collection<Friend>(this);

  constructor(email: string) {
    super();
    this.email = email;
  }
}
