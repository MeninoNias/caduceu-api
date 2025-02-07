import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { Client } from './entities/client.entity';
import { MailSenderModule } from 'src/mail-sender/mail-sender.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client, User]),
    UsersModule,
    MailSenderModule
  ],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService]
})
export class ClientsModule { }
