import * as yup from "yup";

export const formSchema = yup.object().shape({
  real: yup
    .number()
    .required("O campo é requirido")
    .positive("O valor deve ser positivo")
    .min(1, "O valor deve ser maior que 0"),
  sdz: yup.number().required("O campo é requirido").positive("O valor deve ser positivo"),
  description: yup
    .string()
    .optional()
    .max(100, "A descrição deve ter no máximo 100 caracteres"),
});
