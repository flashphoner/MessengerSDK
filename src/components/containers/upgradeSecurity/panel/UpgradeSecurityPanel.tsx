import React, { forwardRef, useEffect, useState, useMemo, useCallback } from 'react';
import classNames from 'classnames';

// Internal dependencies
import { ExamplePagePanelTypes } from '@/types/Client';
import { defaultMSPassword, SAFE_SELF_USER_TXT, UNSAFE_SELF_USER_TXT } from '@/utils/constants';

// Components
import ConnectionCard from '@/components/ui/cards/ConnectionCard';
import Card from '@/components/ui/cards/Card';
import SkeletonLoader from '@/components/ui/skeleton/SkeletonLoader';
import ActionButton from '@/components/ui/buttons/ActionButton';
import EncryptionOptionsForm from '@/components/ui/forms/ecnryption/EncryptionOptionsForm';
import Tooltip from '@/components/ui/tooltip/Tooltip';

// Hooks
import { useSDK } from '@/hooks/sdk/useSDK';
import useConnectWithCredentials from '@/hooks/panels/useConnectWithCredentials';
import useEncryption from '@/hooks/encryption/useEncryption';

// Icons
import SafeIconUrl from '@/assets/icons/safe.svg';
import UnsafeIconUrl from '@/assets/icons/unsafe.svg';

export type UserPanelHandlers = {
  clearData: () => void;
};

/**
 * UpgradeSecurityPanel Component
 *
 * This component handles the display and management of user security settings,
 * including encryption options and server connection status.
 *
 * @param {ExamplePagePanelTypes} props - Component props.
 * @param {React.Ref<UserPanelHandlers>} ref - Ref for external method access.
 * @returns {JSX.Element} - Rendered component.
 */

const UpgradeSecurityPanel = forwardRef<UserPanelHandlers, ExamplePagePanelTypes>(
  ({ colorName, userCredentials, updateSharedToken, sharedToken, serverUrl }, ref) => {
    const {
      initializeSdk,
      sdkInitialized,
      connect,
      disconnect,
      isConnected,
      authToken,
      isConnecting,
      ownStatus,
      loadEncryptionInfo,
      addEncryptionInfo,
      encryptionInfo,
    } = useSDK();

    const [options, setOptions] = useState({ useIVAndSalt: false });

    // Connect with credentials hook
    const { connectWithCredentials } = useConnectWithCredentials({
      initializeSdk,
      sdkInitialized,
      credentials: { userCredentials, sharedToken, authToken },
      connect,
      serverUrl,
    });

    // Encryption hook
    const { turnOnEncryption } = useEncryption(userCredentials.username, options, addEncryptionInfo);

    // Memoize encryption status check
    const encryptionEnabled = useMemo(() => encryptionInfo?.encryptionEnabled, [encryptionInfo]);

    // Update shared token when authToken changes
    useEffect(() => {
      if (authToken && updateSharedToken) {
        updateSharedToken(authToken);
      }
    }, [authToken, updateSharedToken]);

    // Load encryption info when connected
    useEffect(() => {
      if (isConnected) {
        loadEncryptionInfo();
      }
    }, [isConnected, loadEncryptionInfo]);

    // Memoized styles for cards and text
    const cardClasses = useMemo(
      () => classNames('card p-2 border rounded-md transition-colors duration-300 mb-4', colorName),
      [colorName]
    );

    const textClassKey = useMemo(
      () => classNames('w-55 overflow-hidden text-ellipsis whitespace-nowrap text-xs mb-1'),
      []
    );

    // Memoized handle for turning on encryption
    const handleTurnOnEncryption = useCallback(async () => {
      if (!encryptionEnabled) {
        await turnOnEncryption();
      }
    }, [encryptionEnabled, turnOnEncryption]);

    return (
      <div className="user-panel">
        {userCredentials?.email && serverUrl ? (
          <div>
            {/* Connection Card */}
            <ConnectionCard
              className={cardClasses}
              connect={connectWithCredentials}
              disconnect={disconnect}
              isConnected={isConnected}
              userName={userCredentials.email}
              ownStatus={ownStatus}
              isConnecting={isConnecting}
              isEncryption={encryptionEnabled}
              onUpgradeSecurity={handleTurnOnEncryption}
              isDisconnectOff
            />

            {/* Master Password Card */}
            <Card className={colorName}>
              <div className="flex justify-start items-center">
                <p className="card-title mb-2 flex text-xs">
                  Master password: <span className="font-bold ml-1">{defaultMSPassword}</span>
                </p>
              </div>
            </Card>

            {/* Encryption Keys Card */}
            <Card className={colorName}>
              <p className="card-title font-bold">Keys</p>
              {encryptionInfo?.privateKey && (
                <p className={textClassKey}>
                  Private key: <span className="font-bold">{encryptionInfo.privateKey}</span>
                </p>
              )}
              {encryptionInfo?.publicKey && (
                <p className={textClassKey}>
                  Public key: <span className="font-bold">{encryptionInfo.publicKey}</span>
                </p>
              )}
              {encryptionInfo?.iv && (
                <p className={textClassKey}>
                  IV: <span className="font-bold">{encryptionInfo.iv}</span>
                </p>
              )}
              {encryptionInfo?.salt && (
                <p className={textClassKey}>
                  Salt: <span className="font-bold">{encryptionInfo.salt}</span>
                </p>
              )}
            </Card>

            {/* Encryption Options Form */}
            <Card className={colorName}>
              <EncryptionOptionsForm
                onOptionsChange={setOptions}
                isDisabled={encryptionEnabled}
              />
            </Card>

            {/* Security Status Card */}
            <Card className={colorName}>
              <div className="font-bold flex items-center">
                {encryptionInfo && (
                  <Tooltip
                    message={encryptionEnabled ? SAFE_SELF_USER_TXT : UNSAFE_SELF_USER_TXT}
                    onClickBtn={handleTurnOnEncryption}
                    btnText={encryptionEnabled ? undefined : 'Increase'}
                  >
                    <div className="flex items-center cursor-pointer">
                      <img
                        src={encryptionEnabled ? SafeIconUrl : UnsafeIconUrl}
                        width="24px"
                        height="24px"
                        alt="safe"
                      />
                    </div>
                  </Tooltip>
                )}
                <div className="text uppercase">
                  End to End Security is {encryptionEnabled ? 'ON' : 'OFF'}
                </div>
              </div>
              <p className="text-xs mb-1 mt-3">
                You {encryptionEnabled ? 'can' : 'can’t'}:
              </p>
              <ul className="text-xs list-disc pl-2 ml-3 mb-2">
                <li>Create Secure chats</li>
                <li>Participate in Secure chats created by others</li>
                <li>Restore your Secure chats on Your new devices</li>
              </ul>
              {!encryptionEnabled && (
                <ActionButton
                  className="card-title mb-0.5 w-full h-6 font-bold"
                  onClick={handleTurnOnEncryption}
                  isDisabled={!isConnected}
                >
                  Turn ON
                </ActionButton>
              )}
              <p className="text-xs text-customColors-lightGrey mt-0.5">
                Secure chat is a chat backed by End to End encryption
              </p>
            </Card>
          </div>
        ) : (
          <SkeletonLoader />
        )}
      </div>
    );
  }
);

UpgradeSecurityPanel.displayName = 'UpgradeSecurityPanel';
export default UpgradeSecurityPanel;
