// External deps
import React, { FC } from "react";

// Internal deps
import UsersList, { UserInvite } from "@/components/ui/lists/UsersList";
import { usersListType } from "@/types/Client";
import Card from '@/components/ui/cards/Card';

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

  return (
    <Card className={className} title="Pending Requests">
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
    </Card>
  );
};
export default PendingRequestsCard;
