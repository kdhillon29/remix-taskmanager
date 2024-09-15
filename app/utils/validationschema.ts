import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string({
      required_error: "Username field is required",
    })
    .min(2, "name must be at least 2 characters"),

  email: z
    .string({
      required_error: "Email field is required",
      invalid_type_error: "This field must be in email format",
    })
    .email({ message: "Please enter a valid email" }),
  password: z
    .string({
      required_error: "Password field is required",
    })
    .min(5, "Password must be at least 5 characters"),
});

export const loginSchema = registerSchema.pick({ email: true, password: true });

// export type UserModel = z.infer<typeof userSchema>;
