import React, { useState } from "react";
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useActionData, Link, useNavigation } from "@remix-run/react";

import { authenticator } from "../utils/auth.server";

import { InputField } from "../components/InputField";
import { loginSchema } from "../utils/validationschema";
import { ZodIssue } from "zod";
import { useDebounce } from "use-debounce";

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
  await authenticator.authenticate("user-pass", request, {
    successRedirect: "/",
    failureRedirect: "/login",
  });
};

export default function Login() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  console.log(navigation.state);

  const [formData, setFormData] = useState({
    email: actionData?.fields?.email || "",
    password: actionData?.fields?.password || "",
  });
  const [error, setError] = useState<ZodIssue[]>();
  const [isValid, setIsValid] = useState(false);
  const [value] = useDebounce(formData, 3000);

  const validate = (
    event?: React.ChangeEvent<HTMLInputElement>,
    field?: string
  ) => {
    setError([]);
    field = !field ? "" : field;

    const userData = { ...value, [field]: event?.target.value };
    const result = loginSchema.safeParse(userData);
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
    setFormData((form) => ({ ...form, [field]: event.target.value }));

    console.log(formData);
  };

  return (
    <div className="h-full  py-10 items-center flex flex-col gap-y-5">
      <form method="POST" className="rounded-2xl bg-white p-6 w-96">
        <h2 className="text-3xl font-extrabold text-black-600 mb-5">Login</h2>
        {error &&
          error.length > 0 &&
          error.map((er, i) => (
            <p key={i} className="text-sm font-bold text-red-600">
              *{er?.message}
            </p>
          ))}
        <InputField
          htmlFor="email"
          label="Email"
          value={formData.email}
          onChange={(e) => handleInputChange(e, "email")}
          onBlur={(e) => validate(e, "email")}
        />

        <InputField
          htmlFor="password"
          type="password"
          label="Password"
          value={formData.password}
          onChange={(e) => handleInputChange(e, "password")}
          onBlur={(e) => validate(e, "password")}
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
      </form>
      <p className="text-gray-600">
        Dont have an account?
        <Link to="/signup">
          <span className="text-red-600 px-2 underline">Signup</span>
        </Link>
      </p>
    </div>
  );
}
