import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  generateToken<T extends Record<string, unknown>>(
    payload: T,
    secret: { name?: string; value?: string },
    expires?: { name?: string; value?: string },
  ): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: secret.name
        ? this.configService.get<string>(secret.name)
        : secret.value,
      expiresIn: expires?.name
        ? this.configService.get<string>(expires.name)
        : expires?.value,
    });
  }

  async verifyToken<T>(
    token: string,
    secret: { name?: string; value?: string },
  ): Promise<T> {
    return <T>await this.jwtService.verifyAsync(token, {
      secret: secret.name
        ? this.configService.get<string>(secret.name)
        : secret.value,
    });
  }
}
