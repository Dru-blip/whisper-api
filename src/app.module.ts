import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { RedisProvider } from './modules/utils/redis.service';
import { UtilsModule } from './modules/utils/utils.module';
import { User } from './modules/users/users.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      driver: PostgreSqlDriver,
      useFactory: (config: ConfigService) => ({
        dbName: config.get<string>('DB_NAME'),
        port: config.get<number>('DB_PORT'),
        password: config.get<string>('DB_PASSWORD'),
        driver: PostgreSqlDriver,
        entities: [User],
        // entities: ['./dist/modules/**/*.entity.js'],
        // entitiesTs: ['./modules/**/*.entity.ts'],
        host: 'localhost',
      }),
    }),
    UtilsModule,
    UsersModule,
    AuthModule,
  ],
  providers: [RedisProvider],
})
export class AppModule {}
