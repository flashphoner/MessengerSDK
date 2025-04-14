// External deps
import React, { FC, useEffect, useState } from 'react';

// Internal deps
import CopyButton from "@/components/ui/buttons/CopyButton";
import Card from "@/components/ui/cards/Card";
import SafeIconUrl from "@/assets/icons/safe.svg";
import UnsafeIconUrl from '@/assets/icons/unsafe.svg';

// Local deps
import { AvatarBadge, Status } from "../avatarBadge/AvatarBadge";
import Tooltip from '@/components/ui/tooltip/Tooltip';
import { SAFE_SELF_USER_TXT, UNSAFE_SELF_USER_TXT} from '@/utils/constants';
import ConnectionCardsHeader from '@/components/ui/cards/ConnectionCardsHeader';
import Icon from '@/components/ui/icon/Icon';

type ConnectionCardProps = {
  className?: string;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnected: boolean;
  userName: string | undefined;
  ownStatus: Status | undefined;
  isCopy?: boolean;
  isConnecting?: boolean;
  isEncryption?: boolean;
  onUpgradeSecurity?: () => void;
  isDisconnectOff?: boolean
};

const ConnectionCard: FC<ConnectionCardProps> = (props) => {

  const {
    className,
    connect,
    disconnect,
    isConnected,
    userName,
    ownStatus,
    isCopy = false,
    isConnecting,
    isEncryption = false,
    onUpgradeSecurity,
    isDisconnectOff = false,
  } = props;

  const [showMenu, setShowMenu] = useState(false);
  const [isDisconnected, setIsDisconnected] = useState(false);

  const handleConnect = async () => {
    if (isDisconnected) {
      setIsDisconnected(false);
    }
    await connect();
  };

  const handleDisconnect = () => {
    disconnect();
    setShowMenu(false);
    setIsDisconnected(true);
  };

  const handleTooltipClick = () => {
    if (!isEncryption && onUpgradeSecurity) {
      onUpgradeSecurity();
    }
  };

  useEffect(() => {
    return () => {
      if (isConnected) {
        handleDisconnect();
      }
    };
  }, [userName, isConnected]);

  return (
    <Card className={className}>
      <ConnectionCardsHeader
        isConnected={isConnected}
        isConnecting={isConnecting}
        onConnect={handleConnect}
        isDisconnected={isDisconnected}
        onDisconnect={handleDisconnect}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
      />
      <div className="flex justify-start items-center mt-3">
        {userName && <AvatarBadge name={userName} status={ownStatus} size="small" />}
        <div className="flex items-center ml-2 z-10">
          <p className="align-middle text-sm text-gray-800 font-normal mr-1">
            {userName}
          </p>
          {isCopy && userName && (
            <CopyButton
              text={userName}
              isDisabled={!isConnected}
              className="p-0"
            />
          )}

          {isConnected && isDisconnectOff && <Tooltip message={isEncryption ? `${SAFE_SELF_USER_TXT}` : `${UNSAFE_SELF_USER_TXT}`}
                                                      onClickBtn={handleTooltipClick}
                                                      btnText={isEncryption ? undefined : 'Increase'}>
            <div className="flex items-center space-x-2 cursor-pointer mr-1">
              { <Icon src={isEncryption ? SafeIconUrl : UnsafeIconUrl} size={16} />}
            </div>
          </Tooltip>}
        </div>
      </div>
    </Card>
  );
};

export default ConnectionCard;
