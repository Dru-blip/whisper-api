import { ApiProperty } from '@nestjs/swagger';

export class LoginInput {
  @ApiProperty({ description: 'email of the user' })
  email: string;
  @ApiProperty({ description: 'client identifier' })
  cid: string;
}
