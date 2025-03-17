import { Migration } from '@mikro-orm/migrations';

export class Migration20250317051854 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "users" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) null, "email" varchar(255) not null, "onboarded" boolean not null default false, "bio" varchar(255) null, "discriminator" int null, "profile_picture" varchar(255) null, constraint "users_pkey" primary key ("id"));`);
    this.addSql(`alter table "users" add constraint "users_email_unique" unique ("email");`);
  }

}
