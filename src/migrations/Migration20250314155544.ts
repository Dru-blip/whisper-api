import { Migration } from '@mikro-orm/migrations';

export class Migration20250314155544 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "users" add column "discriminator" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "users" drop column "discriminator";`);
  }

}
