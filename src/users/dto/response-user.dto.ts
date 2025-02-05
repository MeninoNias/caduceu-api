import { ApiProperty } from '@nestjs/swagger';
import { User, UserRole } from '../entities/user.entity';

export class ResponseUserDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID do usuário criado'
  })
  id: string;

  @ApiProperty({
    example: 'joao@email.com',
    description: 'Email do usuário'
  })
  email: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.CLIENT,
    description: 'Tipo de usuário'
  })
  role: UserRole;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.role = user.role;
  }
}
