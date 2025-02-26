// External deps
import React, { FC, useEffect } from 'react';

// Internal deps
import DocsPanel from "@/components/containers/groupChat/docs/DocsPanel";
import GroupChatPanel from "@/components/containers/groupChat/panels/GroupChatPanel";
import useExampleManager from '@/hooks/panels/useExampleManager';
import SkeletonLoader from '@/components/ui/skeleton/SkeletonLoader';
import AlertModal from '@/components/ui/alertModal/AlertModal';
import { ExamplePageTypes } from '@/types/Client';

const GroupChat: FC<ExamplePageTypes> = (props) => {
  const {
    serverUrl,
    isCanUseSecondConnection,
    handleSetDynamicTitle,
    isShowSecondConnection,
  } = props;

  const countUsers = 3;

  const {
    setSecondConnectionToken,
    secondConnectionToken,
    users,
    isModalOpen,
    errorExample,
  } = useExampleManager({ countUsers, serverUrl });

  const handleUpdateSharedToken = (token: string) => {
    setSecondConnectionToken(token);
    if (isCanUseSecondConnection) {
      isCanUseSecondConnection();
    }
  };
  useEffect(() => {
    if (handleSetDynamicTitle) {
      handleSetDynamicTitle('Group Chat');
    }
  }, []);
  return (
    <div className="oneToOneChat">
      {isModalOpen && errorExample && <AlertModal
        isOpen={isModalOpen}
        message={errorExample}
      />}
      <div className="flex w-full p-4">
        {/* group chat container */}
        <div className="flex-grow mr-4 overflow-x-auto max-w-[75%] calc-main-height">
          {!!users.length && users.length === countUsers && (
            <div className="flex gap-4 whitespace-nowrap">
              <div className="w-64 min-w-[16rem]">
                <GroupChatPanel
                  colorName={'bg-blue-100'}
                  userCredentials={users[0]}
                  updateSharedToken={handleUpdateSharedToken}
                  users={users}
                  serverUrl={serverUrl}
                />
              </div>
              {isShowSecondConnection && secondConnectionToken && (
                <div className="w-64 min-w-[16rem]">
                  <GroupChatPanel
                    colorName={'bg-pink-100'}
                    userCredentials={users[0]}
                    sharedToken={secondConnectionToken}
                    users={users}
                    serverUrl={serverUrl}
                  />
                </div>
              )}
              <div className="w-64 min-w-[16rem]">
                <GroupChatPanel
                  colorName={'bg-yellow-100'}
                  userCredentials={users[1]}
                  users={users}
                  serverUrl={serverUrl}
                />
              </div>
              { users.length > 2 &&
              <div className="w-64 min-w-[16rem]">
                <GroupChatPanel
                  colorName={'bg-purple-100'}
                  userCredentials={users[2]}
                  users={users}
                  serverUrl={serverUrl}
                />
              </div>
              }
            </div>
          )}
          {!users.length && <div className="w-full flex gap-4 whitespace-nowrap">
            {Array.from({ length: countUsers }).map((_, index) => (
              <div key={index} className="w-64 min-w-[16rem]">
                <SkeletonLoader />
              </div>
            ))}
          </div>
          }
        </div>

        {/* Docs Panel */}
        <div className="w-2/6 flex-shrink-0 ml-4">
          <DocsPanel />
        </div>
      </div>
    </div>
  );
};

export default GroupChat;
