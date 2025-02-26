// External deps
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle, useState
} from 'react';
import classNames from 'classnames';
import { ExamplePagePanelTypes, ExamplePanelHandlers, usersListType } from '@/types/Client';

// Internal deps
import { useSDK } from '@/hooks/sdk/useSDK';
import UsersList from '@/components/ui/lists/UsersList';
import ConnectionCard from '@/components/ui/cards/ConnectionCard';
import Card from '@/components/ui/cards/Card';
import SkeletonLoader from '@/components/ui/skeleton/SkeletonLoader';
import useConnectWithCredentials from '@/hooks/panels/useConnectWithCredentials';
import ActionButton from '@/components/ui/buttons/ActionButton';

const PresenceActivityStatusPanel = forwardRef<ExamplePanelHandlers, ExamplePagePanelTypes>(
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

      // connect
      connect,
      disconnect,
      isConnected,
      authToken,
      isConnecting,

      // contacts
      contacts,
      handleRemoveFriend,
      addFriend,
      handleGetContacts,
      incomingList,
      acceptFriendRequest,


      // presence
      ownStatus,
      changePresenceStatusActivity,

    } = useSDK();

    useImperativeHandle(ref, () => ({
      async clearData() {}
    }), [userCredentials]);

    const { connectWithCredentials } = useConnectWithCredentials({
      initializeSdk,
      sdkInitialized,
      credentials: { userCredentials, sharedToken, authToken },
      connect,
      serverUrl
    });
    const [ownActivity, setOwnActivity] = useState<boolean>(true);

    const handleChangeStatusActivity = async () => {
     if (isConnected) {
       const newActivityStatus = !ownActivity;

       setOwnActivity((prev) => !prev);

       await changePresenceStatusActivity(newActivityStatus);
     }
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
              isConnecting={isConnecting}
              userName={userCredentials.username}
              ownStatus={ownStatus}
            />

            <Card className={colorName}>
              <p className="card-title text-xs">Current activity is: <span className="font-bold">{isConnected && ownActivity ? 'online' : 'idle'}</span></p>
              <ActionButton text={'Change activity'} onClick={handleChangeStatusActivity} isDisabled={!isConnected} />
            </Card>
            <Card className={colorName}>
              <p className="card-title mb-2">Friends</p>
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
PresenceActivityStatusPanel.displayName = 'PresenceActivityStatusPanel';
export default PresenceActivityStatusPanel;
