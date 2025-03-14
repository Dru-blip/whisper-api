import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserOnboardingDto } from './dto/onboarding.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Session } from 'src/types';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiOperation({
    summary: 'Fetch Self',
    description: 'Retrieve your user information',
  })
  @Get('@me')
  async fetchSelf(@Req() req: Request) {
    const { session } = req;
    return await this.userService.fetchSelf(<Session>session);
  }

  @ApiOperation({ summary: 'Complete Onboarding' })
  @Post('onboarding')
  @Public()
  async onboardUser(
    @Query('token') token: string,
    @Body() info: UserOnboardingDto,
  ) {
    return await this.userService.onboardUser(token, info);
  }
}
