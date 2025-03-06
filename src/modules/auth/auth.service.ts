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
import {
  AccessTokenPayload,
  OnboardingTokenPayload,
  RefreshTokenPayload,
  VerificationTokenPayload,
} from 'src/types';
import {
  ACCESS_TOKEN_SECRET,
  ONBOARDING_TOKEN_EXPIRY,
  ONBOARDING_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
} from 'src/common/constants/config-names.constants';
import { LoginInput } from './dto/login.input';

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

  async sendOtp(loginInput: LoginInput, ip: string) {
    try {
      const key = `${REDIS_OTP_PREFIX}${loginInput.email}`;
      let cachedOtp = await this.redis.get(key);

      if (!cachedOtp) {
        cachedOtp = this.generateOtp();
        await this.redis.set(key, cachedOtp, { EX: OTP_EXPIRY });
      } else {
        await this.redis.expire(key, OTP_EXPIRY, 'XX');
      }
      await this.emailService.sendOtpMail(loginInput.email, cachedOtp);
      const verificationToken =
        await this.tokenService.generateToken<VerificationTokenPayload>(
          { email: loginInput.email, cid: loginInput.cid, ip },
          { value: 'verification' },
          { value: '15m' },
        );
      return {
        message: 'OTP sent successfully',
        redirectTo: `/verify?u=${loginInput.email}&tid=${verificationToken}`,
      };
    } catch (error: unknown) {
      throw new InternalServerErrorException('Failed to send OTP');
    }
  }

  async verifyOtp(verificationToken: string, email: string, otp: string) {
    let verificationPayload: VerificationTokenPayload;

    try {
      verificationPayload =
        await this.tokenService.verifyToken<VerificationTokenPayload>(
          verificationToken,
          { value: 'verification' },
        );
    } catch (error) {
      throw new UnauthorizedException('Invalid verification token');
    }

    const storedOtp = await this.redis.get(`${REDIS_OTP_PREFIX}${email}`);

    if (!storedOtp) {
      throw new UnauthorizedException('Invalid OTP');
    }

    if (storedOtp && storedOtp !== otp) {
      throw new UnauthorizedException('Invalid OTP');
    }
    await this.redis.del(`${REDIS_OTP_PREFIX}${email}`);
    let user = await this.em.findOne(User, { email });

    if (!user) {
      user = new User(email);
      user.onboarded = false;
      await this.em.persistAndFlush(user);
    }

    if (!user.onboarded) {
      const onboardingToken =
        await this.tokenService.generateToken<OnboardingTokenPayload>(
          {
            email: user.email,
          },
          { name: ONBOARDING_TOKEN_SECRET },
          { name: ONBOARDING_TOKEN_EXPIRY },
        );
      return {
        onboarding: true,
        verified: true,
        redirectUrl: `/onboarding?token=${onboardingToken}`,
      };
    }

    if (user && user.onboarded) {
      const { accessToken, refreshToken } = await this.generateAuthTokens(user);

      return {
        message: 'Authenticated successfully',
        tokens: { accessToken, refreshToken },
      };
    }
  }

  async generateAuthTokens(user: User) {
    const accessToken =
      await this.tokenService.generateToken<AccessTokenPayload>(
        {
          id: user.id,
          email: user.email,
        },
        { name: ACCESS_TOKEN_SECRET },
        { name: ACCESS_TOKEN_SECRET },
      );
    const refreshToken =
      await this.tokenService.generateToken<RefreshTokenPayload>(
        {
          id: user.id,
          email: user.email,
          version: 1,
        },
        { name: REFRESH_TOKEN_SECRET },
        { name: REFRESH_TOKEN_EXPIRY },
      );

    return { accessToken, refreshToken };
  }

  generateOtp() {
    let otp = '';
    for (let i = 0; i < 6; i++) {
      otp += Math.floor(Math.random() * 10).toString();
    }
    return otp;
  }
}
