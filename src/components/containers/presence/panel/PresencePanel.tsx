import React, {
  forwardRef,
  useEffect,
  ChangeEvent,
} from 'react';
import classNames from 'classnames';
import { ExamplePagePanelTypes, usersListType } from '@/types/Client';
import { PresenceStatus } from '@flashphoner/sfusdk/dist/sdk/constants';
import UsersList from '@/components/ui/lists/UsersList';
import ConnectionCard from '@/components/ui/cards/ConnectionCard';
import { useSDK } from '@/hooks/sdk/useSDK';
import Card from '@/components/ui/cards/Card';
import SkeletonLoader from '@/components/ui/skeleton/SkeletonLoader';
import useConnectWithCredentials from '@/hooks/panels/useConnectWithCredentials';

export type UserPanelHandlers = {
  clearData: () => void;
};
const PresencePanel = forwardRef<UserPanelHandlers, ExamplePagePanelTypes>(
  (props, ref) => {
    const {
      colorName,
      userCredentials,
      updateSharedToken,
      sharedToken,
      users,
      serverUrl
    } = props;

    const {

      // init
      initializeSdk,
      sdkInitialized,

      //connect
      connect,
      disconnect,
      isConnected,
      contacts,
      handleRemoveFriend,
      authToken,
      isConnecting,

      // presence
      ownStatus,
      updatePresenceStatus,
      setOwnStatus,

      // contacts
      addFriend,
      handleGetContacts,
      incomingList,
      acceptFriendRequest,

    } = useSDK();

    const { connectWithCredentials } = useConnectWithCredentials({
      initializeSdk,
      sdkInitialized,
      credentials: { userCredentials, sharedToken, authToken },
      connect,
      serverUrl
    });

    const handleChangeStatus = async (
      event: ChangeEvent<HTMLSelectElement>
    ) => {
      setOwnStatus(event.currentTarget.value as PresenceStatus);
      await updatePresenceStatus(event.target.value as PresenceStatus);
    };

    // prepare friends, state
    useEffect(() => {
      (async () => {
        if (isConnected && users) {
          const contactList = await handleGetContacts();
          if (contactList && contactList.length === 1) {
            const friends = contactList.filter((contact) => contact.friend);
            if (!friends.length && userCredentials) {
              users.filter((user ) => user.username !== userCredentials.username).map(async (user) => {
                if (user.username) {
                  await addFriend(user.username);
                }
              });
            }
          }
        }
      })();
    }, [isConnected, userCredentials]);

    useEffect(() => {
      if (incomingList) {
        incomingList.map(async ({ inviteId }) => {
          await acceptFriendRequest(inviteId);
        });
      }
    }, [incomingList]);

    useEffect(() => {
      if (authToken && updateSharedToken) {
        updateSharedToken(authToken);
      }
    }, [authToken]);


    // styles
    const cardClasses = classNames(
      'card p-2 border rounded-md transition-colors duration-300 mb-4',
      colorName
    );

    return (
      <div className="user-panel">
        {userCredentials?.username && (
          <div>
            <ConnectionCard
              className={cardClasses}
              connect={connectWithCredentials}
              disconnect={disconnect}
              isConnected={isConnected}
              userName={userCredentials.username}
              ownStatus={ownStatus}
              isConnecting={isConnecting}
            />

            <Card className={colorName} title='Change the status'>
              <select
                value={ownStatus}
                onChange={handleChangeStatus}
                disabled={!isConnected}
                className="w-full p-1 border rounded text-sm mt-2"
              >
                <option value="ONLINE">Online</option>
                <option value="IDLE">Idle</option>
                <option value="DO_NOT_DISTURB">Do Not Disturb</option>
                <option value="OFFLINE">Invisible</option>
              </select>
            </Card>
            <Card className={colorName} title='Friends'>
              {isConnected && (
                <UsersList
                  users={contacts.filter((item) => item.friend)}
                  listType={usersListType.Contacts}
                  onReject={handleRemoveFriend}
                />
              )}
            </Card>
          </div>
        )
        }
        {!userCredentials?.username && (<SkeletonLoader />)}
      </div>
    );
  }
);
PresencePanel.displayName = 'UserPanel';
export default PresencePanel;
