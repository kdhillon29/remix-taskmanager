import React, { useState } from "react";
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import { useActionData, Link } from "@remix-run/react";

import { authenticator } from "../utils/auth.server";
import { createUser } from "../utils/user.server";
import { InputField } from "../components/InputField";
import { registerSchema } from "../utils/validationschema";
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
  console.log(result.error?.issues);
  if (result.success) {
    try {
      const newUser = await createUser({ email, password, name });
      console.log(`user created ${newUser.email}`);
      //return redirect("/login");
      return await authenticator.authenticate("user-pass", request, {
        successRedirect: "/",
        failureRedirect: "/login",
        throwOnError: true,
        context: { formData: form },
      });
      // return json({ message: "User created successfully!" }, { status: 201 });
    } catch (error) {
      console.log(error);
      if (error instanceof Response) return error;
      if (error instanceof AuthorizationError) {
        // here the error is related to the authentication process
        return json(
          {
            error: " Invalid  credentials or internal server error occurred!",
            form: action,
          },
          { status: 500 }
        );
      }
    }
  } else if (result.error) {
    return json(
      {
        error: result.error?.issues,
        form: action,
      },
      { status: 400 }
    );
  }
  return redirect("/login");
  // return await authenticator.authenticate("user-pass", request, {
  //   successRedirect: "/",
  //   failureRedirect: "/login",
  // });
};

export default function Signup() {
  const actionData = useActionData<typeof action>();
  console.log(actionData?.error);
  const [formData, setFormData] = useState({
    email: actionData?.fields?.email || "",
    password: actionData?.fields?.password || "",
    name: actionData?.fields?.name || "",
    error: actionData?.error || "",
  });
  console.log(formData);

  // Updates the form data when an input changes
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData((form) => ({ ...form, [field]: event.target.value }));
  };

  return (
    <div className="h-full justify-center items-center flex flex-col gap-y-5">
      <form method="POST" className="rounded-2xl bg-white p-6 w-96">
        <h2 className="text-3xl font-extrabold text-black-600 mb-5">
          {formData.error.length > 0 && typeof formData.error !== "string" ? (
            formData.error?.map((er, i) => (
              <p key={i} className="text-sm text-red-600">
                - {er.message}
              </p>
            ))
          ) : (
            <p className="text-sm text-red-600">{formData.error}</p>
          )}
          Create an account
        </h2>
        <InputField
          htmlFor="name"
          type="name"
          label="Name"
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
            value="Sign In"
            className="w-full rounded-xl mt-2 bg-red-500 px-3 py-2 text-white font-semibold transition duration-300 ease-in-out hover:bg-red-600"
          >
            Create an account
          </button>
        </div>
      </form>
      <p className="text-gray-600">
        Already have an account?
        <Link to="/login">
          <span className="text-red-600 px-2 underline">Sign In</span>
        </Link>
      </p>
    </div>
  );
}
