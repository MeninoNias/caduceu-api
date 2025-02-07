import * as yup from 'yup';

export const updateProductSchema = yup.object().shape({
  name: yup.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),

  description: yup.string()
    .min(10, 'Descrição deve ter no mínimo 10 caracteres')
    .max(500, 'Descrição deve ter no máximo 500 caracteres'),

  price: yup.number()
    .positive('Preço deve ser maior que zero')
    .test(
      'decimal',
      'Preço deve ter no máximo 2 casas decimais',
      value => !value || Number.isInteger(value * 100)
    ),

  stockQuantity: yup.number()
    .integer('Quantidade deve ser um número inteiro')
    .min(0, 'Quantidade não pode ser negativa')
});