import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup.string()
  .required('O email é obrigatório')
  .email('Digite um email válido')
  .trim()
  .lowercase()
  .max(255, 'O email deve ter no máximo 255 caracteres'),
  password: yup.string()
  .required('A senha é obrigatória')
  .min(6, 'A senha deve ter no mínimo 6 caracteres')
  .max(100, 'A senha deve ter no máximo 100 caracteres'),
});