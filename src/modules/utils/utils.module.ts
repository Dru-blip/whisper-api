import { Global, Module } from '@nestjs/common';
import { RedisProvider } from './redis.service';
import { TokenService } from './tokens.service';
import { JwtService } from '@nestjs/jwt';

@Global()
@Module({
  providers: [RedisProvider, TokenService, JwtService],
  exports: [RedisProvider, TokenService],
})
export class UtilsModule {}
