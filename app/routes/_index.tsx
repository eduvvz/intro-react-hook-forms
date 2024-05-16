import { useFetcher } from "@remix-run/react";
import React, { useEffect } from "react";
import { ValidationError } from "yup";
import { convertRealToSeedz } from "~/utils";
import { formSchema } from "~/utils/schemas";

type Form = {
  real: string;
  sdz: string;
  description: string;
};

const formInitialState: Form = {
  real: "",
  sdz: "",
  description: "",
};

export default function Index() {
  const fetcher = useFetcher();

  const [formErrors, setFormErrors] = React.useState<Form>(formInitialState);
  const [form, setForm] = React.useState<Form>(formInitialState);

  useEffect(() => {
    const real = parseFloat(form.real);

    setForm((prev) => ({
      ...prev,
      sdz: isNaN(real) ? "" : convertRealToSeedz(real),
    }));
  }, [form.real]);

  const validateFields = async (form: Form) => {
    try {
      const formValidate = await formSchema.validateSync(form, {
        abortEarly: false,
      });

      setFormErrors(formInitialState);
      return formValidate;
    } catch (error) {
      const e = error as ValidationError;

      const newFormErrors: Form = e.inner.reduce((acc, error) => {
        acc[error.path as keyof Form] = error.message;
        return acc;
      }, {} as Form);

      setFormErrors(newFormErrors);
      throw e;
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await validateFields(form);

    fetcher.submit(form, {
      method: "POST",
      action: "/api/send",
    });
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <section>
      <h1>Conversor de Reais para SDZ</h1>

      <form onSubmit={onSubmit}>
        <div>
          <div>
            <label>
              Real:
              <input type="number" name="real" onChange={onChange} />
            </label>
          </div>
          {formErrors.real && <span>{formErrors.real}</span>}
        </div>
        <div>
          <div>
            <label>
              Seedz:
              <input
                type="number"
                name="sdz"
                disabled
                onChange={onChange}
                value={form.sdz}
              />
            </label>
          </div>
          {formErrors.sdz && <span>{formErrors.sdz}</span>}
        </div>
        <div>
          <div>
            <label>
              Descrição
              <input name="description" onChange={onChange} />
            </label>
          </div>
          {formErrors.description && <span>{formErrors.description}</span>}
        </div>
        <button type="submit">Enviar</button>
      </form>
    </section>
  );
}
