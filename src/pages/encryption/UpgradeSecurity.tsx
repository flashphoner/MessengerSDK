// External deps
import React, { FC, useEffect, useMemo, useCallback } from 'react';

// Internal deps
import DocsPanel from "@/components/containers/upgradeSecurity/docs/DocsPanel";
import SkeletonLoader from '@/components/ui/skeleton/SkeletonLoader';
import useExampleManager from '@/hooks/panels/useExampleManager';
import AlertModal from '@/components/ui/alertModal/AlertModal';
import { ExamplePageTypes } from '@/types/Client';
import UpgradeSecurityPanel from '@/components/containers/upgradeSecurity/panel/UpgradeSecurityPanel';

// Hook and action from global store
import { useLayoutStore } from '@/hooks/helpers/useLayoutStore';
import { toggleDocsOpen } from '@/stores/layoutStore';

const UpgradeSecurity: FC<ExamplePageTypes> = ({ serverUrl, handleSetDynamicTitle, isShowSecondConnection, isCanUseSecondConnection }) => {
  const countUsers = 1;
  const docsOpen = useLayoutStore(state => state.docsOpen);
  const {
    setSecondConnectionToken,
    secondConnectionToken,
    users,
    isModalOpen,
    errorExample,
  } = useExampleManager({ countUsers, serverUrl });

  useEffect(() => {
    handleSetDynamicTitle?.('Upgrade security');
  }, [handleSetDynamicTitle]);

  const handleUpdateSharedToken = useCallback((token: string) => {
    setSecondConnectionToken(token);
    isCanUseSecondConnection?.();
  }, [setSecondConnectionToken, isCanUseSecondConnection]);

  const isUsersLoaded = useMemo(() => users.length === countUsers, [users]);

  const renderPanel = useCallback(
    (userIndex: number, colorName: string, sharedToken?: string) => (
      <div className="w-64 min-w-[20rem]">
        <UpgradeSecurityPanel
          colorName={colorName}
          userCredentials={users[userIndex]}
          updateSharedToken={userIndex === 0 ? handleUpdateSharedToken : undefined}
          sharedToken={sharedToken}
          users={users}
          serverUrl={serverUrl}
        />
      </div>
    ),
    [users, handleUpdateSharedToken, serverUrl]
  );

  return (
    <div className="upgradeSecurity-page">
      {isModalOpen && errorExample && <AlertModal isOpen={isModalOpen} message={errorExample} />}
      <div className="flex w-full calc-main-height">
        {/* Central column (flex-grow) */}
        <div className="flex-1 overflow-x-auto h-full custom-scrollbar py-6 px-6">
          {isUsersLoaded ? (
            <div className="flex gap-4 whitespace-nowrap">
              {renderPanel(0, "bg-customColors-lightGrayBg")}
              {isShowSecondConnection && renderPanel(0, "bg-customColors-lightGrayBg", secondConnectionToken)}
            </div>
          ) : (
            <div className="w-full flex gap-4 whitespace-nowrap">
              {Array.from({ length: countUsers }).map((_, index) => (
                <div key={index} className="w-64 min-w-[20rem]">
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

export default UpgradeSecurity;
