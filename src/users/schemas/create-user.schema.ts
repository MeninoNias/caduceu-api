import * as yup from 'yup';
import { UserRole } from '../entities/user.entity';

export const createUserSchema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório').length(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: yup.string().email('Email inválido').required(),
  password: yup.string().min(6, 'Senha deve ter no mínimo 6 caracteres').required(),
  role: yup.mixed<UserRole>().oneOf(Object.values(UserRole)).required(),
});
