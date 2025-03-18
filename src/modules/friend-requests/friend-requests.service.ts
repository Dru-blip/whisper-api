import { Injectable } from '@nestjs/common';
import { FriendRequest } from '../entities/friend-request.entity';
import { CreateFriendRequestDto } from './dto/create-fr.dto';
import { EntityManager } from '@mikro-orm/postgresql';

@Injectable()
export class FriendRequestsService {
  constructor(private readonly em: EntityManager) {}

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
    return friendRequest;
  }
}
