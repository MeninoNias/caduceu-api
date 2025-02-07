import * as yup from 'yup';

export const createProductSchema = yup.object().shape({
  name: yup.string()
    .required('Nome é obrigatório')
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),

  description: yup.string()
    .required('Descrição é obrigatória')
    .min(10, 'Descrição deve ter no mínimo 10 caracteres')
    .max(500, 'Descrição deve ter no máximo 500 caracteres'),

  price: yup.number()
    .required('Preço é obrigatório')
    .positive('Preço deve ser maior que zero')
    .test(
      'decimal',
      'Preço deve ter no máximo 2 casas decimais',
      value => !value || Number.isInteger(value * 100)
    ),

  stockQuantity: yup.number()
    .required('Quantidade em estoque é obrigatória')
    .integer('Quantidade deve ser um número inteiro')
    .min(0, 'Quantidade não pode ser negativa')
});