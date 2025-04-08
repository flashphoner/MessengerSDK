// External deps
import React, { FC } from 'react';
import classNames from "classnames";
import { FaCheck } from "react-icons/fa";
import useCopyToClipboard from '@/hooks/helpers/useCopyToClipBoard';
import CopyIcon from '@/assets/icons/copy.svg';

type CopyButtonProps = {
  text: string;
  isDisabled?: boolean;
  className?: string;
};
const CopyButton: FC<CopyButtonProps> = ({
  className,
  text,
  isDisabled = false,
}) => {
  const [copyToClipboard, isCopied] = useCopyToClipboard();

  const handleCopyClick = () => {
    copyToClipboard(text);
  };

  // styles
  const buttonClasses = classNames(
    "rounded-md transition-colors duration-300 p-1",
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
      {isCopied ? <FaCheck size={16} color={"#758F93"}  /> : <img src={CopyIcon} width={'24px'} height={'24px'} alt="i" />}
    </button>
  );
};

export default CopyButton;
