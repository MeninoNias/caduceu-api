import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'john@email.com',
    description: 'Email do usuário'
  })
  email: string;

  @ApiProperty({
    example: 'Abc123!@',
    description: 'Senha do usuário'
  })
  password: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Nome completo'
  })
  fullName: string;

  @ApiProperty({
    example: '(11)99999-9999',
    description: 'Telefone de contato'
  })
  contact: string;

  @ApiProperty({
    example: 'Rua ABC, 123',
    description: 'Endereço completo'
  })
  address: string;
}