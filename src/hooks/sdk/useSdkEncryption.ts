import { useCallback, useState } from 'react';
import { SfuExtended } from "@flashphoner/sfusdk";
import { UserEncryptionInfo } from '@flashphoner/sfusdk/dist/sdk/constants';

export function useSdkEncryption(sdkInstance: SfuExtended | null) {
  const [encryptionInfo, setEncryptionInfo] = useState<UserEncryptionInfo>();


  // get user encryption info
  const loadEncryptionInfo = useCallback(
    async () => {
      if (!sdkInstance) {
        return;
      }

      try {
        const info = await sdkInstance.getUserEncryptionInfo();
        setEncryptionInfo(info);
      } catch (error) {
        console.error("loadEncryptionInfo:", error);
      }
    },
    [sdkInstance],
  );

  // addEncryptionInfo
  const addEncryptionInfo = useCallback(
    async (info: {
      privateKey: string;
      publicKey: string;
      verificationHash?: string;
      salt?: string;
      iv?: string;
    }) => {
      if (!sdkInstance) {
        return;
      }
      try {
        const encrypted = await sdkInstance.addUserEncryptionInfo(info);
        setEncryptionInfo(encrypted);
      } catch (error) {
        console.error("addUserEncryptionInfo:", error);
      }
    },
    [sdkInstance],
  );

  return {
    loadEncryptionInfo,
    addEncryptionInfo,
    encryptionInfo
  };
}
