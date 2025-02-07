import * as yup from 'yup';

export const registerSchema = yup.object().shape({
  email: yup.string()
    .email('Email inválido')
    .required('Email é obrigatório'),

  password: yup.string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .required('Senha é obrigatória'),

  fullName: yup.string()
    .required('Nome completo é obrigatório')
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),

  contact: yup.string()
    .required('Contato é obrigatório')
    .matches(
      /^\(?[1-9]{2}\)? ?(?:[2-8]|9[0-9])[0-9]{3}-?[0-9]{4}$/,
      'Formato de telefone inválido'
    ),

  address: yup.string()
    .required('Endereço é obrigatório')
    .min(10, 'Endereço deve ter no mínimo 10 caracteres')
    .max(255, 'Endereço deve ter no máximo 255 caracteres'),

});
