import { Global, Module } from '@nestjs/common';
import { RedisClient } from './redis.client';
import { TokenService } from './tokens.service';
import { JwtService } from '@nestjs/jwt';
import { SessionService } from './session.service';
import { CookieService } from './cookie.service';

@Global()
@Module({
  providers: [
    RedisClient,
    TokenService,
    JwtService,
    SessionService,
    CookieService,
  ],
  exports: [RedisClient, TokenService, SessionService, CookieService],
})
export class UtilsModule {}
