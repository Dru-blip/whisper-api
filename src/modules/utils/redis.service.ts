import { FactoryProvider } from '@nestjs/common';
import { RedisClientType, createClient } from 'redis';

export const RedisProvider: FactoryProvider<RedisClientType> = {
  provide: 'REDIS',
  useFactory: async () => {
    const redisClient: RedisClientType = createClient();
    await redisClient.connect();
    return redisClient;
  },
};
