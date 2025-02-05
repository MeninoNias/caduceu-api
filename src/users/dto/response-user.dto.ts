import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class ResponseUserDto {
  @Expose()
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @Expose()
  @ApiProperty({ example: 'João Silva' })
  name: string;

  @Expose()
  @ApiProperty({ example: 'joao@email.com' })
  email: string;

  constructor(partial: Partial<ResponseUserDto>) {
    Object.assign(this, partial);
  }
}