import { Body, Controller, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserOnboardingDto } from './dto/onboarding.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('onboarding')
  @Public()
  async onboardUser(
    @Query('token') token: string,
    @Body() info: UserOnboardingDto,
  ) {
    await this.userService.onboardUser(token, info);
  }
}
