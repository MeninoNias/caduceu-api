import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export class ResponseClientDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID do cliente'
  })
  id: string;

  @ApiProperty({
    example: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'cliente@email.com'
    },
    description: 'Dados do usuário vinculado'
  })
  user: Partial<User>;

  @ApiProperty({
    example: 'João da Silva',
    description: 'Nome completo do cliente'
  })
  fullName: string;

  @ApiProperty({
    example: '(11)99999-9999',
    description: 'Telefone de contato'
  })
  contact: string;

  @ApiProperty({
    example: 'Rua Principal, 123 - Centro, Cidade - UF',
    description: 'Endereço completo'
  })
  address: string;

  @ApiProperty({
    example: true,
    description: 'Status do cliente'
  })
  isActive: boolean;

  @ApiProperty({
    example: '2024-02-06T00:00:00.000Z',
    description: 'Data de criação'
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-02-06T00:00:00.000Z',
    description: 'Data da última atualização'
  })
  updatedAt: Date;

  constructor(partial: Partial<ResponseClientDto>) {
    Object.assign(this, partial);
  }
}