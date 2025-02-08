import { ApiProperty } from '@nestjs/swagger';

export class CartItemDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID do produto',
  })
  productId: string;

  @ApiProperty({
    example: 2,
    description: 'Quantidade do produto',
  })
  quantity: number;
}