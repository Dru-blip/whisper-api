import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Friend } from '../entities/friend.entity';

@Injectable()
export class FriendsService {
  constructor(private em: EntityManager) {}
  async deleteFriend(id: string) {
    const friend = await this.em.findOne(Friend, id);
    if (!friend) {
      throw new NotFoundException('Friend not found');
    }
    this.em.remove(friend);
    await this.em.flush();
    return friend;
  }
}
