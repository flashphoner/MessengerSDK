// External deps
import React, { FC, useState } from 'react';
import { useLocation } from 'react-router-dom';

import ActionButton from "@/components/ui/buttons/ActionButton";
import AlertModal from '@/components/ui/alertModal/AlertModal';
import Breadcrumb from '@/components/ui//breadcrumb/Breadcrumb';
import Tooltip from '@/components/ui/tooltip/Tooltip';
import Icon from '@/components/ui/icon/Icon';
import { getBreadcrumbItems } from '@/utils/getBreadcrumbItems';

// Icons
import InfoIcon from "@/assets/icons/info.svg";
import ServerIcon from '@/assets/icons/serverIcon.svg';

type HeaderProps = {
  serverUrl: string;
  onChangeServerUrl: (url: string) => void;
  onToggleSecondConnection: () => void;
  isSecondConnectionAvailable?: boolean;
  isShowSecondConnection: boolean;
};

const Header: FC<HeaderProps> = (props) => {
  const {
    serverUrl,
    onChangeServerUrl,
    onToggleSecondConnection,
    isSecondConnectionAvailable,
    isShowSecondConnection,
  } = props;

  const [isServerErrorModal, setIsServerErrorModal] = useState<boolean>(false);
  const location = useLocation();
  const currentPath = location.pathname;

  // Get breadcrumb items based on current path
  const breadcrumbItems = getBreadcrumbItems(currentPath);

  // Reset the page
  const handleReset = () => {
    window.location.reload();
  };

  // Close the error modal
  const handleCloseModal = () => {
    setIsServerErrorModal(false);
  };

  // Clear the server URL
  const handleChangeServerUrl = () => {
    onChangeServerUrl("");
    localStorage.removeItem("serverUrl");
  };

  // Extract the hostname from the server URL
  const extractHostname = (url: string): string => {
    const regex = /^wss?:\/\/([^/:]+)(:\d+)?/;
    const match = url.match(regex);
    return match ? match[1] : url;
  };

  return (
    <header className="flex items-center w-full border-b px-4 pb-4 pt-4 bg-white">
      {/* Left side: title and breadcrumb */}
      <div className="flex items-center gap-4">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Right side: buttons and server URL */}
      <div className="ml-auto flex items-center gap-4">
        <ActionButton
          className="h-6 text-sm text-customColors-textBlue bg-customColors-lightBlue hover:bg-customColors-lightBlue border-0 w-48 rounded-lg flex items-center justify-center px-2"
          onClick={onToggleSecondConnection}
          isDisabled={!isSecondConnectionAvailable}
        >
          {isShowSecondConnection ? "Hide second connection" : "Show second connection"}
          <Tooltip message={`Add second connection as if user would be connected from a secondary device`}>
            <div className="ml-1 space-x-2 cursor-pointer w-2">
              <Icon src={InfoIcon} size={12} />
            </div>
          </Tooltip>
        </ActionButton>

        <ActionButton
          className="text-sm text-customColors-textBlue border-0 bg-white flex items-center justify-between"
          onClick={handleReset}
        >
          Reset
          <Tooltip message={`Reset and load two new testing users. Please note old testing users will be cleaned up.`}>
            <span className="space-x-2 cursor-pointer ml-1">
            <Icon src={InfoIcon} size={12} />
            </span>
          </Tooltip>
        </ActionButton>

        <div
          className="text-sm font-semibold text-customColors-textGray cursor-pointer underline flex items-center justify-between"
          onClick={handleChangeServerUrl}
        >
          <div className="mr-1 block">
            <Icon src={ServerIcon} size={16} />
          </div>
          {serverUrl ? extractHostname(serverUrl) : serverUrl}
        </div>
      </div>

      {/* Error modal */}
      {isServerErrorModal && (
        <AlertModal
          isOpen={isServerErrorModal}
          onClose={handleCloseModal}
          message={"Error: Can't connect to serve"}
        />
      )}
    </header>
  );
};

export default Header;
