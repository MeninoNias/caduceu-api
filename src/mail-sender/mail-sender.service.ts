import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import { confirmMail } from './templates/confirm-mail.html';

@Injectable()
export class MailService {
  private transporter: Mail;

  private socials: string;


  constructor(private configService: ConfigService) {
    this.transporter = createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get('MAIL_PORT'),
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASS'),
      },
    });
  }

  async sendVerifyEmailMail(
    name: string,
    email: string,
    token: string,
  ): Promise<boolean> {
    const buttonLink = `${this.configService.get('API_URL')}/users/confirm/${token}?token=${token}`;

    const mail = confirmMail
      .replace(new RegExp('--PersonName--', 'g'), name)
      .replace(new RegExp('--ProjectName--', 'g'), this.configService.get('APP_NAME') || 'Caduceu')
      .replace(new RegExp('--ButtonLink--', 'g'), buttonLink)

    const mailOptions = {
      from: this.configService.get('MAIL_FROM'),
      to: email,
      subject: `Welcome to ${this.configService.get('APP_NAME')} ${name}! Confirm Your Email`,
      html: mail,
    };

    return new Promise<boolean>((resolve) =>
      this.transporter.sendMail(mailOptions, async (error) => {
        if (error) {
          resolve(false);
        }
        resolve(true);
      }),
    );
  }
}
