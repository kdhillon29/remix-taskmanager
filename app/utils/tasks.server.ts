import { prisma } from "./prisma.server";
import { json } from "@remix-run/node";
import { TaskData } from "./types";
// import { TaskForm } from "~/components/TaskForm";
// import { User } from "@prisma/client";
type CompletedTask = { taskId: string; isCompleted: boolean };

export const getMyTasks = async (userID: string) => {
  if (userID) {
    const taskById = await prisma.user.findUnique({
      where: {
        id: userID,
      },
      include: {
        tasks: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    return taskById;
  }

  if (!userID) {
    return json({ error: `The users doesnot have any tasks` });
  }
};
export const createTask = async ({ category, message, userId }: TaskData) => {
  const taskById = await prisma.task.create({
    data: { category, message, postedBy: { connect: { id: userId } } },
  });
  if (!taskById) {
    return json({ error: "Could not post the task" });
  }
  return json(
    {
      message: "Task created/updated  successfully",
      success: "true",
      payload: taskById,
    },
    { status: 201 }
  );
};
export const isCompletedTask = async ({
  taskId,
  isCompleted,
}: CompletedTask) => {
  const isCompletedTask = await prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      isCompleted,
    },
  });
  return isCompletedTask;
};

export const updateTask = async ({
  category,
  message,

  taskId,
}: TaskData) => {
  console.log(taskId);

  const updateTask = await prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      message,
      category,
    },
  });

  if (!updateTask) {
    return json({ error: "Could not update the task" });
  }
  return json(
    {
      message: "Task updated  successfully",
      success: "true",
      payload: updateTask,
    },
    { status: 200 }
  );
};

export const getTask = async (id: string) => {
  const taskById = await prisma.task.findUnique({
    where: { id },
    include: {
      postedBy: true,
    },
  });
  if (!taskById) {
    return json({ error: "Task not found" }, { status: 404 });
  }
  return json(taskById);
};

export const deleteTask = async (id: string) => {
  const taskById = await prisma.task.delete({ where: { id } });
  if (!taskById) {
    return json({ error: "Could not delete the task" }, { status: 500 });
  }
  return json(
    {
      message: "Task deleted",
      success: "true",
      payload: id,
    },
    { status: 200 }
  );
};
