import { Migration } from '@mikro-orm/migrations';

export class Migration20250314155922 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "users" alter column "discriminator" type int using ("discriminator"::int);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "users" alter column "discriminator" type varchar(255) using ("discriminator"::varchar(255));`);
  }

}
