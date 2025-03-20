import { Migration } from '@mikro-orm/migrations';

export class Migration20250320101155 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create type "notification_type" as enum ('message', 'friend_request', 'friend_accepted');`);
    this.addSql(`create table "notifications" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "notification_type" "notification_type" not null, "content" text not null, "user_id" uuid not null, "read" boolean not null default false, "link" varchar(255) null, "request_id" uuid null, constraint "notifications_pkey" primary key ("id"));`);

    this.addSql(`alter table "notifications" add constraint "notifications_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`);
    this.addSql(`alter table "notifications" add constraint "notifications_request_id_foreign" foreign key ("request_id") references "friend_requests" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "notifications" cascade;`);

    this.addSql(`drop type "notification_type";`);
  }

}
