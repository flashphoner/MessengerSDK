// External deps
import React, { FC, ReactElement, useState, ChangeEvent } from "react";

type createSpaceFormProps = {
  onClick: (value: string) => void;
};

const InviteUserToChatForm: FC<createSpaceFormProps> = (props): ReactElement => {
  const { onClick } = props;
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
      <input onChange={handleInputChange} />
      <button color="black" onClick={handleClick}>
        Invite
      </button>
    </>
  );
};

export default InviteUserToChatForm;
