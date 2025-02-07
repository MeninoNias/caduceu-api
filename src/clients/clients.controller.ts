import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { HashedPasswordPipe } from 'src/shared/pipes/hashed-password.pipe';
import { UserRole } from 'src/users/entities/user.entity';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { FindClientsDto } from './dto/find-client.dto';
import { ResponseClientDto } from './dto/response-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@ApiTags('🙆‍♂️ Clients')
@ApiBearerAuth()
@Roles(UserRole.ADMIN)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) { }

  @Post()
  create(
    @Body() createClientDto: CreateClientDto,
    @Body('password', HashedPasswordPipe) password: string
  ) {
    return this.clientsService.create({ ...createClientDto, password });
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos clientes' })
  @ApiResponse({
    status: 200,
    type: [ResponseClientDto]
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    type: Boolean
  })
  findAll(@Query() query: FindClientsDto): Promise<ResponseClientDto[]> {
    return this.clientsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar cliente por ID' })
  @ApiResponse({
    status: 200,
    type: ResponseClientDto
  })
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar cliente' })
  @ApiResponse({
    status: 200,
    type: ResponseClientDto
  })
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir cliente' })
  @ApiResponse({
    status: 204,
    description: 'Cliente excluído com sucesso'
  })
  remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }
}
