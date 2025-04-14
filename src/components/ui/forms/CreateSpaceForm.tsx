// External deps
import React, { FC, ReactElement, useState, ChangeEvent } from "react";

// Internal deps
import StyledInput from "@/components/ui/styledInput/StyledInput";
import ActionButton from "@/components/ui/buttons/ActionButton";

type CreateSpaceFormProps = {
  onClick: (value: string) => void;
  isDisabled?: boolean;
};

const CreateSpaceForm: FC<CreateSpaceFormProps> = ({ onClick, isDisabled }): ReactElement => {
  const [name, setName] = useState("");

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleClick = (): void => {
    onClick(name);
  };

  return (
    <div className="flex items-center">
      <StyledInput
        value={name}
        onChange={handleInputChange}
        placeholder="Space name"
        disabled={isDisabled}
        className="text-customColors-textGray w-[172px] h-[40px] border border-customColors-lightBorderGray px-2 text-xs focus:outline-none focus:border-black transition-colors duration-300 placeholder:text-xs"
      />
      <ActionButton
        isDisabled={isDisabled}
        text="Create"
        onClick={handleClick}
        className="w-[96px] h-[40px] rounded-r-[12px] rounded-l-[0] px-6 py-2 transition duration-300 bg-customColors-textBlue border-0 text-white"
      />
    </div>
  );
};

export default CreateSpaceForm;
