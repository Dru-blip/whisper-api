import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { SessionService } from 'src/modules/utils/session.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly sessionService: SessionService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();
    const { sid } = request.signedCookies;

    if (!sid) {
      throw new UnauthorizedException('No tokens provided');
    }

    const session = await this.sessionService.validateSessionToken(<string>sid);

    if (!session) {
      throw new UnauthorizedException('Invalid token');
    }

    request.session = session;

    return true;
  }
}
