// External deps
import React, { FC, useEffect } from 'react';

// Internal deps
import PresencePanel from "@/components/containers/presence/panel/PresencePanel";
import DocsPanel from "@/components/containers/presence/docs/DocsPanel";
import SkeletonLoader from '@/components/ui/skeleton/SkeletonLoader';
import useExampleManager from '@/hooks/panels/useExampleManager';
import AlertModal from '@/components/ui/alertModal/AlertModal';
import { ExamplePageTypes } from '@/types/Client';

export type UserCredentialsTypes = {
  url: string;
  userId?: string;
  username: string;
  password: string;
  authToken?: string;
  device?: string;
  email?: string;
};

const Presence: FC<ExamplePageTypes> = (props) => {
  const {serverUrl, handleSetDynamicTitle, isShowSecondConnection, isCanUseSecondConnection} = props;

  const countUsers = 2;

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
      handleSetDynamicTitle('Presence');
    }
  }, []);

  return (
    <div className="presence-page">
      {isModalOpen && errorExample && <AlertModal
        isOpen={isModalOpen}
        message={errorExample}
      />}
      <div className="flex w-full p-4">
        <div className="flex-grow mr-4 overflow-x-auto max-w-[75%] calc-main-height">
          {!!users.length && users.length === countUsers && (
            <div className="flex gap-4 whitespace-nowrap">
              <div className="w-64 min-w-[16rem]">
                <PresencePanel
                  colorName={
                    "bg-blue-100"}
                  userCredentials={users[0]}
                  updateSharedToken={handleUpdateSharedToken}
                  users={users}
                  serverUrl={serverUrl}
                />
              </div>

              {isShowSecondConnection &&
                <div className="w-64 min-w-[16rem]">
                  <PresencePanel
                    colorName={
                      "bg-pink-100"}
                    userCredentials={users[0]}
                    sharedToken={secondConnectionToken}
                    users={users}
                    serverUrl={serverUrl}
                  />
                </div>
              }
              <div className="w-64 min-w-[16rem]">
                <PresencePanel
                  userCredentials={users[1]}
                  colorName={
                    "bg-purple-100"}
                  users={users}
                  serverUrl={serverUrl}
                />
              </div>
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
        <div className="w-2/6 flex-shrink-0 ml-4">
          <DocsPanel />
        </div>
      </div>
    </div>
  );
};

export default Presence;
