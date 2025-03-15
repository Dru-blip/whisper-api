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
import { OnboardingTokenPayload, Session } from 'src/types';
import { ONBOARDING_TOKEN_SECRET } from 'src/common/constants/config-names.constants';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeHexLowerCase } from '@oslojs/encoding';

@Injectable()
export class UsersService {
  constructor(
    private readonly em: EntityManager,
    private readonly tokenService: TokenService,
  ) {}

  async fetchSelf(session: Session) {
    const user = await this.em.findOne(User, { id: session.userId });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async searchUsers(query: string) {
    const users = await this.em.find(User, { name: query });
    return users;
  }

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
      throw new UnauthorizedException('Session expired');
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
        user.discriminator = this.generateDiscriminator(user.id);
        await this.em.persistAndFlush(user);
        return { message: 'User onboarded successfully', user };
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to onboard user');
    }
  }

  generateDiscriminator(userId: string): number {
    const hash = encodeHexLowerCase(sha256(new TextEncoder().encode(userId)));
    const discriminator = hash.substring(hash.length - 5);
    return parseInt(discriminator, 16) % 10000;
  }
}
