import React, { useEffect, useState } from "react";

import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { useActionData, Link, Form, useNavigation } from "@remix-run/react";

import { authenticator } from "../utils/auth.server";

import { InputField } from "../components/InputField";
import { loginSchema } from "../utils/validationschema";
import { ZodIssue } from "zod";
// import { useDebounce } from "use-debounce";
//add main
import { AuthorizationError } from "remix-auth";

export const meta: MetaFunction = () => {
  return [{ title: "New Remix App login" }];
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });
  // const user = "kanwar";
  return user;
};

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  try {
    await authenticator.authenticate("user-pass", request, {
      successRedirect: "/",
      // failureRedirect: "/login",
      throwOnError: true,
    });
  } catch (error) {
    if (error instanceof Response) return error;
    if (error instanceof AuthorizationError) {
      console.log(error);
      return json({ error: "Invalid credentials" }, { status: 401 });

      // here the error is related to the authentication process
    }
    // here the error is a generic error that another reason may throw
  }
};

export default function Login() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  console.log(navigation.state);

  const [formData, setFormData] = useState({
    email: actionData?.fields?.email || "",
    password: actionData?.fields?.password || "",
  });
  const [error, setError] = useState<ZodIssue[] | string>("");
  const [isValid, setIsValid] = useState(false);

  console.log(error);
  useEffect(() => {
    actionData?.error && setError(actionData?.error);
  }, [actionData]);

  // const [value] = useDebounce(formData, 2000);

  const validate = () => {
    setError([]);

    const result = loginSchema.safeParse(formData);

    console.log(result);

    if (result.error) {
      setError(result.error?.issues);
    } else {
      setError([]);
      setIsValid(true);
    }
    return result.success;
  };

  // Updates the form data when an input changes
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setError("");
    setFormData((form) => ({ ...form, [field]: event.target.value }));
    setTimeout(() => {
      validate();
    }, 2000);
    console.log(formData);
  };

  return (
    <div className="h-full  py-10 items-center flex flex-col gap-y-5">
      <Form method="POST" className="rounded-2xl bg-white p-6 w-96">
        <h2 className="text-3xl font-extrabold text-black-600 mb-5">Login</h2>
        {error?.length > 0 && typeof error !== "string" ? (
          error?.map((er: ZodIssue, i: number) => (
            <p key={i} className="text-sm text-red-600">
              - {er.message}
            </p>
          ))
        ) : (
          <p className="text-sm text-red-600">{error as string}</p>
        )}
        <InputField
          htmlFor="email"
          label="Email"
          value={formData.email}
          onChange={(e) => handleInputChange(e, "email")}
          // onBlur={(e) => validate(e, "email")}
        />

        <InputField
          htmlFor="password"
          type="password"
          label="Password"
          value={formData.password}
          onChange={(e) => handleInputChange(e, "password")}
          // onBlur={(e) => validate(e, "password")}
        />
        <div className="w-full text-center mt-5">
          <button
            type="submit"
            name="_action"
            disabled={!isValid || navigation.state === "submitting"}
            value="Sign In"
            className={`w-full rounded-xl mt-2 ${
              isValid
                ? "bg-red-600 cursor-pointer hover:bg-red-600"
                : "bg-red-200 cursor-not-allowed"
            } px-3 py-2 text-white font-semibold transition duration-300 ease-in-out `}
          >
            {navigation.state === "submitting" ? "Logging In.." : "Login"}
          </button>
        </div>
      </Form>
      <p className="text-gray-600">
        Dont have an account?
        <Link to="/signup">
          <span className="text-red-600 px-2 underline">Signup</span>
        </Link>
      </p>
    </div>
  );
}
