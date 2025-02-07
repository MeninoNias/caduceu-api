import * as yup from 'yup';

export const stockProductSchema = yup.object().shape({
  quantity: yup.number()
    .required('Quantidade é obrigatória')
    .integer('A quantidade deve ser um número inteiro')
    .min(0, 'A quantidade não pode ser negativa')
});