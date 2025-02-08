import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  OmitType
} from "@nestjs/swagger";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { User, UserRole } from "../users/entities/user.entity";
import { CartItemDto } from "./dto/cart/add-cart-item.dto";
import { OrdersService } from "./orders.service";

@ApiTags('🛍️ Cart')
@ApiBearerAuth()
@Roles(UserRole.CLIENT)
@Controller('cart')
export class CartController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post('items')
  @ApiOperation({ summary: 'Adicionar item ao carrinho' })
  @ApiBody({ type: [CartItemDto] })
  @ApiResponse({ status: 201 })
  async addItem(
    @CurrentUser() user: User,
    @Body() items: CartItemDto[]
  ) {
    const cart = await this.ordersService.addCartItem(user, items);
    return cart;
  }

  @Delete('items/:itemId')
  @ApiOperation({ summary: 'Remover item do carrinho' })
  @ApiResponse({
    status: 200,
    description: 'Item removido com sucesso'
  })
  async removeItem(
    @CurrentUser() user: User,
    @Param('itemId') itemId: string
  ) {
    return this.ordersService.removeCartItem(itemId, user);
  }

  @Put('items/:itemId/quantity')
  @ApiOperation({ summary: 'Atualizar quantidade do item' })
  @ApiBody({ type: OmitType(CartItemDto, ['productId']) })
  @ApiResponse({
    status: 200,
    description: 'Quantidade atualizada com sucesso'
  })
  async updateQuantity(
    @CurrentUser() user: User,
    @Param('itemId') itemId: string,
    @Body('quantity') quantity: number
  ) {
    return this.ordersService.updateCartItemQuantity(itemId, user, quantity);
  }

  @Get()
  @ApiOperation({ summary: 'Listar itens do carrinho' })
  @ApiResponse({
    status: 200,
    description: 'Lista de itens retornada com sucesso'
  })
  async findAll(@CurrentUser() user: User) {
    return this.ordersService.findCartItems(user);
  }

  @Post('payment')
  @ApiOperation({ summary: 'Pagamento do carrinho' })
  @ApiResponse({
    status: 200,
    description: 'Pagamento do carrinho realizado com sucesso'
  })
  async cartPayment(@CurrentUser() user: User){
    return this.ordersService.cartPayment(user);
  }
}
