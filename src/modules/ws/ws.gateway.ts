import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AuthMiddleware } from './ws.middleware';
import { SessionService } from '../utils/session.service';
import { ConfigService } from '@nestjs/config';
import { CookieService } from '../utils/cookie.service';
import { FriendRequest } from '../entities/friend-request.entity';
import { RedisClientType } from 'redis';
import { Inject } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
    transports: ['websocket'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
})
export class WsGateway
  implements OnGatewayInit<Server>, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly sessionService: SessionService,
    private readonly configService: ConfigService,
    private readonly cookieService: CookieService,
    @Inject('REDIS')
    private readonly redis: RedisClientType,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    const middleware = AuthMiddleware(
      this.configService,
      this.sessionService,
      this.cookieService,
    );
    server.use(middleware);
  }

  async handleConnection(client: WsSocket) {
    const roomId = `user:${client.data.session.userId}`;
    let cacheData = await this.redis.get(roomId);

    if (!cacheData) {
      await this.redis.set(
        roomId,
        JSON.stringify({
          userId: client.data.session.userId,
          online: true,
        }),
      );
      await client.join(roomId);
    }
  }

  async handleDisconnect(client: WsSocket) {
    await this.redis.del(`user:${client.data.session.userId}`);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  async sendFriendRequest(receiverId: string, friendRequest: FriendRequest) {
    this.server
      .to(`user:${receiverId}`)
      .emit('friendRequest:receive', { friendRequest });
  }
}
