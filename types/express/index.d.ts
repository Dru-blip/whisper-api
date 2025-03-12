import { Session } from 'src/types';

declare global {
  namespace Express {
    interface Request {
      session?: Session;
    }
  }
}
