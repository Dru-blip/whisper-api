import { Migration } from '@mikro-orm/migrations';

export class Migration20250307095726 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "users" alter column "id" drop default;`);
    this.addSql(`alter table "users" alter column "id" type uuid using ("id"::text::uuid);`);
    this.addSql(`alter table "users" alter column "id" drop default;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "users" alter column "id" type text using ("id"::text);`);

    this.addSql(`alter table "users" alter column "id" type int using ("id"::int);`);
    this.addSql(`create sequence if not exists "users_id_seq";`);
    this.addSql(`select setval('users_id_seq', (select max("id") from "users"));`);
    this.addSql(`alter table "users" alter column "id" set default nextval('users_id_seq');`);
  }

}
