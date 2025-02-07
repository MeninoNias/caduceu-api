import { ApiProperty } from '@nestjs/swagger';

export class StockProductDto {
  @ApiProperty({
    description: 'Quantidade em estoque',
    example: 10,
    type: Number,
    minimum: 0,
    required: true
  })
  quantity: number;
}