import { ApiProperty } from '@nestjs/swagger';

export class UserOnboardingDto {
  @ApiProperty({ description: 'name of the onboarding user' })
  name: string;
  @ApiProperty({ description: 'bio of the onboarding user' })
  bio: string;
  @ApiProperty({ description: 'client identifier' })
  cid: string;
}
