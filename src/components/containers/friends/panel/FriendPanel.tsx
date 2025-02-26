// External deps
import React, {
  forwardRef,
  useEffect,
} from 'react';
import classNames from "classnames";

// Internal deps
import { useSDK } from "@/hooks/sdk/useSDK";
import ConnectionCard from "@/components/ui/cards/ConnectionCard";
import SendFriendRequestCard from "./SendFriendRequestCard";
import PendingRequestsCard from "./PendingRequestsCard";
import FriendListCard from "./FriendListCard";
import { ExamplePagePanelTypes, ExamplePanelHandlers } from '@/types/Client';
import useConnectWithCredentials from '@/hooks/panels/useConnectWithCredentials';

const FriendPanel = forwardRef<ExamplePanelHandlers, ExamplePagePanelTypes>((props, ref) => {
  const {
    colorName,
    userCredentials,
    updateSharedToken,
    sharedToken,
    serverUrl,
  } = props;

  const {

    // init
    initializeSdk,
    sdkInitialized,

    // connect
    isConnecting,
    connect,
    isConnected,
    disconnect,
    authToken,

    // contacts
    addFriend,
    incomingList,
    outGoingList,
    contacts,
    acceptFriendRequest,
    rejectIncomingFriendInvite,
    handleRemoveFriend,
    handleGetContacts,
    revokeOutGoingFriendRequest,
    contactsError,

    // presence
    ownStatus

  } = useSDK();

  // getting contacts
  useEffect(() => {
    (async () => {
      await handleGetContacts();
    })();
  }, [isConnected]);

  const { connectWithCredentials } = useConnectWithCredentials({
    initializeSdk,
    sdkInitialized,
    credentials: { userCredentials, sharedToken, authToken },
    connect,
    serverUrl,
  });

  useEffect(() => {
    if (authToken && updateSharedToken) {
      updateSharedToken(authToken);
    }
  }, [authToken]);

  // styles
  const cardClasses = classNames(
    "card p-2 border rounded-md transition-colors duration-300 mb-4",
    colorName,
  );
  return (
    <div className="friend-panel-example">
      {userCredentials && (
        <div>
          <ConnectionCard
            className={cardClasses}
            connect={connectWithCredentials}
            disconnect={disconnect}
            isConnected={isConnected}
            isConnecting={isConnecting}
            userName={userCredentials.username}
            ownStatus={ownStatus}
            isCopy={true}
          />
          <SendFriendRequestCard
            className={cardClasses}
            addFriend={addFriend}
            isConnected={isConnected}
            contactsError={contactsError}
            users={contacts.filter(
              (item) =>
                item.friend && item.userId !== userCredentials.username,
            )}
          />
          <PendingRequestsCard
            className={cardClasses}
            incomingList={incomingList.filter(
              (inComingUser) =>
                inComingUser.userId !== userCredentials.username,
            )}
            outGoingList={outGoingList.filter(
              (outGoingUser) =>
                outGoingUser.userId !== userCredentials.username,
            )}
            rejectIncomingFriendInvite={rejectIncomingFriendInvite}
            revokeOutGoingFriendRequest={revokeOutGoingFriendRequest}
            acceptFriendRequest={acceptFriendRequest}
          />
          <FriendListCard
            isDisabled={!isConnected}
            className={cardClasses}
            users={contacts.filter(
              (item) =>
                item.friend && item.userId !== userCredentials.username,
            )}
            removeFriend={handleRemoveFriend}
            onReject={handleRemoveFriend}
            getContacts={handleGetContacts}
          />
        </div>
      )}
    </div>
  );
});
FriendPanel.displayName = "FriendPanel";
export default FriendPanel;
