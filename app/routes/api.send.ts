import { json } from "@remix-run/node";
import { fakeSubmitForm } from "~/server/index.server";

export async function action({ request }: { request: Request }) {
  const form = await request.formData();

  const body = {
    name: form.get("real"),
    email: form.get("sdz"),
    message: form.get("description"),
  };

  await fakeSubmitForm(body);

  return json(
    {
      message: "ok",
    },
    { status: 200 }
  );
}
