// External deps
import React, { FC, useEffect } from 'react';
import classNames from "classnames";

// Internal deps
import CopyButton from "@/components/ui/buttons/CopyButton";
import Card from "@/components/ui/cards/Card";

// Local deps
import { AvatarBadge, Status } from "../avatarBadge/AvatarBadge";

type ConnectionCardProps = {
  className?: string;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnected: boolean;
  userName: string | undefined;
  ownStatus: Status | undefined;
  isCopy?: boolean;
  isConnecting?: boolean;
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
  } = props;


  const handleConnect = async () => {
     await connect();
  };

  const handleDisconnect = () => {
    disconnect();
  };

  useEffect(() => {
    return () => {
      if (isConnected) {
        handleDisconnect();
      }
    };
  }, [userName, isConnected]);

  // styles
  const cardTitleClasses = classNames("font-semibold text-base text-gray-700");
  const connectedCardFooterClasses = classNames(
    "flex justify-between items-center mt-3",
  );
  const isConnectedTextClasses = classNames(
    "text-xs align-middle ml-2 font-normal",
    isConnected ? "text-green-500" : "text-red-500",
  );
  const cardUserClasses = classNames(
    "flex justify-start items-center mt-2 mb-3",
  );

  return (
    <Card className={className}>
      <p className={cardTitleClasses}>Connection to server</p>
      <div className={cardUserClasses}>
        {userName && <AvatarBadge name={userName} status={ownStatus} size="small" /> }
        <div className="flex items-center ml-2">
          <p className="align-middle text-sm text-gray-800 font-normal mr-2">
            {userName}
          </p>
          {isCopy && userName && (
            <CopyButton
              text={userName}
              isDisabled={!isConnected}
              className={"ml-2"}
            />
          )}
        </div>
      </div>
      <div className={connectedCardFooterClasses}>
        <button
          onClick={isConnected ? handleDisconnect : handleConnect}
          className={classNames(
            "px-1 py-0.5 rounded-md h-5 font-normal flex items-center justify-start text-xs border border-black transition-colors duration-200 ease-in-out",
            isConnecting
              ? "bg-gray-100 text-black cursor-not-allowed text-xs"
              : isConnected
                ? "bg-white text-black hover:bg-gray-100"
                : "bg-white text-black hover:bg-gray-100",
          )}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <div className="w-3 h-3 border-2 border-t-transparent border-black rounded-full animate-spin text-xs"></div>
          ) : isConnected ? (
            "Disconnect"
          ) : (
            "Connect"
          )}
        </button>
        <p className={isConnectedTextClasses}>
          {isConnected ? "CONNECTED" : "DISCONNECTED"}
        </p>
      </div>
    </Card>
  );
};

export default ConnectionCard;
