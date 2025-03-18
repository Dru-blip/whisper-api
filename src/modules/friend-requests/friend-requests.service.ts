import { Injectable, NotFoundException } from '@nestjs/common';
import { FriendRequest } from '../entities/friend-request.entity';
import { CreateFriendRequestDto } from './dto/create-fr.dto';
import { EntityManager } from '@mikro-orm/postgresql';
import { WsGateway } from '../ws/ws.gateway';
import { Friend } from '../entities/friend.entity';

@Injectable()
export class FriendRequestsService {
  constructor(
    private readonly em: EntityManager,
    private readonly wsGateway: WsGateway,
  ) {}

  async createFriendRequest(
    userId: string,
    details: CreateFriendRequestDto,
  ): Promise<FriendRequest> {
    const existingRequest = await this.em.findOne(FriendRequest, {
      $or: [
        { sender: userId, receiver: details.receiverId },
        { sender: details.receiverId, receiver: userId },
      ],
    });
    if (existingRequest) {
      return existingRequest;
    }
    const friendRequest = this.em.create(FriendRequest, {
      sender: userId,
      receiver: details.receiverId,
    });
    await this.em.flush();
    await this.wsGateway.sendFriendRequest(details.receiverId, friendRequest);
    return friendRequest;
  }

  async acceptFriendRequest(requestId: string) {
    const friendRequest = await this.em.findOneOrFail(FriendRequest, requestId);
    if (!friendRequest) {
      throw new NotFoundException('Friend request not found');
    }

    const friend = this.em.create(Friend, {
      initiator: friendRequest.sender,
      receiver: friendRequest.receiver,
    });

    this.em.remove(friendRequest);
    await this.em.flush();

    return friend;
  }

  async rejectFriendRequest(requestId: string) {
    const friendRequest = await this.em.findOne(FriendRequest, requestId);
    if (!friendRequest) {
      throw new NotFoundException('Friend request not found');
    }

    this.em.remove(friendRequest);
    await this.em.flush();

    return friendRequest;
  }
}
