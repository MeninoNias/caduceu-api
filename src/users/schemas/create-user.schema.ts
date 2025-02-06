import * as yup from 'yup';
import { UserRole } from '../entities/user.entity';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

export const createUserSchema = yup.object().shape({
  name: yup.string()
    .required('Nome é obrigatório')
    .length(3, 'Nome deve ter no mínimo 3 caracteres'),

  email: yup.string()
    .email('Email inválido')
    .required('Email é obrigatório'),

  password: yup.string()
    .matches(
      PASSWORD_REGEX,
      'Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial'
    )
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .required('Senha é obrigatória'),

  role: yup.mixed<UserRole>()
    .oneOf(Object.values(UserRole))
    .required('Tipo de usuário é obrigatório'),
});
