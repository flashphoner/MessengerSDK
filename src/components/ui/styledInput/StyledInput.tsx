// External deps
import React, {ChangeEvent, KeyboardEvent, FC} from "react";
import classNames from "classnames";

type StyledInputProps = {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
};

const StyledInput: FC<StyledInputProps> = (props) => {
  const {
    value,
    onChange,
    placeholder,
    className,
    onKeyDown,
    disabled
  } = props;

  // styles
  const inputClasses = classNames(
    "w-[172px] h-[40px] border border-gray-300 rounded-l-[12px] px-2 text-xs",
    "focus:outline-none focus:border-black transition-colors duration-300 placeholder:text-xs",
    className,
  );

  return (
    <input
      disabled={disabled}
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={inputClasses}
      onKeyDown={onKeyDown}
    />
  );
};
export default StyledInput;
