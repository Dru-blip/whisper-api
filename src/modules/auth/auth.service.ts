import { EntityManager } from '@mikro-orm/postgresql';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClientType } from 'redis';
import {
  OTP_EXPIRY,
  REDIS_OTP_PREFIX,
} from 'src/common/constants/redis.constants';

@Injectable()
export class AuthService {
  constructor(
    @Inject('REDIS')
    private readonly redis: RedisClientType,
    private readonly configService: ConfigService,
    private readonly em: EntityManager,
  ) {}

  async createOtp(email: string): Promise<string> {
    const otp = this.generateOtp();
    await this.redis.set(`${REDIS_OTP_PREFIX}${email}`, otp, {
      EX: OTP_EXPIRY,
    });
    return otp;
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const storedOtp = await this.redis.get(`${REDIS_OTP_PREFIX}${email}`);
    if (!storedOtp) {
      throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
    }

    if (storedOtp && storedOtp === otp) {
      await this.redis.del(`${REDIS_OTP_PREFIX}${email}`);
      return true;
    }
    return false;
  }

  generateOtp() {
    let otp = '';
    for (let i = 0; i < 6; i++) {
      otp += Math.floor(Math.random() * 10).toString();
    }
    return otp;
  }
}
