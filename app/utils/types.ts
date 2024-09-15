import { Category } from "@prisma/client";

// type postedBy = Pick<User, "id" | "name">;

export type RegisterForm = {
  email: string;
  password: string;
  name: string;
};
export interface TaskData {
  message: string;
  category: Category;
  taskId?: string;
  userId?: string;
}

export const categories = [
  { name: "Others", value: "OTHERS" },
  { name: "Office", value: "OFFICE" },
  { name: "Home", value: "HOME" },
] as const;

// export type Category = (typeof categories)[number]["value"];
