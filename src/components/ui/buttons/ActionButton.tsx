// External deps
import classNames from "classnames";
import React, { FC, MouseEvent, ReactNode } from "react";

type ButtonProps = {
  className?: string;
  isPrimary?: boolean;
  isDisabled?: boolean;
  text?: string;
  children?: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
};

const ActionButton: FC<ButtonProps> = ({
  className,
  isPrimary,
  isDisabled,
  text,
  onClick,
  children,
}) => {
  const buttonClasses = classNames(
    "px-1 h-5 rounded border border-black text-xs transition-all duration-200 ease-in-out text-black",
    className,
    {
      "bg-white-500 text-black bg-white border-white": isPrimary,
      "opacity-50 cursor-not-allowed": isDisabled,
    },
    !isDisabled && "hover:bg-gray-200 hover:shadow-md",
  );

  return (
    <button className={buttonClasses} disabled={isDisabled} onClick={onClick}>
      {text || children}
    </button>
  );
};

export default ActionButton;
