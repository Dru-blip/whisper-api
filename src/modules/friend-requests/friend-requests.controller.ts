import { Body, Controller, Post, Req } from '@nestjs/common';
import { FriendRequestsService } from './friend-requests.service';
import { CreateFriendRequestDto } from './dto/create-fr.dto';
import { FriendRequest } from '../entities/friend-request.entity';
import { Request } from 'express';

@Controller('friend-requests')
export class FriendRequestsController {
  constructor(private readonly friendRequestsService: FriendRequestsService) {}

  @Post()
  async createFriendRequest(
    @Req() req: Request,
    @Body() data: CreateFriendRequestDto,
  ): Promise<FriendRequest> {
    return await this.friendRequestsService.createFriendRequest(
      <string>req.session?.userId,
      data,
    );
  }
}
