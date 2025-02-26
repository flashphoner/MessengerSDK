// External deps
import React, { FC, useEffect } from 'react';

// Internal deps
import DocsPanel from "@/components/containers/accessRights/docs/DocsPanel";
import AccessRightsPanel from "@/components/containers/accessRights/panels/AccessRightsPanel";
import useExampleManager from '@/hooks/panels/useExampleManager';
import SkeletonLoader from '@/components/ui/skeleton/SkeletonLoader';
import AlertModal from '@/components/ui/alertModal/AlertModal';
import { ExamplePageTypes } from '@/types/Client';

const AccessRights: FC<ExamplePageTypes> = (props) => {
  const {
    serverUrl,
    isCanUseSecondConnection,
    handleSetDynamicTitle,
    isShowSecondConnection,
  } = props;

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
      handleSetDynamicTitle('Access rights');
    }
  }, []);

  return (
    <div className="panels">
      {isModalOpen && errorExample && <AlertModal
        isOpen={isModalOpen}
        message={errorExample}
      />}
      <div className="flex w-full p-4">
        {/* Access rights */}
        <div className="flex-grow mr-4 overflow-x-auto max-w-[75%] calc-main-height mb-2">
          {!!users.length && users.length === countUsers && (
            <div className="flex gap-4 whitespace-nowrap">
              <div className="w-64 min-w-[16rem]">
                <AccessRightsPanel
                  users={users}
                  userCredentials={users[0]}
                  colorName={"bg-purple-100"}
                  updateSharedToken={handleUpdateSharedToken}
                  serverUrl={serverUrl}
                />
              </div>
              {isShowSecondConnection && secondConnectionToken && (
                <div className="w-64 min-w-[16rem]">
                  <AccessRightsPanel
                    users={users}
                    userCredentials={users[0]}
                    colorName={"bg-green-100"}
                    sharedToken={secondConnectionToken}
                    serverUrl={serverUrl}
                  />
                </div>
              )}
              <div className="w-64 min-w-[16rem]">
                <AccessRightsPanel
                  users={users}
                  userCredentials={users[1]}
                  colorName={"bg-yellow-100"}
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

        {/* Docs Panel */}
        <div className="w-2/6 flex-shrink-0 ml-4">
          <DocsPanel />
        </div>
      </div>
    </div>
  );
};

export default AccessRights;
