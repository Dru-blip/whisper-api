import { EntityManager } from '@mikro-orm/postgresql';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClientType } from 'redis';
import {
  OTP_EXPIRY,
  REDIS_OTP_PREFIX,
} from 'src/common/constants/redis.constants';
import { User } from '../entities/users.entity';
import { TokenService } from '../utils/tokens.service';
import { EmailService } from '../emails/email.service';
import { Interface } from 'node:readline';

@Injectable()
export class AuthService {
  constructor(
    @Inject('REDIS')
    private readonly redis: RedisClientType,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly em: EntityManager,
    private readonly tokenService: TokenService,
  ) {}

  async sendOtp(email: string) {
    try {
      const key = `${REDIS_OTP_PREFIX}${email}`;
      let cachedOtp = await this.redis.get(key);

      if (!cachedOtp) {
        cachedOtp = this.generateOtp();
        await this.redis.set(key, cachedOtp, { EX: OTP_EXPIRY });
      } else {
        await this.redis.expire(key, OTP_EXPIRY, 'XX');
      }

      await this.emailService.sendOtpMail(email, cachedOtp);
      return { message: 'OTP sent successfully' };
    } catch (error: unknown) {
      throw new InternalServerErrorException('Failed to send OTP');
    }
  }

  async verifyOtp(email: string, otp: string) {
    const storedOtp = await this.redis.get(`${REDIS_OTP_PREFIX}${email}`);

    if (storedOtp && storedOtp !== otp) {
      // throw new HttpException('Invalid OTP', HttpStatus.UNAUTHORIZED);
      throw new UnauthorizedException('Invalid OTP');
    }
    await this.redis.del(`${REDIS_OTP_PREFIX}${email}`);
    let user = await this.em.findOne(User, { email });

    if (!user) {
      user = new User(email);
      await this.em.persistAndFlush(user);
    }

    if (user && user.onboarded) {
      const accessToken = this.tokenService.generateAccessToken({
        id: user.id,
        email: user.email,
      });
      const refreshToken = this.tokenService.generateRefreshToken({
        id: user.id,
        email: user.email,
        version: 1,
      });

      return {
        message: 'Authenticated successfully',
        tokens: { accessToken, refreshToken },
      };
    }

    const onboardingToken = this.tokenService.generateOnboardingToken({
      email: user.email,
    });
    return {
      verified: true,
      redirectUrl: `/onboarding?token=${onboardingToken}`,
    };
  }

  generateOtp() {
    let otp = '';
    for (let i = 0; i < 6; i++) {
      otp += Math.floor(Math.random() * 10).toString();
    }
    return otp;
  }
}
