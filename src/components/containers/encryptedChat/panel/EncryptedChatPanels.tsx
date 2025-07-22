import React from 'react';
import SkeletonLoader from '@/components/ui/skeleton/SkeletonLoader';
import EncryptedChatPanel from '@/components/containers/encryptedChat/panel/EncryptedChatPanel';
export type EncryptedChatPanelsProps = {
  users: Array<{url: string;   username: string;   password: string;   email?: string | undefined}>;
  secondConnectionToken?: string;
  setSecondConnectionToken?: (token: string) => void;
  isShowSecondConnection?: boolean;
  handleUpdateSharedToken?: (token: string) => void;
  serverUrl: string;
  countUsers?: number;
};

export const EncryptedChatPanels: React.FC<EncryptedChatPanelsProps> = React.memo((props) => {
  const {
    users,
    secondConnectionToken,
    setSecondConnectionToken,
    isShowSecondConnection,
    handleUpdateSharedToken,
    serverUrl,
    countUsers = 2,
  } = props;

  if (users.length !== countUsers) {
    return (
      <div className="w-full flex gap-4 whitespace-nowrap">
        {Array.from({ length: countUsers }).map((_, idx) => (
          <div key={idx} className="w-64 min-w-[20rem]">
            <SkeletonLoader />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-4 whitespace-nowrap">
      <div className="w-64 min-w-[20rem]">
        <EncryptedChatPanel
          colorName='bg-customColors-lightGrayBg'
          userCredentials={users[0]}
          updateSharedToken={handleUpdateSharedToken}
          users={users}
          serverUrl={serverUrl}
        />
      </div>
      {isShowSecondConnection && (
        <div className="w-64 min-w-[20rem]">
          <EncryptedChatPanel
            colorName='bg-customColors-lightGrayBg'
            userCredentials={users[0]}
            sharedToken={secondConnectionToken}
            users={users}
            serverUrl={serverUrl}
          />
        </div>
      )}
      <div className="w-64 min-w-[20rem]">
        <EncryptedChatPanel
          userCredentials={users[1]}
          colorName='bg-customColors-lightGrayBg'
          users={users}
          serverUrl={serverUrl}
        />
      </div>
    </div>
  );
});

EncryptedChatPanels.displayName = 'EncryptedChatPanels';
