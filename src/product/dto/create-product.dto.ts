import { ApiProperty } from "@nestjs/swagger";

export class CreateProductDto {
  @ApiProperty({ example: 'Smartphone XYZ', description: 'Nome do produto' })
  name: string;

  @ApiProperty({ example: 'Descrição do produto...', description: 'Descrição detalhada' })
  description: string;

  @ApiProperty({ example: 1999.99, description: 'Preço do produto' })
  price: number;

  @ApiProperty({ example: 100, description: 'Quantidade em estoque', default: 0 })
  stockQuantity: number;
}
