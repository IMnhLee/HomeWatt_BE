import { Controller, Get } from '@nestjs/common';
import { MailSenderService } from './mail-sender.service';
import { RmqService } from '@app/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class MailSenderController {
  constructor(
    private readonly mailSenderService: MailSenderService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern('send_forgot_password_mail')
  async sendForgotPasswordMail(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('Received data in sendForgotPasswordMail:', data);
    const response = await this.mailSenderService.sendForgotPasswordMail(data);
    console.log('Response from sendForgotPasswordMail:', response);
    this.rmqService.ack(context);
  }

  @EventPattern('send_welcome_mail')
  async sendWelcomeMail(@Payload() data: any, @Ctx() context: RmqContext) {
    await this.mailSenderService.sendWelcomeMail(data);
    this.rmqService.ack(context);
  }

  @EventPattern('send_notification_mail')
  async sendNotificationMail(@Payload() data: any, @Ctx() context: RmqContext) {
    await this.mailSenderService.sendNotificationMail(data);
    this.rmqService.ack(context);
  }
}
