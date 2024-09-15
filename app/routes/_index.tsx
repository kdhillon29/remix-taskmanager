import type {
  LoaderFunction,
  ActionFunction,
  MetaFunction,
} from "@remix-run/node";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  // useActionData,
  Form,
  useLoaderData,
  // useNavigate,
} from "@remix-run/react";
import { authenticator } from "~/utils/auth.server";
import {
  updateTask,
  createTask,
  getMyTasks,
  deleteTask,
  isCompletedTask,
  // getTask,
} from "../utils/tasks.server";
import { TaskForm } from "../components/TaskForm";
import { Tasklist, TaskListProps } from "../components/TaskList";
import { Category } from "@prisma/client";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix taskmanager App" },
    {
      name: "description",
      content:
        "Simple taskmanager app with remix,prisma,mongodb and zod validation!",
    },
  ];
};
//protect the page from unauthenticated users
export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const userTask = await getMyTasks(user.id);
  // console.log(userTask);

  return { user, userTask };
};
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const action = formData.get("action");

  switch (action) {
    case "logout": {
      return await authenticator.logout(request, { redirectTo: "/login" });
    }
    case "new": {
      const Category = formData.get("category") as Category;
      const Message = formData.get("message") as string;
      const user = await authenticator.isAuthenticated(request);
      const userId = user?.id;
      const newTask = await createTask({
        category: Category,
        message: Message,
        userId,
      });
      return newTask;
    }
    case "done": {
      console.log("in completed case");
      console.log(formData);
      const id = formData.get("id") as string;
      const completed = formData.get("completed") as unknown;
      console.log(completed);

      const isCompleted = completed == "on" ? true : false;
      // const user = await authenticator.isAuthenticated(request);
      // const userId = user?.id;
      console.log(id, isCompleted);
      const isDone = await isCompletedTask({
        isCompleted,
        taskId: id,
      });
      return isDone;

      return null;
    }
    case "edit": {
      console.log("in edit case");

      const id = formData.get("id") as string;

      // const id = await getTask(id);
      const Category = formData.get("category") as Category;
      const Message = formData.get("message") as string;
      const user = await authenticator.isAuthenticated(request);
      const userId = user?.id;
      const editTask = await updateTask({
        category: Category,
        message: Message,
        taskId: id,
        userId,
      });
      return editTask;
      // console.log(editTask);

      return editTask;
    }
    case "delete": {
      const id = formData.get("id") as string;
      const deletedTask = await deleteTask(id);
      return deletedTask;
    }
    default:
      return null;
  }
};
export default function Index() {
  const { user, userTask } = useLoaderData<typeof loader>();
  const [editTask, setEditTask] = useState<{ id: string; message: string }>();

  // const actionData = useActionData<typeof action>();
  // const revalidator = useRevalidator();
  // if (!actionData?.error) {
  //   // setEditTask({ id: "", message: "" });
  //   console.log(actionData);
  //   revalidator.revalidate();
  // }

  return (
    <div className="h-full bg-blue-300 pt-10">
      <div className="max-w-lg mx-auto items-left flex flex-col bg-white p-6">
        <div className="d-flex flex-row mb-10">
          <h2 className="text-sm font-normal text-gray-500">
            Welcome {user.name}!
          </h2>
          <div className="flex items-center">
            <h1 className="text-3xl font-bold pe-2">Task tracking app</h1>
            {user ? (
              <Form method="post">
                <button
                  type="submit"
                  name="action"
                  value="logout"
                  className="text-red-500 py-1 border px-3 text-sm rounded-md font-semibold"
                >
                  Logout
                </button>
              </Form>
            ) : null}
          </div>
        </div>
        {/* {!editTask && <TaskformData />} */}
        <TaskForm {...editTask} />
        <br />
        <div className="grid gap-5">
          {userTask.tasks.length ? (
            <>
              {" "}
              {userTask.tasks.map((task: TaskListProps) => {
                return (
                  <Tasklist
                    key={task.id}
                    id={task.id}
                    message={task.message}
                    category={task.category}
                    handleEdit={setEditTask}
                    isCompleted={task.isCompleted}
                  />
                );
              })}
            </>
          ) : (
            "😳 No task"
          )}
        </div>
      </div>
    </div>
  );
}
