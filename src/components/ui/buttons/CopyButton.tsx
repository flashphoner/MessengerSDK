// External deps
import React, { FC } from 'react';
import classNames from "classnames";
import { FaCheck, FaCopy } from "react-icons/fa";
import useCopyToClipboard from '@/hooks/helpers/useCopyToClipBoard';

type CopyButtonProps = {
  text: string;
  isDisabled?: boolean;
  className?: string;
};
const CopyButton: FC<CopyButtonProps> = ({
  text,
  isDisabled = false,
  className,
}) => {
  const [copyToClipboard, isCopied] = useCopyToClipboard();

  const handleCopyClick = () => {
    copyToClipboard(text);
  };

  // styles
  const buttonClasses = classNames(
    "border border-black rounded-md transition-colors duration-300 hover:bg-white p-1",
    {
      "opacity-50 cursor-not-allowed": isDisabled,
      className,
    },
  );

  return (
    <button
      onClick={handleCopyClick}
      className={buttonClasses}
      disabled={isDisabled}
    >
      {isCopied ? <FaCheck size={14} /> : <FaCopy size={14} />}
    </button>
  );
};

export default CopyButton;
