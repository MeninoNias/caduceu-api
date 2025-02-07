import * as yup from 'yup';
import { OrderStatus } from '../entities/order.entity';

export const createOrderSchema = yup.object().shape({
  clientId: yup.string()
    .uuid('ID do cliente inválido')
    .required('Cliente é obrigatório'),

  status: yup.mixed<OrderStatus>()
    .oneOf(
      Object.values(OrderStatus),
      'Status inválido'
    )
    .default(OrderStatus.RECEIVED),
});