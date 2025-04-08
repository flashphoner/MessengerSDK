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

    await keyManagementService.generateKeysForUser(username);
    const selfKeys = keyManagementService.getUserKeys(username);
    const verificationHash = await hashSHA256(ms);

    if (selfKeys?.keyPair?.privateKey) {
      const strPrivateKey = await exportPrivateKeyToBase64(selfKeys.keyPair.privateKey);
      const strPublicKey = await exportPublicKeyToBase64(selfKeys.keyPair.publicKey);

      const { encryptedPrivateKey, iv, salt } = await encryptPrivateKeyWithSeparateIvSalt(
        strPrivateKey,
        ms,
        options.useIVAndSalt
      );

      const encryptionData = {
        publicKey: strPublicKey,
        privateKey: encryptedPrivateKey,
        verificationHash,
        iv,
        salt,
      };

      await addEncryptionInfo(encryptionData);
    }
  }, [username, options, addEncryptionInfo]);

  return { turnOnEncryption };
};

export default useEncryption;
