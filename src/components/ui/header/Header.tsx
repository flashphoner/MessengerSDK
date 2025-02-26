// External deps
import React, { FC, ReactElement, useState } from 'react';

// Internal deps
import ActionButton from "@/components/ui/buttons/ActionButton";
import AlertModal from '@/components/ui/alertModal/AlertModal';

type HeaderProps = {
  title?: string;
  serverUrl: string;
  onChangeServerUrl: (url: string) => void;
  onToggleSecondConnection: () => void;
  isSecondConnectionAvailable?: boolean;
  isShowSecondConnection: boolean;
};

const Header: FC<HeaderProps> = (props): ReactElement => {
  const {
    title,
    serverUrl,
    onChangeServerUrl,
    onToggleSecondConnection,
    isShowSecondConnection,
    isSecondConnectionAvailable,
  } = props;

  const [isServerErrorModal, setIsServerErrorModal] = useState<boolean>(false);

  const handleChangeServerUrl = async () => {
    onChangeServerUrl('');
    localStorage.removeItem("serverUrl");
  };

  const extractHostname = (url: string): string => {
    const regex = /^wss?:\/\/([^/:]+)(:\d+)?/;
    const match = url.match(regex);
    return match ? match[1] : url;
  };

  const handleReset = () => {
    window.location.reload();
  };

  const handleAddSecondConnection = () => {
    onToggleSecondConnection();
  };

  const handleCloseModal = () => {
    setIsServerErrorModal(false);
  };

  return (
    <div className="flex items-center gap-4 bg-gray-800 text-white p-4 border-gray-700 border-l border-b">
      <p className="font-bold text-xl">{title || ""}</p>
      <ActionButton
        className="text-sm"
        isPrimary={true}
        text={"RESET"}
        onClick={handleReset}
      />
      <ActionButton
        className="text-sm"
        onClick={handleAddSecondConnection}
        isDisabled={!isSecondConnectionAvailable}
        isPrimary={true}
      >
        {isShowSecondConnection ? "HIDE SECOND CONNECTION" : "SHOW SECOND CONNECTION"}
      </ActionButton>
      <p className="server-url ml-auto font-bold hover:cursor-pointer underline" onClick={handleChangeServerUrl}>
        { serverUrl ? extractHostname(serverUrl) : serverUrl }
      </p>
      {isServerErrorModal && <AlertModal
        isOpen={isServerErrorModal}
        onClose={handleCloseModal}
        message={"Error: Can't connect to server"}
      />}
    </div>
  );
};

export default Header;
