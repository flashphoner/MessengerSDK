// External deps
import React, { FC, ReactElement, useState, ChangeEvent } from "react";

// Internal deps
import StyledInput from "@/components/ui/styledInput/StyledInput";
import ActionButton from "@/components/ui/buttons/ActionButton";

type JoinToSpaceFormProps = {
  onClick: (inviteCode: string) => void;
  isDisabled: boolean;
};

const JoinToSpaceForm: FC<JoinToSpaceFormProps> = (props): ReactElement => {
  const { onClick, isDisabled } = props;
  const [inviteCode, setInviteCode] = useState("");

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setInviteCode(event.target.value);
  };
  const handleClick = (): void => {
    onClick(inviteCode);
    setInviteCode("");
  };

  // Styles
  const inputStyles = 'text-customColors-textGray w-[172px] h-[40px] border border-customColors-lightBorderGray px-2 text-xs focus:outline-none focus:border-black transition-colors duration-300 placeholder:text-xs';
  const actionStyles = 'w-[96px] h-[40px] rounded-r-[12px] rounded-l-[0] px-6 py-2 text-base transition duration-300 bg-customColors-textBlue border-0 text-white';

  return (
    <div className="flex items-center">
      <StyledInput value={inviteCode} onChange={handleInputChange} disabled={isDisabled} placeholder={'Space invite code'} className={inputStyles} />
      <ActionButton isDisabled={isDisabled} onClick={handleClick} text={"Join"} className={actionStyles} />
    </div>
  );
};

export default JoinToSpaceForm;
