import { yupResolver } from "@hookform/resolvers/yup";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { convertRealToSeedz } from "~/utils";
import { formSchema } from "~/utils/schemas";

type Form = {
  real: number;
  sdz: number;
  description?: string;
};

export default function ReactHooksForm() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Form>({
    resolver: yupResolver(formSchema),
  });
  const fetcher = useFetcher();
  const realValue = watch("real");

  useEffect(() => {
    const sdzValue = convertRealToSeedz(realValue);
  
    if (!isNaN(realValue)) {
      setValue("sdz", isNaN(realValue) ? 0 : Number(sdzValue));
    }
  },[realValue, setValue])

  const onSubmit = handleSubmit(async (form: Form) => {
    fetcher.submit(form, {
      method: "POST",
      action: "/api/send",
    });
  });

  return (
    <section>
      <h1>Conversor de Reais para SDZ</h1>

      <form onSubmit={onSubmit}>
        <div>
          <div>
            <label>
              Real:
              <input type="number" {...register("real")} />
            </label>
          </div>
          {errors.real && <span>{errors.real.message}</span>}
        </div>
        <div>
          <div>
            <label>
              Seedz:
              <input type="number" disabled {...register("sdz")} />
            </label>
          </div>
          {errors.sdz && <span>{errors.sdz.message}</span>}
        </div>
        <div>
          <div>
            <label>
              Descrição
              <input {...register("description")} />
            </label>
          </div>
          {errors.description && <span>{errors.description.message}</span>}
        </div>
        <button type="submit">Enviar</button>
      </form>
    </section>
  );
}
