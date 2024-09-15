// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { ChangeEvent } from "react";

interface FormFieldProps {
  htmlFor: string;
  label: string;
  type?: string;
  value: string;
  // onChange?: React.MouseEventHandler<HTMLButtonElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.ChangeEventHandler<HTMLInputElement>;
  onFocus?: React.ChangeEventHandler<HTMLInputElement>;
}

export function InputField({
  htmlFor,
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  onFocus,
}: FormFieldProps) {
  return (
    <>
      <label htmlFor={htmlFor} className="text-gray-600 font-semibold">
        {label}
      </label>
      <input
        onChange={onChange ? onChange : () => console.log("no handler")}
        onBlur={onBlur ? onBlur : () => {}}
        onFocus={onFocus ? onFocus : () => {}}
        type={type}
        id={htmlFor}
        name={htmlFor}
        className="w-full p-2 rounded-xl my-2 border border-gray-300"
        value={value}
      />
    </>
  );
}
