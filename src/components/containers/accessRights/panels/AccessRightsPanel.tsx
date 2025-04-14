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
import Toggle from '@/components/ui/toggle/Toggle';

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
    if (userCredentials.username !== users[0]?.username) {
      return;
    }
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

  const isPrivate = Boolean(singleSpace?.channels[0]?.private);

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
                  <CreateSpaceForm isDisabled={!isConnected || Boolean(singleSpace)} onClick={createSpace} />
                )}
                {userCredentials && !!users.length && userCredentials.username === users[1]?.username && (
                  <JoinToSpaceForm isDisabled={!isConnected || Boolean(singleSpace)} onClick={joinToSpace} />
                )}
              </>
            )
          }
        </AccordionContent>
      </Card>

      <Card className={colorName}>
        <AccordionContent title={"Space"}>
          <div className="w-full">
            {isConnected && singleSpace && (
              <div className="flex justify-between w-full">
                <p className="mt-1 mb-1">{singleSpace.name}</p>
                {
                  userCredentials.username !== users[0]?.username ?
                    <ActionButton
                      isDisabled={!isConnected || !singleSpace}
                      onClick={() => leaveSpace(singleSpace.id)}
                      className="border-0 text-customColors-textBlue"
                    >
                      Leave
                    </ActionButton> :
                    <ActionButton
                      isDisabled={!isConnected || !singleSpace}
                      onClick={() => deleteSpace(singleSpace.id)}
                      className="border-0 text-customColors-textBlue"
                    >
                      Delete
                    </ActionButton>
                }
              </div>
            )}
          </div>
        </AccordionContent>
      </Card>
      {singleSpace &&
        userCredentials?.username === users[0]?.username && (
          <Card className={colorName}>
            <AccordionContent title={'Invite code'}>
              <div className="flex items-between w-full items-center">
                {(singleSpaceInviteCode && (
                  <div className="flex items-center mt-2 w-full">
                    <p className="mr-2">{singleSpaceInviteCode}</p>
                    <CopyButton text={singleSpaceInviteCode} />
                  </div>
                ))}
                {(
                  <ActionButton isDisabled={!isConnected || Boolean(singleSpaceInviteCode)} onClick={() => inviteToSpace(singleSpace.id)} className="border-0 text-customColors-textBlue">
                    Generate
                  </ActionButton>
                )}
              </div>
            </AccordionContent>
          </Card>
        )}
      <Card className={colorName}>
        <AccordionContent title={'Categories'}>
          <div>
            {singleSpace && isConnected && <p className="text-md text-customColors-textGray">{singleSpace?.categories[0]?.name}</p>}
          </div>
        </AccordionContent>
      </Card>
      { <Card className={colorName}>
        <AccordionContent title={'Channels'}>
          <>
          {isConnected && singleSpace && !!singleSpace.channels.length && (
            <div className="flex justify-between  mt-2 w-full">
              {<p className="text-md text-customColors-textGray">{singleSpace?.channels[0]?.name}</p>}

              <Toggle
                className={'flex-row-reverse'}
                label={isPrivate ? 'Private': 'Public'}
                enabled={isPrivate}
                onToggle={handleToggleSpaceChannel}
              />
            </div>
          )}
          </>
        </AccordionContent>
      </Card>}
      <Card className={`${colorName}`} title={'Contacts'}>
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
