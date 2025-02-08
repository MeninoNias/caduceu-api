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
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { HashedPasswordPipe } from '../shared/pipes/hashed-password.pipe';
import { YupValidationPipe } from '../shared/pipes/yup-validation.pipe';
import { User, UserRole } from '../users/entities/user.entity';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { FindClientsDto } from './dto/find-client.dto';
import { ResponseClientDto } from './dto/response-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { createClientSchema } from './schemas/create-client.schema';

@ApiTags('🙆‍♂️ Clients')
@Roles()
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) { }

  @Roles(UserRole.ADMIN, UserRole.CLIENT)
  @Get('me')
  @ApiOperation({ summary: 'Buscar Meus Dados' })
  @ApiResponse({
    status: 200,
    type: ResponseClientDto
  })
  me(@CurrentUser() user: User) {
    return this.clientsService.findOneByUser(user.id);
  }

  @Roles(UserRole.ADMIN, UserRole.CLIENT)
  @Patch('me')
  @ApiOperation({ summary: 'Atualizar cliente' })
  @ApiResponse({
    status: 200,
    type: ResponseClientDto
  })
  async updateMe(@CurrentUser() user: User, @Body() updateClientDto: UpdateClientDto) {
    const clint = await this.clientsService.findOneByUser(user.id);
    return this.clientsService.update(clint.id, updateClientDto);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cria os clientes' })
  @ApiResponse({
    status: 201,
    type: [ResponseClientDto]
  })
  create(
    @Body(new YupValidationPipe(createClientSchema)) createClientDto: CreateClientDto,
    @Body('password', HashedPasswordPipe) password: string
  ) {
    return this.clientsService.create({ ...createClientDto, password });
  }

  @Get()
  @Roles(UserRole.ADMIN)
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
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Buscar cliente por ID' })
  @ApiResponse({
    status: 200,
    type: ResponseClientDto
  })
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Atualizar cliente' })
  @ApiResponse({
    status: 200,
    type: ResponseClientDto
  })
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Excluir cliente' })
  @ApiResponse({
    status: 204,
    description: 'Cliente excluído com sucesso'
  })
  remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }




}
