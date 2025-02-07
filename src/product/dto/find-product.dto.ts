import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class FindProductsDto {
  @ApiPropertyOptional({
    description: 'Busca por nome ou descrição',
    example: 'medicamento'
  })
  search?: string;

  @ApiPropertyOptional({
    description: 'Preço mínimo',
    example: 10.50
  })
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Preço máximo',
    example: 50.00
  })
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Apenas produtos em estoque',
    example: true
  })
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  inStock?: boolean;
}