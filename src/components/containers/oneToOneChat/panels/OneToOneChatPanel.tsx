// External deps
import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { ExamplePagePanelTypes, ExamplePanelHandlers, usersListType } from '@/types/Client';

// Internal deps
import { useSDK } from '@/hooks/sdk/useSDK';
import UsersList from '@/components/ui/lists/UsersList';
import ConnectionCard from '@/components/ui/cards/ConnectionCard';
import ActionButton from '@/components/ui/buttons/ActionButton';
import Card from '@/components/ui/cards/Card';
import ChatCard from '@/components/containers/oneToOneChat/panels/ChatCard';
import useConnectWithCredentials from '@/hooks/panels/useConnectWithCredentials';
import { ChatType } from '@flashphoner/sfusdk/dist/sdk/constants';

const OneToOneChatPanel = forwardRef<ExamplePanelHandlers, ExamplePagePanelTypes>(
  (props, ref) => {
    const { userCredentials, colorName, users, sharedToken, updateSharedToken, serverUrl } = props;
    const {

      // init
      initializeSdk,
      sdkInitialized,

      // connect
      isConnecting,
      isConnected,
      connect,
      disconnect,
      authToken,

      // contacts
      handleGetContacts,
      contacts,
      handleRemoveFriend,

      // status
      ownStatus,

      //chat
      loadChats,
      handleCreateChat,
      singleChat,
      handleDeleteChat,
      handleLeaveFromChat,

    } = useSDK();

    useImperativeHandle(ref, () => ({
      async clearData() {},
    }));

    const { connectWithCredentials } = useConnectWithCredentials({
      initializeSdk,
      sdkInitialized,
      credentials: { userCredentials, sharedToken, authToken },
      connect,
      serverUrl
    });

    const handleCreateDirectChat = async (): Promise<void> => {
      if (users && userCredentials) {
        const chatUsers = users.filter((user) => user.username !== userCredentials.username)[0].username;
        if (chatUsers && !!chatUsers.length) {
          await handleCreateChat({
            type: ChatType.PRIVATE,
            channel: false,
            members: [chatUsers],
          });
        }
      }
    };

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

    return (
      <div className="user-panel">
        <ConnectionCard
          className={colorName}
          connect={connectWithCredentials}
          disconnect={disconnect}
          isConnected={isConnected}
          userName={userCredentials?.username}
          ownStatus={ownStatus}
          isConnecting={isConnecting}
        />
        <Card className={colorName}>
          <p>Chat</p>
          {users && users[1].username !== userCredentials.username && (
            <ActionButton
              isDisabled={!isConnected || Boolean(singleChat?.id)}
              text={"Create Chat"}
              onClick={handleCreateDirectChat}
              className={"mr-2 text-customColors-textBlue mt-2"}
            />
          )}
          {singleChat && (
            <ChatCard name={singleChat?.name} members={singleChat?.members} />
          )}
          {userCredentials && singleChat && singleChat.owner !== userCredentials.username && (
            <ActionButton
              className='text-customColors-textBlue mt-2'
              isDisabled={!isConnected}
              text={"Leave"}
              onClick={() =>
                handleLeaveFromChat(singleChat?.id, userCredentials.username)
              }
            />
          )}
          {userCredentials && singleChat && singleChat.owner === userCredentials.username && (
            <ActionButton
              isDisabled={!isConnected}
              text={"Delete"}
              onClick={() => handleDeleteChat(singleChat?.id)}
            />
          )}
        </Card>
        <Card className={colorName}>
          <p className="card-title mb-2">Contacts</p>
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
OneToOneChatPanel.displayName = "OneToOneChatPanel";
export default OneToOneChatPanel;
