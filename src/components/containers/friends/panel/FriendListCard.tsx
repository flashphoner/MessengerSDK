// External deps
import React, { FC } from "react";

// Internal deps
import { usersListType } from "@/types/Client";
import UsersList, { UserInvite } from "@/components/ui/lists/UsersList";
import Card from '@/components/ui/cards/Card';

type FriendsListCardProps = {
  className?: string;
  users: Array<UserInvite>;
  removeFriend: (userId: string) => void;
  getContacts: () => void;
  onReject: (userId: string) => void;
  isDisabled: boolean;
};

const FriendsListCard: FC<FriendsListCardProps> = (props) => {
  const { className, users, removeFriend } = props;
  return (
    <Card className={className} title="Friends">
      <UsersList
        users={users}
        onReject={removeFriend}
        listType={usersListType.Friends}
      />
    </Card>
  );
};

export default FriendsListCard;
