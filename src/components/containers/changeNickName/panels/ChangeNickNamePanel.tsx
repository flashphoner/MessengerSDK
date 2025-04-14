// External deps
import React, { ChangeEvent, forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import classNames from 'classnames';

// Internal deps
import { ExamplePagePanelTypes, ExamplePanelHandlers, usersListType } from '@/types/Client';
import ConnectionCard from '@/components/ui/cards/ConnectionCard';
import UsersList from '@/components/ui/lists/UsersList';
import ActionButton from '@/components/ui/buttons/ActionButton';
import ChatCard from '@/components/containers/oneToOneChat/panels/ChatCard';
import { useSDK } from '@/hooks/sdk/useSDK';
import Card from '@/components/ui/cards/Card';
import useConnectWithCredentials from '@/hooks/panels/useConnectWithCredentials';
import { ChatType } from '@flashphoner/sfusdk/dist/sdk/constants';
import StyledInput from '@/components/ui/styledInput/StyledInput';

const ChangeNickNamePanel = forwardRef<ExamplePanelHandlers, ExamplePagePanelTypes>((props, ref) => {
  const { userCredentials, colorName, users, sharedToken, serverUrl, updateSharedToken } = props;
  const {

    // init
    initializeSdk,
    sdkInitialized,

    // connect
    connect,
    disconnect,
    isConnected,
    authToken,
    isConnecting,

    // contacts
    contacts,
    handleRemoveFriend,
    handleCreateChat,
    handleGetContacts,

    // presence
    ownStatus,

    // chat
    loadChats,
    singleChat,

    // nickname
    handleChangeNickName,

  } = useSDK();

  const [nickNameValue, setNickNameValue] = useState<string>('');

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

  const handleCreateGroupChat = async (): Promise<void> => {
    if (users) {
      const chatUsers = users.filter((user) => user.username !== userCredentials?.username)[0].username;
      if (chatUsers && !!chatUsers.length) {
        await handleCreateChat({
          type: ChatType.PRIVATE,
          channel: false,
          members: [chatUsers],
        });
      }
    }
  };

  const handleChangeUserNickname = async (): Promise<void> => {
    if (nickNameValue) {
      await handleChangeNickName(nickNameValue);
      setNickNameValue('');
    }
  };
  const handleUpdateNickname = (event: ChangeEvent<HTMLInputElement>) => {
    setNickNameValue(event.target.value);
  };

  // load chats prepare the state
  useEffect(() => {
    (async () => {
      if (isConnected) {
        await loadChats();
        await handleGetContacts();
      }
    })();
  }, [isConnected]);

  useEffect((): void => {
    if (authToken && updateSharedToken) {
      updateSharedToken(authToken);
    }
  }, [authToken]);

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
      <Card className={colorName} title='Chat'>
        {users[0].username === userCredentials.username && (
          <ActionButton
            isDisabled={!isConnected || Boolean(singleChat?.id)}
            text={"Create chat"}
            onClick={handleCreateGroupChat}
            className={"mr-2 text-customColors-textBlue"}
          />
        )}
        {singleChat && (
          <ChatCard name={singleChat?.name} members={singleChat?.members} />
        )}
      </Card>
      <Card className={colorName} title='Change nick name'>
        <div className="flex items-center">
          <StyledInput
            value={nickNameValue}
            onChange={handleUpdateNickname}
            placeholder={"Enter nickname"}
            disabled={Boolean(!singleChat?.id)}
            className={'className="w-[172px] h-[40px] border border-customColors-lightBorderGray px-2 text-xs focus:outline-none focus:border-black transition-colors duration-300 placeholder:text-xs text-customColors-placeholderLightGreen"'}
          />
          <ActionButton
            isDisabled={!singleChat?.id || nickNameValue.trim().length === 0}
            onClick={handleChangeUserNickname}
            text={"Save"}
            className={"w-full h-[40px] rounded-r-[12px] rounded-l-[0] px-6 py-2 text-base transition duration-300 bg-customColors-textBlue border-0 text-white"}
          />
        </div>
      </Card>
      <Card className={colorName} title='Contacts'>
        {isConnected && (
          <UsersList
            users={contacts.filter(
              (item) => item.userId !== userCredentials?.username,
            )}
            listType={usersListType.Contacts}
            onReject={handleRemoveFriend}
          />
        )}
      </Card>
    </div>
  );
});
ChangeNickNamePanel.displayName = "ChangeNickNamePanel";
export default ChangeNickNamePanel;
