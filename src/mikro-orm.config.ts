import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';

export default defineConfig({
  dbName: 'whisper',
  port: 5432,
  password: 'druva150',
  driver: PostgreSqlDriver,
  entities: ['dist/modules/**/*.entity.js'],
  entitiesTs: ['src/modules/**/*.entity.ts'],
  host: 'localhost',
  extensions: [Migrator],
});
