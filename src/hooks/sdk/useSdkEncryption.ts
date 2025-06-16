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
        /**
         * @returns Promise that resolves with the `USER_ENCRYPTION_INFO` payload.
         * {
         *   encryptionEnabled: boolean;      // true → keys are present, false → no keys yet
         *   iv:               string | null; // Base64-encoded IV for symmetric encryption
         *   privateKey:       string | null; // Base64-encoded PKCS-8 private key
         *   publicKey:        string | null; // Base64-encoded SPKI public key
         *   salt:             string | null; // Salt used for PBKDF2 key-derivation
         *   verificationHash: string | null; // Hash to verify derived password key
         * }
         */
        setEncryptionInfo(info);
      } catch (error) {
        console.error("loadEncryptionInfo:", error);
      }
    },
    [sdkInstance],
  );

  /**
   * Adds user encryption info to the SDK instance and updates local state.
   *
   * @param info - Encryption info:
   *   - privateKey: string;
   *   - publicKey: string;
   *   - verificationHash?: string;
   *   - salt?: string;
   *   - iv?: string;
   * @returns Promise that resolves with the `USER_ENCRYPTION_INFO_ADDED`.
   *
   * {
   *   encryptionEnabled: boolean;      // true
   *   iv:               string; // Base64-encoded IV for symmetric encryption
   *   privateKey:       string; // Base64-encoded PKCS-8 private key
   *   publicKey:        string; // Base64-encoded SPKI public key
   *   salt:             string; // Salt used for PBKDF2 key-derivation
   *   verificationHash: string; // Hash to verify derived password key
   * }
   */
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
