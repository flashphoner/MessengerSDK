// External deps
import React, { FC, ReactElement } from "react";
import classNames from "classnames";

// Internal deps
import ActionButton from "@/components/ui/buttons/ActionButton";

type CreateChatCardProps = {
  className?: string;
  onCreateChat: () => void;
};

const CreateChatCard: FC<CreateChatCardProps> = (props): ReactElement => {
  const { className, onCreateChat } = props;
  return (
    <div className={classNames(className)}>
      <div>Create chat</div>
      <input type="text" />
      <ActionButton text={"create"} onClick={onCreateChat} />
    </div>
  );
};

export default CreateChatCard;
