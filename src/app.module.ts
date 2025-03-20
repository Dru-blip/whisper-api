import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UtilsModule } from './modules/utils/utils.module';
import { User } from './modules/entities/users.entity';
import { EmailsModule } from './modules/emails/emails.module';
import { WsModule } from './modules/ws/ws.module';
import { FriendRequest } from './modules/entities/friend-request.entity';
import { FriendRequestsModule } from './modules/friend-requests/friend-requests.module';
import { FriendsModule } from './modules/friends/friends.module';

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
        entities: [User, FriendRequest],
        host: 'localhost',
      }),
    }),
    UtilsModule,
    UsersModule,
    EmailsModule,
    AuthModule,
    FriendRequestsModule,
    FriendsModule,
    WsModule,
  ],
})
export class AppModule {}
