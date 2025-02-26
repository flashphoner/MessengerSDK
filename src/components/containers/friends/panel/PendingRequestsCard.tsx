// External deps
import React, { FC } from "react";
import classNames from "classnames";

// Internal deps
import UsersList, { UserInvite } from "@/components/ui/lists/UsersList";
import { usersListType } from "@/types/Client";

type PendingRequestsCardProps = {
  className?: string;
  incomingList: Array<UserInvite>;
  outGoingList: Array<UserInvite>;
  acceptFriendRequest: (inviteId: string) => void;
  rejectIncomingFriendInvite: (inviteId: string) => void;
  revokeOutGoingFriendRequest: (inviteId: string) => void;
};

const PendingRequestsCard: FC<PendingRequestsCardProps> = (props) => {
  const {
    className,
    incomingList,
    outGoingList,
    acceptFriendRequest,
    rejectIncomingFriendInvite,
    revokeOutGoingFriendRequest,
  } = props;

  // styles
  const cardTitleClasses = classNames("font-bold text-lg");

  return (
    <div className={className}>
      <p className={cardTitleClasses}>Pending Requests</p>
      <div className="asd"></div>
      <UsersList
        users={incomingList}
        onAccept={acceptFriendRequest}
        onReject={rejectIncomingFriendInvite}
        listType={usersListType.Incoming}
      />
      <UsersList
        users={outGoingList}
        onReject={revokeOutGoingFriendRequest}
        listType={usersListType.Outgoing}
      />
    </div>
  );
};
export default PendingRequestsCard;
