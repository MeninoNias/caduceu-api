import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '../entities/order.entity';

export class CreateOrderDto {
  @ApiProperty({
    description: 'ID do cliente',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  clientId: string;

  @ApiPropertyOptional({
    enum: OrderStatus,
    default: OrderStatus.RECEIVED,
    description: 'Status do pedido',
    example: OrderStatus.RECEIVED
  })
  status?: OrderStatus;
}