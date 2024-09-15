import { Form } from "@remix-run/react";
import { HiTrash } from "react-icons/hi2";
import { MdEdit } from "react-icons/md";
import { Category } from "@prisma/client";
export interface TaskListProps {
  category: Category;
  message: string;
  id: string;
  handleEdit?: ({ id, message }: { id: string; message: string }) => void;
}

export function Tasklist({ category, message, id, handleEdit }: TaskListProps) {
  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-md">{message}</p>
          <span className="text-xs bg-green-100 border px-2 py-1 rounded text-green-700">
            {category}
          </span>
        </div>
        <div className="flex gap-5">
          <div>
            <Form method="post">
              <button
                className="button"
                // name="action"
                // type="submit"
                value="edit"
                onClick={() => (handleEdit ? handleEdit({ id, message }) : "")}
              >
                <MdEdit />
              </button>
              <input type="hidden" name="id" value={id} />
            </Form>
          </div>
          <div>
            <Form method="post">
              <button
                className="button"
                name="action"
                type="submit"
                value="delete"
              >
                <HiTrash />
              </button>
              <input type="hidden" name="id" value={id} />
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
