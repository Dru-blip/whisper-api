import { Migration } from '@mikro-orm/migrations';

export class Migration20250228075301 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "users" ("id" serial primary key, "name" varchar(255) null, "email" varchar(255) not null, "onboarding" boolean not null default false, "profile_picture" varchar(255) null);`);
    this.addSql(`alter table "users" add constraint "users_email_unique" unique ("email");`);
  }

}
