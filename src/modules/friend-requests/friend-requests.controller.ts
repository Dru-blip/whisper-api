import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
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

  @Patch('/:id/accept')
  async acceptFriendRequest(@Param('id') id: string) {
    return await this.friendRequestsService.acceptFriendRequest(id);
  }

  @Delete('/:id/reject')
  async rejectFriendRequest(@Param('id') id: string) {
    return await this.friendRequestsService.rejectFriendRequest(id);
  }
}
