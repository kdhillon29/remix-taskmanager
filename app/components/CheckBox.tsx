import { useRef } from "react";

// import { useState } from "react";
type props = {
  label: string;
  handleChange?: (value: boolean) => void;
  isChecked?: boolean; //optional prop to set initial checked state (for edit form)
};

const Checkbox = ({ label, isChecked, handleChange }: props) => {
  //   const [isChecked, setIsChecked] = useState(false);

  const ref = useRef<HTMLButtonElement>(null);
  function handleClick(e: React.ChangeEvent<HTMLInputElement>) {
    ref.current?.click();
    handleChange?.(e.target.checked);
  }

  console.log(isChecked);

  return (
    <div className="w-32 flex gap-2 ">
      <button ref={ref} name="action" type="submit" value="done">
        <input
          className="w-6 h-6 rounded-xl p-2"
          type="checkbox"
          name="completed"
          onChange={(e) => handleClick(e)}
          checked={isChecked}
        />
      </button>
      <span>{label}</span>
    </div>
  );
};
export default Checkbox;
