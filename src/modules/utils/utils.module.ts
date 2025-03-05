import { Global, Module } from '@nestjs/common';
import { RedisProvider } from './redis.service';
import { TokenService } from './tokens.service';

@Global()
@Module({
  providers: [RedisProvider, TokenService],
  exports: [RedisProvider, TokenService],
})
export class UtilsModule {}
