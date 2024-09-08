import { prisma } from "./prisma.server";
import { json } from "@remix-run/node";
import { TaskData } from "./types";

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

export const createTask = async ({ category, message, taskId }: TaskData) => {
  const taskById = await prisma.task.create({
    data: { category, message, taskId },
  });
  if (!taskById) {
    return json({ error: "Could not post the task" });
  }
  return json({
    message: "Task created successfully",
    success: "true",
    payload: taskById,
  });
};

export const deleteTask = async (id: string) => {
  const taskById = await prisma.task.delete({ where: { id } });
  if (!taskById) {
    return json({ error: "Could not post the task" });
  }
  return json({
    message: "Task deleted",
    success: "true",
    payload: id,
  });
};
