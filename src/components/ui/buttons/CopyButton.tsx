// External deps
import React, { FC } from 'react';
import classNames from "classnames";

// Internal deps
import useCopyToClipboard from '@/hooks/helpers/useCopyToClipBoard';

// Icons
import { FaCheck } from "react-icons/fa";
import CopyIcon from '@/assets/icons/copy.svg';
import Icon from '@/components/ui/icon/Icon';

type CopyButtonProps = {
  text: string;
  isDisabled?: boolean;
  className?: string;
  size?: number
};

const CopyButton: FC<CopyButtonProps> = ({
  className,
  text,
  isDisabled = false,
  size
}) => {
  const [copyToClipboard, isCopied] = useCopyToClipboard();

  const handleCopyClick = () => {
    copyToClipboard(text);
  };

  // styles
  const buttonClasses = classNames(
    "rounded-md transition-colors duration-300",
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
      {isCopied ? <FaCheck size={12} color={"#758F93"}  /> : <Icon src={CopyIcon} size={size} />}
    </button>
  );
};

export default CopyButton;
