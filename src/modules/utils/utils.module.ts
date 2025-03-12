import { Global, Module } from '@nestjs/common';
import { RedisClient } from './redis.client';
import { TokenService } from './tokens.service';
import { JwtService } from '@nestjs/jwt';
import { SessionService } from './session.service';

@Global()
@Module({
  providers: [RedisClient, TokenService, JwtService, SessionService],
  exports: [RedisClient, TokenService, SessionService],
})
export class UtilsModule {}
