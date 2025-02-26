// External deps
import React, { FC, useEffect } from 'react';

// Internal deps
import DocsPanel from "@/components/containers/changeNickName/docs/DocsPanel";
import ChangeNickNamePanel from "@/components/containers/changeNickName/panels/ChangeNickNamePanel";
import useExampleManager from '@/hooks/panels/useExampleManager';
import SkeletonLoader from '@/components/ui/skeleton/SkeletonLoader';
import AlertModal from '@/components/ui/alertModal/AlertModal';
import { ExamplePageTypes } from '@/types/Client';

const ChangeNickName: FC<ExamplePageTypes> = (props) => {
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
      handleSetDynamicTitle('Change Nickname');
    }
  }, []);
  return (
    <div className="changeNickName">
      {isModalOpen && errorExample && <AlertModal
        isOpen={isModalOpen}
        message={errorExample}
      />}
      <div className="flex w-full p-4">
        {/* change nickname */}
        <div className="flex-grow mr-4 overflow-x-auto max-w-[75%] calc-main-height">
          {!!users.length && users.length === countUsers && (
            <div className="flex gap-4 whitespace-nowrap">
              <div className="w-64 min-w-[16rem]">
                <ChangeNickNamePanel
                  colorName={"bg-blue-100"}
                  userCredentials={users[0]}
                  updateSharedToken={handleUpdateSharedToken}
                  users={users}
                  serverUrl={serverUrl}
                />
              </div>
              {isShowSecondConnection && (
                  <div className="w-64 min-w-[16rem]">
                    <ChangeNickNamePanel
                      colorName={'bg-pink-100'}
                      userCredentials={users[0]}
                      users={users}
                      sharedToken={secondConnectionToken}
                      serverUrl={serverUrl}
                    />
                  </div>
                )
              }
              <div className="w-64 min-w-[16rem]">
                <ChangeNickNamePanel
                  userCredentials={users[1]}
                  users={users}
                  colorName={'bg-cyan-100'}
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

export default ChangeNickName;
