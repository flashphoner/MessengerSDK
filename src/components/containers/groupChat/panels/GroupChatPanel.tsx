// External deps
import React, { forwardRef, useEffect, useImperativeHandle } from "react";

// Internal deps
import { ExamplePagePanelTypes, usersListType } from '@/types/Client';
import { useSDK } from "@/hooks/sdk/useSDK";
import ConnectionCard from "@/components/ui/cards/ConnectionCard";
import classNames from "classnames";
import UsersList from "@/components/ui/lists/UsersList";
import ActionButton from "@/components/ui/buttons/ActionButton";
import ChatCard from "@/components/containers/oneToOneChat/panels/ChatCard";
import Card from "@/components/ui/cards/Card";
import useConnectWithCredentials from '@/hooks/panels/useConnectWithCredentials';
import useGroupChatPanel from '@/hooks/panels/useGroupChatPanel';


export type UserPanelHandlers = {
  clearData: () => void;
};

const GroupChatPanel = forwardRef<UserPanelHandlers, ExamplePagePanelTypes>(
  (props, ref) => {
    const { userCredentials, colorName, sharedToken, updateSharedToken, users, serverUrl } = props;

    const {

      // init
      initializeSdk,
      sdkInitialized,
      connect,
      isConnecting,
      authToken,
      disconnect,
      isConnected,

      // contacts
      contacts,
      handleGetContacts,
      handleRemoveFriend,

      // presence
      ownStatus,

      // chat
      loadChats,
      userChats,
      handleCreateChat,
      singleChat,
      handleLeaveFromChat,
      handleDeleteChat,

    } = useSDK();


    const { connectWithCredentials } = useConnectWithCredentials({
      initializeSdk,
      sdkInitialized,
      credentials: { userCredentials, sharedToken, authToken },
      connect,
      serverUrl
    });

    const groupUsers: Array<string> = users
      .map((user) => user.username)
      .filter((username): username is string => !!username && username !== userCredentials?.username);

    const { createGroupChat } = useGroupChatPanel({
      isConnected,
      userChats,
      userCredentials,
      users: groupUsers,
      handleCreateChat,
      handleGetContacts,
    });

    useImperativeHandle(ref, () => ({
      async clearData() {
        if (
          userChats &&
          !!Object.entries(userChats).length &&
          singleChat?.owner === userCredentials?.username
        ) {
          await Promise.all(
            Object.entries(userChats).map(async ([key, chatInfo]) => {
              await handleDeleteChat(chatInfo.id);
            }),
          );
        }
      },
    }));

    useEffect(() => {
      if (authToken && updateSharedToken) {
        updateSharedToken(authToken);
      }
    }, [authToken]);

    useEffect(() => {
      (async () => {
        if (isConnected) {
          await loadChats();
          await handleGetContacts();
        }
      })();
    }, [isConnected]);

    // styles
    const cardClasses = classNames(
      colorName,
    );

    return (
      <div className="user-panel">
        <ConnectionCard
          className={cardClasses}
          connect={connectWithCredentials}
          disconnect={disconnect}
          isConnected={isConnected}
          userName={userCredentials?.username}
          ownStatus={ownStatus}
          isConnecting={isConnecting}
        />
        <Card className={cardClasses + ` ${colorName}`} title='Chat'>
          {users && users[0].username === userCredentials?.username && (
            <ActionButton
              isDisabled={!isConnected || Boolean(singleChat)}
              text={"Create Group Chat"}
              onClick={createGroupChat}
              className={"mr-2 text-customColors-textBlue"}
            />
          )}
          {singleChat && (
            <ChatCard name={singleChat?.name} members={singleChat?.members.map((user) => user)} />
          )}
          { userCredentials && users && singleChat && singleChat.owner !== userCredentials.username && (
            <ActionButton
              className='text-customColors-textBlue mt-2'
              isDisabled={!isConnected}
              text={"Leave"}
              onClick={() =>
                handleLeaveFromChat(singleChat?.id, userCredentials.username)
              }
            />
          )}
          {userCredentials &&
            singleChat &&
            singleChat.owner === userCredentials.username && (
              <ActionButton
                className='text-customColors-textBlue mt-2'
                isDisabled={!isConnected}
                text={"Remove"}
                onClick={() => handleDeleteChat(singleChat?.id)}
              />
            )}
        </Card>
        <Card className={cardClasses + ` ${colorName}`} title='Contacts'>
          {isConnected && (
            <UsersList
              users={contacts.filter(
                (item) => item.userId !== userCredentials.username,
              )}
              listType={usersListType.Contacts}
              onReject={handleRemoveFriend}
            />
          )}
        </Card>
      </div>
    );
  },
);
GroupChatPanel.displayName = "GroupChatPanel";
export default GroupChatPanel;
