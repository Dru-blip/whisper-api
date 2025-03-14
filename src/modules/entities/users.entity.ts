import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';

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

  constructor(email: string) {
    super();
    this.email = email;
  }
}
