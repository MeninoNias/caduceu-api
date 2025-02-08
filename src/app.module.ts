import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { ClientsModule } from './clients/clients.module';
import { DataBaseConfigService } from './config/db.config.service';
import { MailSenderModule } from './mail-sender/mail-sender.module';
import { UsersModule } from './users/users.module';
import { ProductModule } from './product/product.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: DataBaseConfigService,
      inject: [DataBaseConfigService]
    }),
    AuthModule,
    UsersModule,
    ClientsModule,
    MailSenderModule,
    ProductModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [
    DataBaseConfigService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule { }
