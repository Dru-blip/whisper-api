import { NextFunction, Request, Response } from 'express';
import { SessionService } from '../utils/session.service';
// import { UnauthorizedException } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import * as signature from 'cookie-signature';
import { ConfigService } from '@nestjs/config';
import { CipherKey } from 'node:crypto';

type SocketMiddleware = (
  socket: Socket,
  next: (error?: Error) => void,
) => Promise<void>;

export const AuthMiddleware = (
  configService: ConfigService,
  sessionService: SessionService,
): SocketMiddleware => {
  return async (socket, next) => {
    try {
      const [name, value] = socket.handshake.headers.cookie!.split('=');
      if (name !== 'sid') {
        next(new Error('Invalid token'));
        return;
      }

      const session = await sessionService.validateSessionToken(value);

      if (!session) {
        next(new Error('Invalid token'));
        return;
      }

      socket.data.session = session;
      next();
    } catch (error) {
      next(<Error>error);
    }
  };
};
