import { Controller, Delete, Param } from '@nestjs/common';
import { FriendsService } from './friends.service';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Delete('/:id/remove')
  async deleteFriend(@Param('id') id: string) {
    await this.friendsService.deleteFriend(id);
  }
}
