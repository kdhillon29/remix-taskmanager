// import React from "react";

import { Form } from "@remix-run/react";
import { categories } from "../utils/types";
import { useEffect, useRef, useState } from "react";

type taskProps = {
  id?: string;
  message?: string;
};

export function TaskForm({ id, message }: taskProps) {
  // const [isSubmit, setIsSubmit] = useState(false);
  const [task, setTask] = useState({ id, message });
  // console.log(id, message);
  // console.log(task);

  useEffect(() => {
    setTask({ id, message });
  }, [id, message]);

  // const navigate = useNavigate();
  // const action = useActionData();
  // if (action) {
  //   console.log(action);
  //   navigate(".", { replace: true });
  // }
  const ref = useRef<HTMLTextAreaElement>(null);
  // const revalidator = useRevalidator();
  function resetValue() {
    ref.current!.value = "";
    setTask({ id: "", message: "" });
    // id = "";
    // message = "";

    // revalidator.revalidate();
    // navigate("/login", { replace: true });
  }
  return (
    <div>
      <Form method="post">
        <div className="mb-5">
          <label className="font-semibold mb-2 block" htmlFor="category">
            Category
          </label>

          <select
            name="category"
            id="category"
            className="border-2 w-full rounded-md mr-8 border-gray-600 px-3 py-1 h-9"
            defaultValue={categories[0].name}
          >
            {categories.map((category, index) => {
              return (
                <option key={index} value={category.value}>
                  {category.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="mb-5">
          <label className="font-semibold mb-2 block" htmlFor="task">
            Task
          </label>
          <textarea
            name="message"
            id="message"
            required
            defaultValue={task ? task.message : ""}
            value={task.message}
            onChange={(e) => setTask({ ...task, message: e.target.value })}
            ref={ref}
            className="w-full border-2 rounded-md mr-8 border-gray-600 px-3 py-1"
          />
        </div>
        <div>
          <input type="hidden" name="id" value={task.id} />
          <button
            type="submit"
            name="action"
            onClick={() => setTimeout(() => resetValue(), 500)}
            value={task.id ? "edit" : "new"}
            className="w-full rounded-xl bg-red-500 px-3 py-2 text-white font-semibold transition duration-300 ease-in-out hover:bg-red-600"
          >
            {task.id ? "Edit Task" : "Add task"}
          </button>
        </div>
      </Form>
    </div>
  );
}
