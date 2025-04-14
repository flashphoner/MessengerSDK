// External deps
import React, { FC, useEffect } from 'react';

// Internal deps
import SpacePanel from "@/components/containers/spaces/panels/SpaceUserPanel";
import DocsPanel from "@/components/containers/spaces/docs/DocsPanel";
import useExampleManager from '@/hooks/panels/useExampleManager';
import AlertModal from '@/components/ui/alertModal/AlertModal';
import SkeletonLoader from '@/components/ui/skeleton/SkeletonLoader';
import { ExamplePageTypes } from '@/types/Client';
// Hook and action from global store
import { useLayoutStore } from '@/hooks/helpers/useLayoutStore';
import { toggleDocsOpen } from '@/stores/layoutStore';

const Contacts: FC<ExamplePageTypes> = (props) => {
  const {
    serverUrl,
    isCanUseSecondConnection,
    handleSetDynamicTitle,
    isShowSecondConnection,
  } = props;

  const countUsers = 2;
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
      handleSetDynamicTitle('Contacts');
    }
  }, []);

  return (
    <div className="panels">
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
                <SpacePanel
                  userCredentials={users[0]}
                  users={users}
                  updateSharedToken={handleUpdateSharedToken}
                  colorName={"bg-customColors-lightGrayBg"}
                  serverUrl={serverUrl}
                />
              </div>
              {isShowSecondConnection && secondConnectionToken && (
                <div className="w-64 min-w-[20rem]">
                  <SpacePanel
                    userCredentials={users[0]}
                    users={users}
                    sharedToken={secondConnectionToken}
                    colorName={"bg-customColors-lightGrayBg"}
                    serverUrl={serverUrl}
                  />
                </div>
              )}
              <div className="w-64 min-w-[20rem]">
                <SpacePanel
                  userCredentials={users[1]}
                  users={users}
                  colorName={"bg-customColors-lightGrayBg"}
                  serverUrl={serverUrl}
                />
              </div>
            </div>
          )
          }
          {!users.length && (
            <div className="w-full flex gap-4 whitespace-nowrap">
              <div className="w-64 min-w-[20rem]">
                <SkeletonLoader />
              </div>
              <div className="w-64 min-w-[20rem]">
                <SkeletonLoader />
              </div>
            </div>
          )}
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

export default Contacts;
