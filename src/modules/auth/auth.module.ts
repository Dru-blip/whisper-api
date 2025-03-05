import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { EmailService } from '../emails/email.service';
// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// import { JwtStrategy } from './strategies/jwt.strategy';
// import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  providers: [AuthService, UsersService, EmailService],
})
export class AuthModule {}
