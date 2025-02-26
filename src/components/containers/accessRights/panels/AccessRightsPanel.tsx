// External deps
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";

// Internal deps
import { ExamplePagePanelTypes, ExamplePanelHandlers, usersListType } from '@/types/Client';
import { useSDK } from "@/hooks/sdk/useSDK";
import ConnectionCard from "@/components/ui/cards/ConnectionCard";
import CreateSpaceForm from "@/components/ui/forms/CreateSpaceForm";
import JoinToSpaceForm from "@/components/ui/forms/JoinToSpaceForm";
import ActionButton from "@/components/ui/buttons/ActionButton";
import CopyButton from "@/components/ui/buttons/CopyButton";
import UsersList from "@/components/ui/lists/UsersList";
import AccordionContent from "@/components/ui/accordion/AccordionContent";
import Card from "@/components/ui/cards/Card";
import useConnectWithCredentials from '@/hooks/panels/useConnectWithCredentials';
import { FaLock } from 'react-icons/fa';
import { FaUsers } from 'react-icons/fa6';

const AccessRightsPanel = forwardRef<ExamplePanelHandlers, ExamplePagePanelTypes>((props, ref) => {
  const {  colorName, userCredentials, users, sharedToken, updateSharedToken, serverUrl } = props;

  const {

    // init
    initializeSdk,
    sdkInitialized,

    // connect
    isConnecting,
    authToken,
    connect,
    disconnect,
    isConnected,

    // presence
    ownStatus,

    // contacts
    contacts,
    handleGetContacts,

    // space
    createSpace,
    singleSpace,
    inviteToSpace,
    joinToSpace,
    singleSpaceInviteCode,
    leaveSpace,
    getUserSpaces,
    deleteSpace,

    // chat
    updateSpaceChannel,

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

  const [isChannelPrivate, setIsChannelPrivate] = useState<boolean>(singleSpace?.channels[0]?.private || false);

  const handleToggleSpaceChannel = async () => {
    const newIsPrivate = !isChannelPrivate;
    const spaceId = singleSpace?.id;
    const channel = singleSpace?.channels[0];
    const channelUsers = users
      .filter((user) => user.username !== userCredentials.username)
      .map((user) => user.username);

    const members = !newIsPrivate && channelUsers[0] ? [channelUsers[0]] : [];

    if (singleSpace && channel && spaceId) {
      await updateSpaceChannel({
        spaceId: spaceId,
        channelId: channel.id,
        name: channel.name,
        isPrivate: newIsPrivate,
        members: members,
      });

      await getUserSpaces();

      setIsChannelPrivate(newIsPrivate);
    }
  };


  useEffect(() => {
    if (authToken && updateSharedToken) {
      updateSharedToken(authToken);
    }
  }, [authToken]);

  // load chats prepare the state
  useEffect(() => {
    (async () => {
      if (isConnected) {
        await getUserSpaces();
        await handleGetContacts();
      }
    })();
  }, [isConnected]);

  return (
    <div>
      <ConnectionCard
        className={colorName}
        connect={connectWithCredentials}
        disconnect={disconnect}
        isConnected={isConnected}
        userName={userCredentials.username}
        ownStatus={ownStatus}
        isConnecting={isConnecting}
        isCopy={true}
      />
      <Card className={colorName}>
        <AccordionContent
          title={users && !!users.length &&
          userCredentials?.username !== users[0]?.username
            ? 'Join to space'
            : 'Create space'
          }
        >
          {
            isConnected && (
              <>
                {userCredentials && !!users.length && userCredentials.username === users[0]?.username && (
                  <div>
                    <CreateSpaceForm isDisabled={!isConnected || Boolean(singleSpace)} onClick={createSpace} />
                  </div>
                )}
                {userCredentials && !!users.length && userCredentials.username === users[1]?.username && (
                  <div>
                    <JoinToSpaceForm isDisabled={!isConnected || Boolean(singleSpace)} onClick={joinToSpace} />
                  </div>
                )}
              </>
            )
          }
        </AccordionContent>
      </Card>

      <Card className={colorName}>
        <AccordionContent title={"Space"}>
          <div>
            {isConnected && singleSpace && (
              <>
                <p className="mt-1 mb-1">{singleSpace.name}</p>
                {
                  userCredentials.username !== users[0]?.username ?
                    <ActionButton isDisabled={!isConnected || !singleSpace} onClick={() => leaveSpace(singleSpace.id)}>
                      Leave
                    </ActionButton> :
                    <ActionButton isDisabled={!isConnected || !singleSpace} onClick={() => deleteSpace(singleSpace.id)}>
                      Delete
                    </ActionButton>
                }
              </>
            )}
          </div>
        </AccordionContent>
      </Card>
      {singleSpace &&
        userCredentials?.username === users[0]?.username && (
          <Card className={colorName}>
            <AccordionContent title={'Invite code'}>
              {(
                <ActionButton isDisabled={!isConnected || Boolean(singleSpaceInviteCode)} onClick={() => inviteToSpace(singleSpace.id)}>
                  Generate space invite
                </ActionButton>
              )}
              {(singleSpaceInviteCode && (
                <div className="flex items-start mt-2">
                  <p className="mr-2">{singleSpaceInviteCode}</p>
                  <CopyButton text={singleSpaceInviteCode} />
                </div>
              ))}
            </AccordionContent>
          </Card>
        )}
      <Card className={colorName}>
        <AccordionContent title={'Categories'}>
          <div>
            {singleSpace && isConnected && <p className="text-xs">name: {singleSpace?.categories[0]?.name}</p>}
          </div>
        </AccordionContent>
      </Card>
      { <Card className={colorName}>
        <AccordionContent title={'Channels'}>
          <>
          {isConnected && singleSpace && !!singleSpace.channels.length && (
            <div>
              { singleSpace?.channels[0]?.private ? (
                <div className="flex">
                  <span className="text-xs mr-2">private:</span>
                  <FaLock />
                </div>
              ) : (
                <div className="flex justify-items-center">
                  <span className="text-xs mr-2">public:</span>
                  <FaUsers />
                </div>
              )}
              {<p className="text-xs">name: {singleSpace?.channels[0]?.name}</p>}

              {userCredentials.username === users[0]?.username && (
                <ActionButton
                  isDisabled={!isConnected}
                  className={'mr-2'}
                  text={isChannelPrivate ? 'Make Public' : 'Make Private'}
                  onClick={handleToggleSpaceChannel}
                />
              )}
            </div>
          )}
          </>
        </AccordionContent>
      </Card>}
      <Card className={`${colorName}`}>
        <p className="card-title mb-2 font-bold">Contacts</p>
        {isConnected && (
          <UsersList
            users={contacts.filter(
              (item) => item.userId !== userCredentials.username
            )}
            listType={usersListType.Contacts}
          />
        )}
      </Card>
    </div>
  );
});
AccessRightsPanel.displayName = "AccessRightsPanel";
export default AccessRightsPanel;
