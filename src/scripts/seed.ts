import { config } from "dotenv";
import { DataSource } from "typeorm";
import { User, UserRole } from "src/users/entities/user.entity";
import { Client } from "src/clients/entities/client.entity";
import { Product } from "src/product/entities/product.entity";
import { Order, OrderStatus } from "src/orders/entities/order.entity";
import { OrderItem } from "src/orders/entities/order-item.entity";
import * as bcrypt from 'bcrypt';

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/**/*.entity{.ts,.js}'], // Usar glob pattern para entidades
  synchronize: false
});

async function seed() {
  console.log('Iniciando seed...');
  await AppDataSource.initialize();

  const adminUser = await AppDataSource.getRepository(User).save({
    name: 'Admin',
    email: 'admin@admin.com',
    password: await bcrypt.hash('Admin@123', 10),
    role: UserRole.ADMIN,
    emailConfirm: true
  });

  const clientUser = await AppDataSource.getRepository(User).save({
    name: 'Cliente Teste',
    email: 'cliente@teste.com',
    password: await bcrypt.hash('Cliente@123', 10),
    role: UserRole.CLIENT,
    emailConfirm: true
  });

  const client = await AppDataSource.getRepository(Client).save({
    user: clientUser,
    fullName: 'Cliente Teste Completo',
    contact: '11999999999',
    address: 'Rua Teste, 123',
    isActive: true
  });

  const products = await AppDataSource.getRepository(Product).save([
    {
      name: 'Produto 1',
      description: 'Descrição do Produto 1',
      price: 99.99,
      stockQuantity: 100
    },
    {
      name: 'Produto 2',
      description: 'Descrição do Produto 2',
      price: 149.99,
      stockQuantity: 50
    }
  ]);

  const order = await AppDataSource.getRepository(Order).save({
    client,
    status: OrderStatus.PROCESSING,
    total: 0
  });

  const orderItems = await AppDataSource.getRepository(OrderItem).save([
    {
      order,
      product: products[0],
      quantity: 2,
      unitPrice: products[0].price,
      subtotal: products[0].price * 2
    },
    {
      order,
      product: products[1],
      quantity: 1,
      unitPrice: products[1].price,
      subtotal: products[1].price
    }
  ]);

  order.total = orderItems.reduce((sum, item) => sum + Number(item.subtotal), 0);
  await AppDataSource.getRepository(Order).save(order);

  console.log('Seed concluído com sucesso!');
  await AppDataSource.destroy();
}

seed().catch(error => {
  console.error('Erro durante o seed:', error);
  process.exit(1);
});