import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { LoginInput } from './dto/login.input';
import { AuthService } from './auth.service';
import { OTPInput } from './dto/otp.input';
import { Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  async sendOtp(@Body() loginInput: LoginInput) {
    return await this.authService.sendOtp(loginInput.email);
  }

  @Post('verify')
  @Public()
  async verifyOtp(
    @Body() verifyInput: OTPInput,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const data = await this.authService.verifyOtp(
        verifyInput.email,
        verifyInput.otp,
      );
      if (data.tokens) {
        response.cookie('aid', data.tokens.accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          signed: true,
        });
        response.cookie('rid', data.tokens.refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          signed: true,
        });
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
