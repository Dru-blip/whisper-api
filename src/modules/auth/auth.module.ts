import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { EmailService } from '../emails/email.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, UsersService, EmailService],
})
export class AuthModule {}
