// External deps
import React, { FC, ReactElement } from "react";

type ChatCardProps = {
  name?: string;
  members?: Array<string>;
};

const ChatCard: FC<ChatCardProps> = (props): ReactElement => {
  const { name } = props;
  return (
    <div className="chat-card">
      <ul className={"mt-2"}>
        <li className={"text-xs"}>
          <span className={"font-bold text-xs"}>{name}</span>
        </li>
      </ul>
    </div>
  );
};

export default ChatCard;
