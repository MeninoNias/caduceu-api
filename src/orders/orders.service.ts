import { Controller, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Client } from '../clients/entities/client.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { StatusOrderDto } from './dto/status-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderItem } from './entities/order-item.entity';
import { Order, OrderStatus } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>
  ) { }

  async create(createOrderDto: CreateOrderDto) {
    const client = await this.clientRepository.findOne({
      where: { id: createOrderDto.clientId }
    });

    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }

    const order = this.orderRepository.create({ client, status: createOrderDto.status || OrderStatus.RECEIVED });
    const savedOrder = await this.orderRepository.save(order);

    return await this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['client']
    });
  }

  async findAll(filters: { status?: string; clientId?: string }) {

    const where: FindOptionsWhere<Order> = {};

    if (filters.status) {
      where.status = filters.status as OrderStatus;
    }

    if (filters.clientId) {
      where.client = { id: filters.clientId };
    }
    return await this.orderRepository.find({
      where,
      relations: ['client', 'items', 'items.product'],
    });
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['client', 'items', 'items.product']
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    return order;
  }

  async updateStatus(id: string, statusOrderDto: StatusOrderDto): Promise<Order> {
    const order = await this.findOne(id);

    if (statusOrderDto.status) {
      order.status = statusOrderDto.status;
    }

    return await this.orderRepository.save(order);
  }

  async cancel(id: string): Promise<void> {
    const order = await this.findOne(id);
    order.status = OrderStatus.CANCELLED;
    await this.orderRepository.save(order);
  }

  async findItems(id: string): Promise<OrderItem[]> {
    const order = await this.findOne(id);
    return order.items;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    this.orderRepository.merge(order, updateOrderDto);
    return await this.orderRepository.save(order);
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);
    await this.orderRepository.remove(order);
  }
}
