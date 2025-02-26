// External deps
import React, { FC } from "react";
import classNames from "classnames";

// Internal deps
import AddFriendFormCard from "@/components/ui/forms/AddFriendFormCard";
import { UserInvite } from '@/components/ui/lists/UsersList';

type SendFriendRequestCardProps = {
  className?: string;
  addFriend: (userId: string) => void;
  isConnected: boolean;
  contactsError?: string;
  users: Array<UserInvite>;
};

const SendFriendRequestCard: FC<SendFriendRequestCardProps> = (props) => {
  const { className, addFriend, isConnected, contactsError, users } = props;
  const cardTitleClasses = classNames("font-bold text-lg");
  return (
    <div className={className}>
      <p className={cardTitleClasses}>Send a friend request</p>
      <AddFriendFormCard onAddFriend={addFriend} isConnected={isConnected} contactsError={contactsError} users={users} />
    </div>
  );
};
export default SendFriendRequestCard;
