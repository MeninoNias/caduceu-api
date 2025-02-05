import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'João Silva' })
  name: string;

  @ApiProperty({ example: 'joao@email.com' })
  email: string;

  @ApiProperty({ example: '123@mudar' })
  password: string;

  @ApiProperty({ enum: UserRole, example: UserRole.CLIENT })
  role: UserRole;
}
