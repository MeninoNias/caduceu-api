import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('👤 Users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ApiOperation({ summary: 'Criar novo usuário' })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    type: ResponseUserDto
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    const user = await this.usersService.create(createUserDto);
    return new ResponseUserDto(user);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos usuários' })
  @ApiResponse({
    status: 200,
    type: [ResponseUserDto]
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiResponse({
    status: 200,
    type: ResponseUserDto
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiResponse({
    status: 200,
    type: ResponseUserDto
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir usuário' })
  @ApiResponse({
    status: 204,
    description: 'Usuário excluído com sucesso'
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
