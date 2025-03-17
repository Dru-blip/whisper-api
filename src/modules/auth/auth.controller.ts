import {
  Body,
  Controller,
  Get,
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
import { Session } from 'src/types';
import { ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Logout' })
  @Get('logout')
  async logout(@Req() req: Request) {
    await this.authService.logout(<Session>req.session);
  }

  @ApiOperation({ summary: 'Login' })
  @Post('login')
  @Public()
  async sendOtp(@Body() loginInput: LoginInput, @Req() req: Request) {
    return await this.authService.sendOtp(
      loginInput,
      req.socket.remoteAddress!,
    );
  }

  @ApiOperation({ summary: 'Verify OTP' })
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
      if (data?.session) {
        response.cookie('sid', data.sessionToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          maxAge: data.session.expiresAt.getTime(),
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
