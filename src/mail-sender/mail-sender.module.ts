import { Module } from '@nestjs/common';
import { MailService } from './mail-sender.service';

@Module({
  providers: [MailService],
  exports: [MailService],
})
export class MailSenderModule { }
