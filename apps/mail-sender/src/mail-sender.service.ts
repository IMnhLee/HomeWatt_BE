import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content: any;
  }>;
}

export interface ForgotPasswordMailData {
  email: string;
  resetToken: string;
  username: string;
}

export interface WelcomeMailData {
  email: string;
  username: string;
}

export interface NotificationMailData {
  email: string;
  subject: string;
  message: string;
}

@Injectable()
export class MailSenderService {
  private readonly logger = new Logger(MailSenderService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: this.configService.get<boolean>('MAIL_SECURE', false),
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
    });
  }

  private async sendMail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"${this.configService.get<string>('MAIL_FROM_NAME')}" <${this.configService.get<string>('MAIL_FROM_ADDRESS')}>`,
        ...options,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent: ${info.messageId}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`, error.stack);
      return false;
    }
  }

  async sendForgotPasswordMail(data: ForgotPasswordMailData): Promise<boolean> {
    const resetUrl = `${this.configService.get<string>('FRONTEND_URL')}/reset-password?token=${data.resetToken}?email=${data.email}`;
    
    return this.sendMail({
      to: data.email,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset</h1>
        <p>Hello ${data.username},</p>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <p><a href="${resetUrl}">Reset Password</a></p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
      `,
    });
  }

  async sendWelcomeMail(data: WelcomeMailData): Promise<boolean> {
    return this.sendMail({
      to: data.email,
      subject: 'Welcome to HomeWatt',
      html: `
        <h1>Welcome to HomeWatt!</h1>
        <p>Hello ${data.username},</p>
        <p>Thank you for registering with HomeWatt. We're excited to have you on board!</p>
        <p>You can now monitor and manage your home energy consumption efficiently.</p>
        <p>If you have any questions, feel free to contact our support team.</p>
      `,
    });
  }

  async sendNotificationMail(data: NotificationMailData): Promise<boolean> {
    return this.sendMail({
      to: data.email,
      subject: data.subject,
      html: `
        <h1>${data.subject}</h1>
        <p>${data.message}</p>
      `,
    });
  }
}