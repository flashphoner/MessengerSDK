// External deps
import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import classNames from "classnames";

// Internal deps
import { ExamplePagePanelTypes, usersListType } from '@/types/Client';
import { useSDK } from "@/hooks/sdk/useSDK";
import ConnectionCard from "@/components/ui/cards/ConnectionCard";
import CreateSpaceForm from "@/components/ui/forms/CreateSpaceForm";
import JoinToSpaceForm from "@/components/ui/forms/JoinToSpaceForm";
import { UserPanelHandlers } from "@/components/containers/groupChat/panels/GroupChatPanel";
import ActionButton from "@/components/ui/buttons/ActionButton";
import CopyButton from "@/components/ui/buttons/CopyButton";
import UsersList from "@/components/ui/lists/UsersList";
import Card from "@/components/ui/cards/Card";
import AccordionContent from "@/components/ui/accordion/AccordionContent";
import useConnectWithCredentials from '@/hooks/panels/useConnectWithCredentials';

const SpaceUserPanel = forwardRef<UserPanelHandlers, ExamplePagePanelTypes>(
  (props, ref) => {
    const { userCredentials, updateSharedToken, sharedToken, users, colorName, serverUrl } = props;
    const {

      // init
      initializeSdk,
      sdkInitialized,

      // connect
      authToken,
      connect,
      disconnect,
      isConnected,
      isConnecting,

      // presence
      ownStatus,

      // contacts
      handleGetContacts,
      contacts,

      // space
      createSpace,
      singleSpace,
      inviteToSpace,
      joinToSpace,
      singleSpaceInviteCode,
      leaveSpace,
      getUserSpaces,
      deleteSpace,
      handleReset
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

    useEffect(() => {
      if (authToken && updateSharedToken) {
        updateSharedToken(authToken);
      }
    }, [authToken]);

    useEffect(() => {
      (async () => {
        if (isConnected && sdkInitialized) {
          await getUserSpaces();
          await handleGetContacts();
        } else if (!isConnected) {
          handleReset();
        }
      })();
    }, [isConnected, sdkInitialized]);

    const cardClasses = classNames(
      colorName,
    );

    return (
      <div>
        <ConnectionCard
          className={cardClasses}
          connect={connectWithCredentials}
          disconnect={disconnect}
          isConnected={isConnected}
          userName={userCredentials?.username}
          ownStatus={ownStatus}
          isCopy={false}
          isConnecting={isConnecting}
        />
        <Card className={colorName}>
          <AccordionContent
            title={
              userCredentials && !!users.length && userCredentials.username === users[1]?.username
                ? "Join to space"
                : "Create space"
            }
          > {
            isConnected &&
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
                    <ActionButton className='text-customColors-textBlue' isDisabled={!isConnected || !singleSpace} onClick={() => leaveSpace(singleSpace.id)}>
                      Leave
                    </ActionButton> :
                    <ActionButton className='text-customColors-textBlue' isDisabled={!isConnected || !singleSpace} onClick={() => deleteSpace(singleSpace.id)}>
                      Delete
                    </ActionButton>
                  }
                </>
              )}
            </div>
          </AccordionContent>
        </Card>
        <Card className={colorName}>
          <AccordionContent title={"Categories"}>
            {isConnected && singleSpace && (
              <div>
                <p>name: {singleSpace.categories[0]?.name}</p>
                <p>creator: {singleSpace.categories[0]?.creator}</p>
              </div>
            )}
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
        <Card className={cardClasses + ` ${colorName}`} title='Contacts'>
          {isConnected && (
            <UsersList
              users={contacts.filter(
                (item) => item.userId !== userCredentials.username,
              )}
              listType={usersListType.Contacts}
            />
          )}
        </Card>
      </div>
    );
  },
);
SpaceUserPanel.displayName = "SpaceUserPanel";
export default SpaceUserPanel;
