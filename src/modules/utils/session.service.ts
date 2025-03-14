import { RedisClientType } from 'redis';
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';
import { Session } from 'src/types';
import { Inject } from '@nestjs/common';
import {
  REDIS_SESSION_PREFIX,
  // REDIS_USER_SESSIONS_PREFIX,
} from 'src/common/constants/redis.constants';

export class SessionService {
  constructor(@Inject('REDIS') private readonly redis: RedisClientType) {}

  generateSessionToken() {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    const token = encodeBase32LowerCaseNoPadding(bytes);
    return token;
  }

  async createSession(
    token: string,
    userId: string,
    email: string,
  ): Promise<Session> {
    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(token)),
    );
    const session: Session = {
      id: sessionId,
      userId,
      email,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    };
    await this.redis.set(
      `${REDIS_SESSION_PREFIX}${session.id}`,
      JSON.stringify({
        id: session.id,
        userId: session.userId,
        email: session.email,
        expiresAt: Math.floor(session.expiresAt.getTime() / 1000),
      }),
      {
        EXAT: Math.floor(session.expiresAt.getTime() / 1000),
      },
    );
    // await this.redis.sAdd(`${REDIS_USER_SESSIONS_PREFIX}${userId}`, sessionId);
    return session;
  }

  async validateSessionToken(token: string): Promise<Session | null> {
    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(token)),
    );
    const item = await this.redis.get(`${REDIS_SESSION_PREFIX}${sessionId}`);
    if (item === null) {
      return null;
    }

    const result = <
      { id: string; userId: string; email: string; expiresAt: number }
    >JSON.parse(item);
    const session: Session = {
      id: result.id,
      userId: result.userId,
      email: result.email,
      expiresAt: new Date(result.expiresAt * 1000),
    };
    if (Date.now() >= session.expiresAt.getTime()) {
      await this.redis.del(`${REDIS_SESSION_PREFIX}${sessionId}`);
      // await this.redis.sRem(
      //   `${REDIS_USER_SESSIONS_PREFIX}${session.userId}`,
      //   sessionId,
      // );
      return null;
    }
    if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
      session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
      await this.redis.set(
        `${REDIS_SESSION_PREFIX}${session.id}`,
        JSON.stringify({
          id: session.id,
          user_id: session.userId,
          expires_at: Math.floor(session.expiresAt.getTime() / 1000),
        }),
        {
          EXAT: Math.floor(session.expiresAt.getTime() / 1000),
        },
      );
    }
    return session;
  }

  async invalidateSession(sessionId: string, userId: string): Promise<void> {
    await this.redis.del(`${REDIS_SESSION_PREFIX}${sessionId}`);
    // await this.redis.sRem(`${REDIS_USER_SESSIONS_PREFIX}${userId}`, sessionId);
  }
}
