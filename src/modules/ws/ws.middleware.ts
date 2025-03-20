// import { NextFunction, Request, Response } from 'express';
import { CookieService } from '../utils/cookie.service';
import { SessionService } from '../utils/session.service';
// import { UnauthorizedException } from '@nestjs/common';
// import { WsException } from '@nestjs/websockets';
// import { DefaultEventsMap, Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
// import { Session } from 'src/types';

type SocketMiddleware = (
  socket: WsSocket,
  next: (error?: Error) => void,
) => Promise<void>;

export const AuthMiddleware = (
  configService: ConfigService,
  sessionService: SessionService,
  cookieService: CookieService,
): SocketMiddleware => {
  return async (socket, next) => {
    try {
      const value = cookieService.getCookie(
        <string>socket.handshake.headers.cookie,
        'sid',
      );

      if (!value) {
        next(new Error('Invalid token'));
        return;
      }

      const session = await sessionService.validateSessionToken(value);

      if (!session) {
        next(new Error('Invalid token'));
        return;
      }

      const req = socket.request as any;
      req.user = session;

      socket.data.session = session;
      next();
    } catch (error) {
      next(<Error>error);
    }
  };
};
