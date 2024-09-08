import { User } from "@prisma/client";

export type RegisterForm = {
  email: string;
  password: string;
  name: string;
};
export interface TaskData {
  message: string;
  category: Category;
  taskId: string;
  postedBy?: User | null;
}

export const categories = [
  { name: "Others", value: "OTHERS" },
  { name: "Office", value: "OFFICE" },
  { name: "Home", value: "HOME" },
] as const;

export type Category = (typeof categories)[number]["value"];
