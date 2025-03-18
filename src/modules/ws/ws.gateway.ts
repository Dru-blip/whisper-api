import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AuthMiddleware } from './ws.middleware';
import { SessionService } from '../utils/session.service';
import { ConfigService } from '@nestjs/config';
import { CookieService } from '../utils/cookie.service';

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
    private readonly cookieService: CookieService,
  ) {}

  afterInit(server: Server) {
    const middleware = AuthMiddleware(
      this.configService,
      this.sessionService,
      this.cookieService,
    );
    server.use(middleware);
  }

  handleConnection(client: WsSocket, ...args: any[]) {
    // console.log(client.request.headers);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
