import React, { useEffect, useState } from "react";
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import { useActionData, Link, Form } from "@remix-run/react";

import { register, authenticator } from "../utils/auth.server";
import { InputField } from "../components/InputField";
import { registerSchema } from "../utils/validationschema";
// import { AuthorizationError } from "remix-auth";
import { ZodIssue } from "zod";
import { AuthorizationError } from "remix-auth";

export const meta: MetaFunction = () => {
  return [
    {
      title: "New Remix taskmanager App SignUp page",
      description: "Create a new account in Remix taskmanager App",
    },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });
  return { user };
};

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const form = await request.formData();
  const action = String(form.get("_action"));
  const email = String(form.get("email"));
  const password = String(form.get("password"));
  const name = String(form.get("name"));

  const result = registerSchema.safeParse({
    name,
    email,
    password,
  });
  console.log("errors are" + result.error?.issues);
  if (!result.success) {
    return json(
      {
        error: result.error?.issues,
        form: action,
      },
      { status: 400 }
    );
  }

  // return await authenticator.authenticate("user-pass", request, {
  //   successRedirect: "/",
  //   failureRedirect: "/login",
  // });
  try {
    const resp = await register({ email, password, name });
    console.log(resp);
    if (typeof resp !== "string") {
      return resp;
    }
    console.log("in try block");
    return await authenticator.authenticate("user-pass", request, {
      successRedirect: "/",
      // failureRedirect: "/login",
      throwOnError: true,
    });
  } catch (error) {
    if (error instanceof Response) return error;
    if (error instanceof AuthorizationError) {
      console.log(error);
      return json({ error: "Invalid credentials" }, { status: 401 });
    }
  }

  return redirect("/login");
};

export default function Signup() {
  const actionData = useActionData<typeof action>();
  console.log(actionData?.error);
  const [formData, setFormData] = useState({
    email: actionData?.fields?.email || "",
    password: actionData?.fields?.password || "",
    name: actionData?.fields?.name || "",
    // error: actionData?.fields?.error || "no error",
  });
  console.log(formData);
  const [error, setError] = useState<ZodIssue[] | string>("");

  useEffect(() => {
    setError(actionData?.error);
  }, [actionData]);

  // Updates the form data when an input changes
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData((form) => ({ ...form, [field]: event.target.value }));
  };

  return (
    <div className="h-full justify-center items-center flex flex-col gap-y-5">
      <Form method="POST" className="rounded-2xl bg-white p-6 w-96">
        <h2 className="text-3xl font-extrabold text-black-600 mb-5">
          {error?.length > 0 && typeof error !== "string" ? (
            error?.map((er: ZodIssue, i: number) => (
              <p key={i} className="text-sm text-red-600">
                - {er.message}
              </p>
            ))
          ) : (
            <p className="text-sm text-red-600">{error as string}</p>
          )}
          Create an account
        </h2>
        <InputField
          htmlFor="name"
          type="name"
          label="Name"
          onFocus={() => setError("")}
          value={formData.name}
          onChange={(e) => handleInputChange(e, "name")}
        />
        <InputField
          htmlFor="email"
          label="Email"
          value={formData.email}
          onChange={(e) => handleInputChange(e, "email")}
        />
        <InputField
          htmlFor="password"
          type="password"
          label="Password"
          value={formData.password}
          onChange={(e) => handleInputChange(e, "password")}
        />
        <div className="w-full text-center mt-5">
          <button
            type="submit"
            name="_action"
            value="SignUp"
            className="w-full rounded-xl mt-2 bg-red-500 px-3 py-2 text-white font-semibold transition duration-300 ease-in-out hover:bg-red-600"
          >
            Create an account
          </button>
        </div>
      </Form>
      <p className="text-gray-600">
        Already have an account?
        <Link to="/login">
          <span className="text-red-600 px-2 underline">Sign In</span>
        </Link>
      </p>
    </div>
  );
}
