// External deps
import React, { FC } from "react";
import classNames from "classnames";

// Internal deps
import { usersListType } from "@/types/Client";
import ActionButton from "@/components/ui/buttons/ActionButton";

// Local deps
import { AvatarBadge, Status } from "../avatarBadge/AvatarBadge";

export type UserInvite = {
  userId: string;
  nickname?: string;
  inviteId?: string;
  type?: string;
  friend?: boolean;
  status?: Status;
};

type UsersListProps = {
  title?: string;
  users: Array<UserInvite>;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  listType?: string;
};

const UsersList: FC<UsersListProps> = ({
  title,
  users,
  onAccept,
  onReject,
  listType,
}) => {
  const handleAccept = (user: UserInvite) => {
    if (listType === usersListType.Incoming && onAccept && user.inviteId) {
      onAccept(user.inviteId);
    }
  };
  const handleReject = (user: UserInvite) => {
    if (listType === usersListType.Incoming && onReject && user.inviteId) {
      onReject(user.inviteId);
    } else if (
      listType === usersListType.Outgoing &&
      onReject &&
      user.inviteId
    ) {
      onReject(user.inviteId);
    } else if (listType === usersListType.Friends && onReject) {
      onReject(user.userId);
    }
  };
  const cardUserClasses = classNames(
    "flex items-center justify-start relative w-full mb-2",
  );

  return (
    <div>
      {title && <div>{title}</div>}
      {users.map((user) => (
        <div key={user.userId} className="flex items-center w-full">
          <div className={cardUserClasses}>
            <AvatarBadge name={user.userId} status={user.status} size="small" />
            <div className="flex justify-between flex-col leading-4 w-full max-w-xs">
              <p className="align-middle ml-1 text-md truncate first-letter:uppercase text-xs">
                {user?.nickname}
              </p>
            </div>
            {listType !== usersListType.Contacts &&
              listType !== usersListType.Presence && (
                <div className={"flex flex-col"}>
                  {onAccept && (
                    <ActionButton
                      onClick={() => handleAccept(user)}
                      className={"w-5 mr-2 h-5 flex items-center mb-1 text-customColors-textBlue text-xs"}
                    >
                      Add
                    </ActionButton>
                  )}
                  {onReject && (
                    <ActionButton
                      onClick={() => handleReject(user)}
                      className={"mr-2 w-5 h-5 flex items-center text-customColors-textBlue text-xs"}
                    >
                      Reject
                    </ActionButton>
                  )}
                </div>
              )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UsersList;
