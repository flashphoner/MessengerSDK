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

  return (
    <div>
      <StyledInput value={inviteCode} onChange={handleInputChange} disabled={isDisabled} />
      <ActionButton  isDisabled={isDisabled} onClick={handleClick} text={"Join"} className={"mt-2"} />
    </div>
  );
};

export default JoinToSpaceForm;
