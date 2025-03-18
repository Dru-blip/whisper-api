import { DefaultEventsMap, Socket } from 'socket.io';
import { Session } from 'src/types';

declare global {
  type WsSocket = Socket<
    DefaultEventsMap,
    DefaultEventsMap,
    DefaultEventsMap,
    { session: Session }
  >;
  namespace Express {
    interface Request {
      session?: Session;
    }
  }
}
