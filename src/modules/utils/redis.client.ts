import { FactoryProvider } from '@nestjs/common';
import { RedisClientType, createClient } from 'redis';

export const RedisClient: FactoryProvider<RedisClientType> = {
  provide: 'REDIS',
  useFactory: async () => {
    const redisClient: RedisClientType = createClient();
    await redisClient.connect();
    return redisClient;
  },
};
