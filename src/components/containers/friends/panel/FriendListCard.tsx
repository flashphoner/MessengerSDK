// External deps
import React, { FC } from "react";
import classNames from "classnames";

// Internal deps
import { usersListType } from "@/types/Client";
import UsersList, { UserInvite } from "@/components/ui/lists/UsersList";
import ActionButton from "@/components/ui/buttons/ActionButton";

type FriendsListCardProps = {
  className?: string;
  users: Array<UserInvite>;
  removeFriend: (userId: string) => void;
  getContacts: () => void;
  onReject: (userId: string) => void;
  isDisabled: boolean;
};

const FriendsListCard: FC<FriendsListCardProps> = (props) => {
  const { className, users, removeFriend, getContacts, isDisabled } = props;
  const cardTitleClasses = classNames("font-bold text-lg");
  return (
    <div className={className}>
      <p className={cardTitleClasses}>Friends</p>
      <ActionButton
        text={"Refresh list"}
        onClick={getContacts}
        className={"mb-2"}
        isDisabled={isDisabled}
      />
      <UsersList
        users={users}
        onReject={removeFriend}
        listType={usersListType.Friends}
      />
    </div>
  );
};

export default FriendsListCard;
