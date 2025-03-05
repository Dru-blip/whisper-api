import { Migration } from '@mikro-orm/migrations';

export class Migration20250305162024 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "users" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) null, "email" varchar(255) not null, "onboarded" boolean not null default false, "bio" varchar(255) null, "profile_picture" varchar(255) null);`);
    this.addSql(`alter table "users" add constraint "users_email_unique" unique ("email");`);
  }

}
