// External deps
import React, { FC } from 'react';
import classNames from "classnames";

// Internal deps
import useCopyToClipboard from '@/hooks/helpers/useCopyToClipBoard';
import Icon from '@/components/ui/icon/Icon';

// Icons
import CopyIcon from '@/assets/icons/copy.svg';
import Check from '@/assets/icons/chevronRegular.svg';

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
    "rounded-md transition-colors duration-300 flex justify-items-center",
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
      {isCopied ?  <Icon src={Check} size={16} className="mt-1 pl-1" strokeColor="#758F93" /> : <Icon src={CopyIcon} size={size} />}
    </button>
  );
};

export default CopyButton;
