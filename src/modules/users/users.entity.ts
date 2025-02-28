import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'users' })
export class User {
  @PrimaryKey({ autoincrement: true })
  id: number;

  @Property({ nullable: true })
  name: string;

  @Property({ nullable: false, unique: true })
  email: string;

  @Property()
  onboarding: boolean = false;

  @Property({ nullable: true })
  profilePicture?: string;
}
