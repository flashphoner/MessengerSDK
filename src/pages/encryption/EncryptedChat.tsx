// External deps
import React, { FC, useEffect } from 'react';

// Internal deps
import DocsPanel from "@/components/containers/encryptedChat/docs/DocsPanel";
import SkeletonLoader from '@/components/ui/skeleton/SkeletonLoader';
import useExampleManager from '@/hooks/panels/useExampleManager';
import AlertModal from '@/components/ui/alertModal/AlertModal';
import { ExamplePageTypes } from '@/types/Client';
import EncryptedChatPanel from '@/components/containers/encryptedChat/panel/EncryptedChatPanel';

// Hook and action from global store
import { useLayoutStore } from '@/hooks/helpers/useLayoutStore';
import { toggleDocsOpen } from '@/stores/layoutStore';
import {EncryptedChatPanels} from "@/components/containers/encryptedChat/panel/EncryptedChatPanels";

const EncryptedChat: FC<ExamplePageTypes> = (props) => {
  const {serverUrl, handleSetDynamicTitle, isShowSecondConnection, isCanUseSecondConnection} = props;
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
      handleSetDynamicTitle('Encrypted chat');
    }
  }, []);

  return (
    <div className="upgradeSecurity-page">
      {isModalOpen && errorExample && <AlertModal
        isOpen={isModalOpen}
        message={errorExample}
      />}
      {/* Main area: flex layout */}
      <div className="flex w-full calc-main-height">
        {/* Central column (flex-grow) */}
        <div className="flex-1 overflow-x-auto h-full custom-scrollbar py-6 px-6">
          <EncryptedChatPanels
            users={users}
            serverUrl={serverUrl}
            secondConnectionToken={secondConnectionToken}
            setSecondConnectionToken={setSecondConnectionToken}
            isShowSecondConnection={isShowSecondConnection}
            handleUpdateSharedToken={handleUpdateSharedToken}
          />
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

export default EncryptedChat;
