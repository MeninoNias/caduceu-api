import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindOptionsWhere,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository
} from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductsDto } from './dto/find-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { StockProductDto } from './entities/stock-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) { }

  async create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  async findAll(filters: FindProductsDto) {
    const where: FindOptionsWhere<Product> = {};

    if (filters.search) {
      where.name = ILike(`%${filters.search}%`);
    }

    if (filters.minPrice && filters.maxPrice) {
      where.price = Between(filters.minPrice, filters.maxPrice);
    } else if (filters.minPrice) {
      where.price = MoreThanOrEqual(filters.minPrice);
    } else if (filters.maxPrice) {
      where.price = LessThanOrEqual(filters.maxPrice);
    }

    if (filters.inStock !== undefined) {
      where.stockQuantity = filters.inStock
        ? MoreThanOrEqual(1)
        : 0;
    }
    return await this.productRepository.find({ where });
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      where: { id }
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);

    this.productRepository.merge(product, updateProductDto);

    return await this.productRepository.save(product);
  }

  async remove(id: string) {
    const product = await this.findOne(id);

    await this.productRepository.remove(product);
  }

  async updateStock(id: string, stockProductSchema: StockProductDto): Promise<Product> {
    const product = await this.findOne(id);
    const { quantity } = stockProductSchema;

    if (product.stockQuantity < quantity) {
      throw new BadRequestException('Quantidade indisponível em estoque');
    }

    product.stockQuantity -= quantity;

    return this.productRepository.save(product);
  }
}
