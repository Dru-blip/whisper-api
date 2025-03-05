import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  AccessTokenPayload,
  OnboardingTokenPayload,
  RefreshTokenPayload,
} from '../../types';

@Injectable()
export class TokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  generateAccessToken(payload: AccessTokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRY'),
    });
  }

  generateRefreshToken(payload: RefreshTokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRY'),
    });
  }

  generateOnboardingToken(payload: OnboardingTokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('ONBOARDING_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('ONBOARDING_TOKEN_EXPIRY'),
    });
  }

  verifyAccessToken(token: string): AccessTokenPayload {
    return this.jwtService.verify(token, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
    });
  }

  verifyRefreshToken(token: string): RefreshTokenPayload {
    return this.jwtService.verify(token, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
    });
  }

  verifyOnboardingToken(token: string): OnboardingTokenPayload {
    return this.jwtService.verify(token, {
      secret: this.configService.get<string>('ONBOARDING_TOKEN_SECRET'),
    });
  }
}
