import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { User } from '../entities/users.entity';
import { TokenService } from '../utils/tokens.service';
import { UserOnboardingDto } from './dto/onboarding.dto';
import { OnboardingTokenPayload } from 'src/types';
import { ONBOARDING_TOKEN_SECRET } from 'src/common/constants/config-names.constants';

@Injectable()
export class UsersService {
  constructor(
    private readonly em: EntityManager,
    private readonly tokenService: TokenService,
  ) {}

  async onboardUser(onboardingToken: string, userInfo: UserOnboardingDto) {
    let email: string;
    try {
      const payload =
        await this.tokenService.verifyToken<OnboardingTokenPayload>(
          onboardingToken,
          { name: ONBOARDING_TOKEN_SECRET },
        );
      email = payload.email;
    } catch (error) {
      throw new UnauthorizedException('Invalid onboarding token');
    }

    const user = await this.em.findOne(User, { email });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user && user.onboarded) {
      throw new BadRequestException('User already onboarded');
    }

    try {
      if (user && !user.onboarded) {
        user.onboarded = true;
        user.name = userInfo.name;
        user.bio = userInfo.bio;
        await this.em.persistAndFlush(user);
        return { message: 'User onboarded successfully', user };
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to onboard user');
    }
  }
}
