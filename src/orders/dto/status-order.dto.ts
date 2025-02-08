import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../entities/order.entity';

export class StatusOrderDto {
  @ApiProperty({
    enum: OrderStatus,
    description: 'Status do pedido',
    example: OrderStatus.PROCESSING,
    enumName: 'OrderStatus'
  })
  status: OrderStatus;
}