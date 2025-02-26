// External deps
import React, { FC, ReactElement, useState, ChangeEvent } from "react";

// Internal deps
import StyledInput from "@/components/ui/styledInput/StyledInput";
import ActionButton from "@/components/ui/buttons/ActionButton";

type createSpaceFormProps = {
  onClick: (value: string) => void;
  isDisabled?: boolean;
};

const CreateSpaceForm: FC<createSpaceFormProps> = (props): ReactElement => {
  const { onClick, isDisabled } = props;
  const [name, setName] = useState("");

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setName(event.target.value);
  };
  const handleClick = (): void => {
    onClick(name);
  };

  return (
    <>
      <StyledInput value={name} onChange={handleInputChange} disabled={isDisabled} />
      <ActionButton isDisabled={isDisabled} text={"Create"} onClick={handleClick} className={"mt-2"} />
    </>
  );
};

export default CreateSpaceForm;
