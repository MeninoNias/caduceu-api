import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataBaseConfigService } from './config/db.config.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

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
  ],
  controllers: [],
  providers: [DataBaseConfigService],
})
export class AppModule { }
