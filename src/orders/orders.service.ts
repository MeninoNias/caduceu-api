import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { ClientsService } from '../clients/clients.service';
import { ProductService } from '../product/product.service';
import { CartItemDto } from './dto/cart/add-cart-item.dto';
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
    @InjectRepository(OrderItem)
    private cartRepository: Repository<OrderItem>,
    private dataSource: DataSource,
    private readonly clientsService: ClientsService,
    private readonly productService: ProductService,
  ) { }

  async create(createOrderDto: CreateOrderDto) {
    const client = await this.clientsService.findOne(createOrderDto.clientId);

    const order = this.orderRepository.create({ client, status: createOrderDto.status || OrderStatus.PROCESSING });
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

  async findOrderByUser(user: User) {
    const client = await this.clientsService.findOneByUser(user.id);

    const order = await this.orderRepository.findOne({
      where: {
        client: { id: client.id },
        status: OrderStatus.PROCESSING
      },
      relations: ['items', 'items.product']
    });

    if (!order) {
      throw new NotFoundException('Carrinho não encontrado');
    }

    return order;
  }

  // Métodos para CartController
  async addCartItem(user: User, items: CartItemDto[]) {
    const client = await this.clientsService.findOneByUser(user.id);

    let order: Order | null;
    order = await this.orderRepository.findOne({
      where: { status: OrderStatus.PROCESSING, client: { id: client.id } },
      relations: ['items']
    });


    if (!order) {
      order = await this.orderRepository.save(
        this.orderRepository.create({
          client,
          status: OrderStatus.PROCESSING,
          total: 0,
          items: []
        })
      );
    }

    const orderItems = await Promise.all(
      items.map(async item => {
        const product = await this.productService.findOne(item.productId);
        if (product.stockQuantity < item.quantity) {
          throw new NotFoundException(`Produto ${product.name} sem estoque disponível`);
        }
        return this.cartRepository.save(
          this.cartRepository.create({
            order,
            product,
            unitPrice: product.price,
            subtotal: product.price * item.quantity,
            quantity: item.quantity
          },)
        );
      })
    );

    order.items = [...(order.items || []), ...orderItems];
    order.total = order.items.reduce(
      (sum, item) => sum + Number(item.subtotal),
      0
    );
    const savedOrder = await this.orderRepository.save(order);
    return await this.orderRepository.findOne({ where: { id: savedOrder.id }, relations: ['items'] });
  }

  async removeCartItem(itemId: string, user: User) {
    const client = await this.clientsService.findOneByUser(user.id);

    const orderItem = await this.cartRepository.findOne({
      where: {
        id: itemId,
        order: {
          client: { id: client.id },
          status: OrderStatus.PROCESSING
        }
      },
      relations: ['order', 'order.items']
    });

    if (!orderItem) {
      throw new NotFoundException('Item não encontrado no carrinho');
    }

    const order = orderItem.order;
    await this.cartRepository.remove(orderItem);

    // Recalcula total do pedido
    order.total = order.items
      .filter(item => item.id !== itemId)
      .reduce((sum, item) => sum + Number(item.subtotal), 0);

    const savedOrder = await this.orderRepository.save(order);

    return await this.orderRepository.findOne({ where: { id: savedOrder.id }, relations: ['items'] });

  }

  async updateCartItemQuantity(itemId: string, user: User, quantity: number) {
    const client = await this.clientsService.findOneByUser(user.id);

    const orderItem = await this.cartRepository.findOne({
      where: {
        id: itemId,
        order: {
          client: { id: client.id },
          status: OrderStatus.PROCESSING
        }
      },
      relations: ['order', 'product', 'order.items']
    });

    if (!orderItem) {
      throw new NotFoundException('Item não encontrado no carrinho');
    }

    if (orderItem.product.stockQuantity < quantity) {
      throw new BadRequestException(`Quantidade indisponível em estoque`);
    }

    orderItem.quantity = quantity;
    orderItem.subtotal = orderItem.product.price * quantity;

    const savedItem = await this.cartRepository.save(orderItem);

    orderItem.order.total = orderItem.order.items
      .map(item => item.id === itemId ? savedItem : item)
      .reduce((sum, item) => sum + Number(item.subtotal), 0);

    const savedOrder = await this.orderRepository.save(orderItem.order);

    return await this.orderRepository.findOne({ where: { id: savedOrder.id }, relations: ['items'] });
  }

  async findCartItems(user: User) {

    const client = await this.clientsService.findOneByUser(user.id);

    const orderItem = await this.orderRepository.findOne(
      {
        where: {
          client: { id: client.id },
          status: OrderStatus.PROCESSING
        },
        relations: ['items']
      });
    return orderItem?.items || [];
  }


  async cartPayment(user: User) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await this.findOrderByUser(user);
      if (!order) throw new NotFoundException('Carrinho não encontrado');

      await Promise.all(order.items.map(async (item) => {
        const product = await this.productService.findOne(item.product.id);
        if (product.stockQuantity < item.quantity) {
          throw new BadRequestException(`Produto ${product.name} indisponível`);
        }
      }));

      const isPaid = Math.random() > 0.3;
      if (!isPaid) {
        await queryRunner.rollbackTransaction();
        return { status: 'REJECTED', message: 'Pagamento rejeitado' };
      }

      await Promise.all(order.items.map(item =>
        this.productService.updateStock(item.product.id, { quantity: item.quantity })
      ));

      order.status = OrderStatus.READY;
      await queryRunner.manager.save(Order, order);

      await queryRunner.commitTransaction();
      return { status: 'APPROVED', message: 'Pagamento aprovado' };

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
