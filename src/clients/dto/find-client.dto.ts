import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindClientsDto {
  @ApiPropertyOptional({
    description: 'Termo para busca em nome e email',
    example: 'joão'
  })
  search?: string;

  @ApiPropertyOptional({
    description: 'Status do cliente',
    example: true
  })
  isActive?: boolean;
}