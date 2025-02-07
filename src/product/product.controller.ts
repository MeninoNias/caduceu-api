import {
  Body,
  Controller,
  Delete,
  Get,
  Param, Patch, Post
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { YupValidationPipe } from '../shared/pipes/yup-validation.pipe';
import { UserRole } from '../users/entities/user.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';
import { createProductSchema } from './schemas/create-product.schema';
import { updateProductSchema } from './schemas/update-product.schema';

@ApiTags('📦 Product')
@ApiBearerAuth()
@Roles(UserRole.ADMIN)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @ApiOperation({ summary: 'Criar novo produto' })
  @ApiResponse({
    status: 201,
    description: 'Produto criado com sucesso'
  })
  create(
    @Body(new YupValidationPipe(createProductSchema))
    createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos produtos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos retornada com sucesso'
  })
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar produto por ID' })
  @ApiResponse({
    status: 200,
    description: 'Produto encontrado com sucesso'
  })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar produto' })
  @ApiResponse({
    status: 200,
    description: 'Produto atualizado com sucesso'
  })
  update(
    @Param('id') id: string,
    @Body(new YupValidationPipe(updateProductSchema))
    updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover produto' })
  @ApiResponse({
    status: 204,
    description: 'Produto removido com sucesso'
  })
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
