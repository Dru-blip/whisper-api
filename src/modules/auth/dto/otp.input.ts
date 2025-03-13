import { ApiProperty } from '@nestjs/swagger';

export class OTPInput {
  @ApiProperty()
  email: string;
  @ApiProperty()
  otp: string;
  @ApiProperty()
  cid: string;
}
