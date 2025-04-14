// External deps
import React, { FC, useEffect } from 'react';

// Internal deps
import OneToOneChatPanel from "@/components/containers/oneToOneChat/panels/OneToOneChatPanel";
import DocsPanel from "@/components/containers/oneToOneChat/docs/DocsPanel";
import SkeletonLoader from '@/components/ui/skeleton/SkeletonLoader';
import useExampleManager from '@/hooks/panels/useExampleManager';
import AlertModal from '@/components/ui/alertModal/AlertModal';
import { ExamplePageTypes } from '@/types/Client';

// Hook and action from global store
import { useLayoutStore } from '@/hooks/helpers/useLayoutStore';
import { toggleDocsOpen } from '@/stores/layoutStore';


const OneToOneChat: FC<ExamplePageTypes> = (props) => {
  const {
    serverUrl,
    isCanUseSecondConnection,
    handleSetDynamicTitle,
    isShowSecondConnection,
  } = props;

  const countUsers = 2;
  // State for whether the docs panel is open
  const docsOpen = useLayoutStore(state => state.docsOpen);

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
      handleSetDynamicTitle('One to one chat');
    }
  }, []);
  return (
    <div className="oneToOneChat">
      {isModalOpen && errorExample && <AlertModal
        isOpen={isModalOpen}
        message={errorExample}
      />}
      <div className="flex w-full calc-main-height">
        {/* Central column (flex-grow) */}
        <div className="flex-1 overflow-x-auto h-full custom-scrollbar py-6 px-6">
          {!!users.length && users.length === countUsers && (
            <div className="flex gap-4 whitespace-nowrap">
              <div className="w-64 min-w-[20rem]">
                <OneToOneChatPanel
                  userCredentials={users[0]}
                  updateSharedToken={handleUpdateSharedToken}
                  colorName={"bg-customColors-lightGrayBg"}
                  users={users}
                  serverUrl={serverUrl}
                />
              </div>
              {isShowSecondConnection && (
                <div className="w-64 min-w-[20rem]">
                  <OneToOneChatPanel
                    userCredentials={users[0]}
                    colorName={"bg-customColors-lightGrayBg"}
                    sharedToken={secondConnectionToken}
                    users={users}
                    serverUrl={serverUrl}
                  />
                </div>
              )}
              <div className="w-64 min-w-[20rem]">
                <OneToOneChatPanel
                  userCredentials={users[1]}
                  colorName={"bg-customColors-lightGrayBg"}
                  users={users}
                  serverUrl={serverUrl}
                />
              </div>
            </div>
          )}
          {!users.length && <div className="w-full flex gap-4 whitespace-nowrap">
            {Array.from({ length: countUsers }).map((_, index) => (
              <div key={index} className="w-64 min-w-[20rem]">
                <SkeletonLoader />
              </div>
            ))}
          </div>
          }
        </div>

        {/* Right column with docs panel (not removed from DOM, only width changes) */}
        <DocsPanel
          docsOpen={docsOpen}
          onClickCollapseDocHeader={toggleDocsOpen}
        />
      </div>
    </div>
  );
};

export default OneToOneChat;
