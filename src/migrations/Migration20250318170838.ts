import { Migration } from '@mikro-orm/migrations';

export class Migration20250318170838 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "friends" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "initiator_id" uuid not null, "receiver_id" uuid not null, constraint "friends_pkey" primary key ("id"));`);

    this.addSql(`alter table "friends" add constraint "friends_initiator_id_foreign" foreign key ("initiator_id") references "users" ("id") on update cascade;`);
    this.addSql(`alter table "friends" add constraint "friends_receiver_id_foreign" foreign key ("receiver_id") references "users" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "friends" cascade;`);
  }

}
