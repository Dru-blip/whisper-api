import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenService } from '../../modules/utils/tokens.service';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { AccessTokenPayload } from 'src/types';

@Injectable()
export class JWTAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly tokenService: TokenService,
  ) {}

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();
    const { aid: accessToken, rid: refreshToken } = request.signedCookies;

    if (!accessToken && !refreshToken) {
      throw new UnauthorizedException('No tokens provided');
    }

    const payload: AccessTokenPayload = this.tokenService.verifyAccessToken(
      accessToken as string,
    );

    if (!payload) {
      throw new UnauthorizedException('Invalid or expired tokens');
    }

    request.user = payload;

    return true;
  }
}
