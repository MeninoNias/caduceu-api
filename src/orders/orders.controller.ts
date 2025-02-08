import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { YupValidationPipe } from '../shared/pipes/yup-validation.pipe';
import { UserRole } from '../users/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { StatusOrderDto } from './dto/status-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from './entities/order.entity';
import { OrdersService } from './orders.service';
import { createOrderSchema } from './schemas/create-order.schema';

@ApiTags('🛒 Orders')
@ApiBearerAuth()
@Roles(UserRole.ADMIN)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  @ApiOperation({ summary: 'Criar novo pedido' })
  @ApiResponse({
    status: 201,
    description: 'Pedido criado com sucesso',
    type: CreateOrderDto
  })
  create(
    @Body(new YupValidationPipe(createOrderSchema))
    createOrderDto: CreateOrderDto
  ) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos pedidos' })
  @ApiQuery({ name: 'status', required: false, enum: OrderStatus })
  @ApiQuery({ name: 'clientId', required: false })
  @ApiResponse({
    status: 200,
    description: 'Lista de pedidos retornada com sucesso'
  })
  findAll(
    @Query('status') status?: string,
    @Query('clientId') clientId?: string
  ) {
    return this.ordersService.findAll({ status, clientId });
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualizar status do pedido' })
  @ApiResponse({
    status: 200,
    description: 'Status atualizado com sucesso'
  })
  updateStatus(
    @Param('id') id: string,
    @Body() statusOrderDto: StatusOrderDto
  ) {
    return this.ordersService.updateStatus(id, statusOrderDto);
  }

  @Delete(':id/cancel')
  @ApiOperation({ summary: 'Cancelar pedido' })
  @ApiResponse({
    status: 204,
    description: 'Pedido cancelado com sucesso'
  })
  cancel(@Param('id') id: string) {
    return this.ordersService.cancel(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar pedido por ID' })
  @ApiResponse({
    status: 200,
    description: 'Pedido encontrado'
  })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Get(':id/items')
  @ApiOperation({ summary: 'Listar itens do pedido' })
  @ApiResponse({
    status: 200,
    description: 'Itens do pedido listados com sucesso'
  })
  findItems(@Param('id') id: string) {
    return this.ordersService.findItems(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar pedido' })
  @ApiResponse({
    status: 200,
    description: 'Pedido atualizado com sucesso'
  })
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar pedido' })
  @ApiResponse({
    status: 204,
    description: 'Pedido deletado com sucesso'
  })
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
