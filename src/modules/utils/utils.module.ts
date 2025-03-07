import { Global, Module } from '@nestjs/common';
import { RedisClient } from './redis.client';
import { TokenService } from './tokens.service';
import { JwtService } from '@nestjs/jwt';

@Global()
@Module({
  providers: [RedisClient, TokenService, JwtService],
  exports: [RedisClient, TokenService],
})
export class UtilsModule {}
