import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from 'src/product/product.module';
import { Client } from '../clients/entities/client.entity';
import { ProductService } from '../product/product.service';
import { CartController } from './cart.controller';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ClientsModule } from 'src/clients/clients.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Client]),
    ProductModule,
    ClientsModule,
  ],
  controllers: [OrdersController, CartController],
  providers: [OrdersService],
  exports: [OrdersService]
})
export class OrdersModule { }
