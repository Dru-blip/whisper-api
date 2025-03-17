import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthMiddleware } from './ws.middleware';
import { SessionService } from '../utils/session.service';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
    transports: ['websocket'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
})
export class WsGateway implements OnGatewayInit<Server>, OnGatewayConnection {
  constructor(
    private readonly sessionService: SessionService,
    private readonly configService: ConfigService,
  ) {}

  afterInit(server: Server) {
    server.engine.use(
      cookieParser(this.configService.get<string>('COOKIE_SECRET')),
    );
    server.use(AuthMiddleware(this.configService, this.sessionService));
  }

  handleConnection(client: Socket, ...args: any[]) {
    // console.log(client.request.headers);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
