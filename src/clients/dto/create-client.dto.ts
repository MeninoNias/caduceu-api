import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty({
    example: 'john@email.com',
    description: 'Email do usuário'
  })
  email: string;

  @ApiProperty({
    example: 'Abc123!@',
    description: 'Senha do usuário (min: 6 caracteres, deve conter maiúscula, minúscula, número e caractere especial)'
  })
  password: string;

  @ApiProperty({
    example: 'John Doe Silva',
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

}