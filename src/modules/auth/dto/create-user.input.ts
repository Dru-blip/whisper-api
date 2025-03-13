import { ApiProperty } from '@nestjs/swagger';

export class CreateUserInput {
  @ApiProperty()
  username: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}
