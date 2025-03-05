import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';
import { SentMessageInfo, Options } from 'nodemailer/lib/smtp-transport';

@Injectable()
export class EmailService implements OnModuleInit, OnModuleDestroy {
  private transporter: Transporter<SentMessageInfo, Options>;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.transporter = createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: true,
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  private generateOtpEmailTemplate(otp: string): string {
    return `
      <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
        <h1 style="color: #007bff;">Whisper</h1>
        <h2 style="color: #333;">Your OTP Code</h2>
        <p style="font-size: 16px; color: #555;">Use the following OTP to proceed:</p>
        <h1 style="color: #007bff; font-size: 32px;">${otp}</h1>
        <p style="font-size: 14px; color: #777;">This code is valid for a limited time. Do not share it with anyone.</p>
      </div>
    `;
  }

  async sendOtpMail(recipient: string, otp: string): Promise<void> {
    await this.transporter.sendMail({
      from: this.configService.get<string>('EMAIL_USER'),
      to: recipient,
      subject: 'Verification Code',
      html: this.generateOtpEmailTemplate(otp),
    });
  }

  onModuleDestroy() {
    this.transporter.close();
  }
}
