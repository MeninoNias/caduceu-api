import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Client } from '../../clients/entities/client.entity';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  RECEIVED = 'RECEIVED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Client, client => client.orders)
  client: Client;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.RECEIVED,
  })
  status: OrderStatus;

  @CreateDateColumn({ name: 'order_date' })
  orderDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 , default: 0})
  total: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  items: OrderItem[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}