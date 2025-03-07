import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { LoginInput } from './dto/login.input';
import { AuthService } from './auth.service';
import { OTPInput } from './dto/otp.input';
import { Request, Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  async sendOtp(@Body() loginInput: LoginInput, @Req() req: Request) {
    return await this.authService.sendOtp(
      loginInput,
      req.socket.remoteAddress!,
    );
  }

  @Post('verify')
  @Public()
  async verifyOtp(
    @Query('tid') token: string,
    @Body() verifyInput: OTPInput,
    @Res({ passthrough: true }) response: Response,
    @Req() req: Request,
  ) {
    try {
      const data = await this.authService.verifyOtp(
        token,
        verifyInput,
        req.socket.remoteAddress!,
      );
      if (data?.tokens) {
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
      if (data?.onboarding) {
        return { ...data };
      }
      return { message: data?.message };
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
