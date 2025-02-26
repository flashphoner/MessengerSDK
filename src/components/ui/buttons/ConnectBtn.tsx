import React, {FC} from "react";
import ActionButton from "./ActionButton";

type ConnectBtnProps = {
  isConnected: boolean;
  loading?: boolean;
  disconnect: () => void;
  connect: () => void;
};

const ConnectBtn: FC<ConnectBtnProps> = ({
  isConnected,
  loading,
  connect,
  disconnect,
}) => {
  const handleConnect = (): void => {
    if (!isConnected) {
      connect();
    } else {
      disconnect();
    }
  };

  return (
    <ActionButton
      onClick={handleConnect}
      text={loading ? "Connecting..." : isConnected ? "Disconnect" : "Connect"}
      isPrimary={isConnected}
      className={`transition duration-300 transform ${
        loading
          ? "bg-blue-400 cursor-not-allowed"
          : isConnected
            ? "bg-green-500"
            : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 hover:scale-105"
      }`}
    />
  );
};

export default ConnectBtn;
