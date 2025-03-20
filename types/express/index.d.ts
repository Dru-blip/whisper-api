import { DefaultEventsMap, Socket } from 'socket.io';
// import { FriendRequest } from 'src/modules/entities/friend-request.entity';
import { Session } from 'src/types';

// type ServerToClientEvents = {
//   'friendRequest:receive': (friendRequest: FriendRequest) => void;
// };

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
