import { Migration } from '@mikro-orm/migrations';

export class Migration20250317161900 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "friend_requests" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "sender_id" uuid not null, "receiver_id" uuid not null, constraint "friend_requests_pkey" primary key ("id"));`);

    this.addSql(`alter table "friend_requests" add constraint "friend_requests_sender_id_foreign" foreign key ("sender_id") references "users" ("id") on update cascade;`);
    this.addSql(`alter table "friend_requests" add constraint "friend_requests_receiver_id_foreign" foreign key ("receiver_id") references "users" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "friend_requests" cascade;`);
  }

}
