// External deps
import React, { FC } from "react";

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
  return (
    <div className={className}>
      <AddFriendFormCard onAddFriend={addFriend} isConnected={isConnected} contactsError={contactsError} users={users} />
    </div>
  );
};
export default SendFriendRequestCard;
