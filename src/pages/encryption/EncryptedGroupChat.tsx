import React, { FC, useEffect } from 'react';
import DocsPanel from "@/components/containers/encryptedGroupChat/docs/DocsPanel";
import SkeletonLoader from '@/components/ui/skeleton/SkeletonLoader';
import useExampleManager from '@/hooks/panels/useExampleManager';
import AlertModal from '@/components/ui/alertModal/AlertModal';
import { ExamplePageTypes } from '@/types/Client';
import EncryptedGroupChatPanel from '@/components/containers/encryptedGroupChat/panel/EncryptedGroupChatPanel';

// Hook and action from global store
import { useLayoutStore } from '@/hooks/helpers/useLayoutStore';
import { toggleDocsOpen } from '@/stores/layoutStore';

const EncryptedGroupChat: FC<ExamplePageTypes> = (props) => {
  const {
    serverUrl,
    handleSetDynamicTitle,
    isShowSecondConnection,
    isCanUseSecondConnection
  } = props;

  // State for whether the docs panel is open
  const docsOpen = useLayoutStore(state => state.docsOpen);

  const countUsers = 3;

  // Hook with your custom logic
  const {
    setSecondConnectionToken,
    secondConnectionToken,
    users,
    isModalOpen,
    errorExample,
    setIsModalOpen,
  } = useExampleManager({ countUsers, serverUrl });

  // Handle the update of shared token
  const handleUpdateSharedToken = (token: string) => {
    setSecondConnectionToken(token);
    if (isCanUseSecondConnection) {
      isCanUseSecondConnection();
    }
  };

  // Set dynamic title when the component is mounted
  useEffect(() => {
    if (handleSetDynamicTitle) {
      handleSetDynamicTitle('Encrypted group chat');
    }
  }, []);

  return (
    <div className="encryptedGroupChat">
      {/* Modal for error */}
      {isModalOpen && errorExample && (
        <AlertModal
          isOpen={isModalOpen}
          message={errorExample}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Main area: flex layout */}
      <div className="flex w-full calc-main-height">
        {/* Central column (flex-grow) */}
        <div className="flex-1 overflow-x-auto h-full custom-scrollbar py-6 px-6">
          {!!users.length && users.length === countUsers && (
            <div className="flex gap-4 whitespace-nowrap">
              {users.map((user, index) => {
                const sharedToken =
                  index === 1 && isShowSecondConnection
                    ? secondConnectionToken
                    : undefined;

                return (
                  <div
                    key={user.userId || index}
                    className="w-64 min-w-[20rem]"
                  >
                    <EncryptedGroupChatPanel
                      colorName="bg-customColors-lightGrayBg"
                      userCredentials={user}
                      sharedToken={sharedToken}
                      users={users}
                      serverUrl={serverUrl}
                      updateSharedToken={index === 0 ? handleUpdateSharedToken : undefined}
                      countUsers={countUsers}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* If users are not available, show skeleton loaders */}
          {!users.length && (
            <div className="flex gap-4 whitespace-nowrap">
              {Array.from({ length: countUsers }).map((_, index) => (
                <div
                  key={index}
                  className="w-64 min-w-[20rem]"
                >
                  <SkeletonLoader />
                </div>
              ))}
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

export default EncryptedGroupChat;
