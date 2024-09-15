import { Authenticator, AuthorizationError } from "remix-auth";
import { sessionStorage } from "./session.server";
import { FormStrategy } from "remix-auth-form";
import { prisma, User } from "./prisma.server";
import bcrypt from "bcryptjs";
import { json } from "@remix-run/node";
import { RegisterForm } from "./types";
import { createUser } from "./user.server";

export async function register(user: RegisterForm) {
  const exists = await prisma.user.count({ where: { email: user.email } });
  if (exists) {
    console.log("user already exists");

    return json(
      { error: `User already exists with that email` },
      { status: 400 }
    );
  }

  const newUser = await createUser(user);
  if (!newUser) {
    return json(
      {
        error: `Something went wrong trying to create a new user.`,
        fields: { email: user.email, password: user.password },
      },
      { status: 400 }
    );
  } else return newUser.id;
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}
// Define the UserType to be used in the authenticator.
// type UserType = Pick<User, "id" | "email" | "name">;
// Create an authenticator with session storage and form strategy.
const authenticator = new Authenticator<User>(sessionStorage);

const formStrategy = new FormStrategy(async ({ form }) => {
  const email = form.get("email") as string;
  const password = form.get("password") as string;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.log("you entered a wrong email");
    throw new AuthorizationError("Invalid email or password");
  }

  const passwordsMatch = await bcrypt.compare(
    password,
    user.password as string
  );

  if (!passwordsMatch) {
    console.log("password does not match");

    throw new AuthorizationError("Invalid email or password");
  }

  return user;
});

// authenticator.use(formStrategy, "form");
authenticator.use(formStrategy, "user-pass");

export { authenticator };
