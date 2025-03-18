import { Module } from '@nestjs/common';
import { FriendRequestsService } from './friend-requests.service';
import { FriendRequestsController } from './friend-requests.controller';
import { WsGateway } from '../ws/ws.gateway';

@Module({
  controllers: [FriendRequestsController],
  providers: [FriendRequestsService, WsGateway],
})
export class FriendRequestsModule {}
