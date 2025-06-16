import { useCallback, useRef, useState } from 'react';
import { SfuExtended } from "@flashphoner/sfusdk";
import { loadSfuInstance } from "@/utils/connection";
import { CredentialsType } from "@/types/Client";
import { SDK_NOT_READY } from '@/utils/constants';
import { ConnectionType, PresenceStatus, UserEmail, UserHostKey, UserId, UserInfo, UserNickname, UserPhoneNumber, UserTimezone } from '@flashphoner/sfusdk/dist/sdk/constants';

export function useSdkConnection() {
  const sdkInstance = useRef<SfuExtended | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [sdkInitialized, setSdkInitialized] = useState<boolean>(false);
  const [selfUserInfo, setSelfUserInfo] = useState<{
    id: UserId;
    email: UserEmail;
    nickname: UserNickname;
    phoneNumber: UserPhoneNumber;
    hostKey: UserHostKey;
    timezone: UserTimezone;
    status: PresenceStatus;
    username: string;
  }>();
  const [authToken, setAuthToken] = useState<string>();
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  // INIT SDK
  const initializeSdk = useCallback(async () => {
    if (!sdkInstance.current) {
      try {
        sdkInstance.current = await loadSfuInstance();
        setSdkInitialized(true);
      } catch (error) {
        console.error("initializeSdk:", error);
      }
    }
  }, []);

  const connect = useCallback(
    async (credentials?: CredentialsType, secondConnectionToken?: string, serverUrl?: string) => {
      if (!sdkInstance.current) {
        console.error(SDK_NOT_READY);
        return;
      }
      try {
        setIsConnecting(true);
        let connectResp: {
          username: UserId;
          email: UserEmail;
          nickname: UserNickname;
          pmi: string;
          authToken: string;
        };
       if (credentials && credentials.device && serverUrl) {
         if (authToken) {
           connectResp = await sdkInstance.current.connect({
             url: serverUrl,
             username: credentials.email,
             authToken: authToken,
             device: credentials.device,
           });
         }
         else if (secondConnectionToken) {
           connectResp = await sdkInstance.current.connect({
             url: serverUrl,
             username: credentials.email,
             authToken: secondConnectionToken,
             device: credentials.device,
           });
         }
         else {
           /**
            * @param url - WebSocket URL (e.g. `wss://sfu.example.com`)
            * @param credentials - Authentication data
            * @param credentials.username - Login or e-mail
            * @param credentials.password - Plain-text password
            * @param credentials.device - Human-readable device label
            * @param details - Connection metadata
            * @param detail.id - Unique connection ID
            * @param detail.type - Connection purpose (`MAIN`, `MEETING`, `CHAT`, `MEETING_CHAT`, …)
            *
            * @returns Promise that resolves with:
            *
            * {
            *   authToken: string;
            * }
            */
           connectResp = await sdkInstance.current.connect({
             url: serverUrl,
             username: credentials.email,
             password: credentials.password,
             device: credentials.device,
             details:{
               id: credentials.username || '',
               type: ConnectionType.MAIN,
             },
           });
         }
         /**
          * {
          *   email: string,
          *   nickname: string,
          *   status: string,
          * }
          */
         const userInfoResponse = await sdkInstance.current.getUserInfo();
         if (connectResp) {
           const updatedUserInfo = {
             ...userInfoResponse,
             username: connectResp.username
           };
           setSelfUserInfo(updatedUserInfo);
           setAuthToken(connectResp.authToken);
           setIsConnecting(false);
           setIsConnected(true);
         }
       }

      } catch (error) {
        setIsConnecting(false);
        return error;
      }
    },
    [sdkInstance, sdkInitialized, authToken],
  );

  const disconnect = useCallback(async () => {
    if (sdkInstance.current && isConnected) {
      try {
        await sdkInstance.current.disconnect();
        setIsConnected(false);
      } catch (error) {
        console.error(error);
      }
    }
  }, [isConnected]);
  return {
    sdkInstance: sdkInstance.current,
    isConnecting,
    connect,
    disconnect,
    isConnected,
    selfUserInfo,
    initializeSdk,
    sdkInitialized,
    setIsConnected,
    authToken,
  };
}
