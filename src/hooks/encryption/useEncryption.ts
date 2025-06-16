import { useCallback } from "react";
import { keyManagementService } from "@/services/keyManagementService";
import {
  hashSHA256,
  exportPrivateKeyToBase64,
  exportPublicKeyToBase64,
  encryptPrivateKeyWithSeparateIvSalt,
} from "@/utils/encryption";

const useEncryption = (
  username: string,
  options: { useIVAndSalt: boolean },
  addEncryptionInfo: (
    info: {
      privateKey: string;
      publicKey: string;
      verificationHash?: string;
      salt?: string;
      iv?: string }) => Promise<void>) => {


  const turnOnEncryption = useCallback(async () => {

    const ms = "MS-PASSWORD";
    const selfKeys = await keyManagementService.generateKeysForUser(username);
    /**
     @param username: string

     @return keyPair
     {
       publicKey,
       privateKey
     }
     */
    const verificationHash = await hashSHA256(ms);
    /**
     * @param ms: string - Master Password value
     * @return Promise<string>
     */

    if (selfKeys.privateKey) {
      const strPrivateKey = await exportPrivateKeyToBase64(selfKeys.privateKey);
      /**
       * @param privateKey CryptoKey
       * @returns Promise<string>
       */
      const strPublicKey = await exportPublicKeyToBase64(selfKeys.publicKey);
      /**
       * @param public CryptoKey
       * @returns Promise<string>
       */

      const { encryptedPrivateKey, iv, salt } = await encryptPrivateKeyWithSeparateIvSalt(
        strPrivateKey,
        ms,
        options.useIVAndSalt
      );

      const info = {
        publicKey: strPublicKey,
        privateKey: encryptedPrivateKey,
        verificationHash,
        iv,
        salt,
      };

      await addEncryptionInfo(info);
    }
  }, [username, options, addEncryptionInfo]);

  return { turnOnEncryption };
};

export default useEncryption;
