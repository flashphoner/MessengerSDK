import { useCallback, useEffect } from 'react';
import { CredentialsType } from '@/types/Client';

type Credentials = {
  userCredentials: CredentialsType;
  sharedToken?: string;
  authToken?: string;
};

type UseConnectWithCredentialsProps = {
  credentials: Credentials;
  connect: (userCredentials: CredentialsType, token?: string, serverUrl?: string) => Promise<void> | Promise<unknown>;
  sdkInitialized: boolean;
  initializeSdk: () => Promise<void>;
  serverUrl: string;
};

const useConnectWithCredentials = (props: UseConnectWithCredentialsProps) => {
  const {
    credentials,
    connect,
    sdkInitialized,
    initializeSdk,
    serverUrl,
  } = props;

  const { userCredentials, sharedToken, authToken } = credentials;

  const connectWithCredentials = useCallback(async (): Promise<void> => {
    try {
     if (serverUrl) {
       if (authToken) {
         await connect(userCredentials, authToken, serverUrl);
       } else if (sharedToken) {
         await connect(userCredentials, sharedToken, serverUrl);
       } else {
         await connect(userCredentials, '', serverUrl);
       }
     }
    } catch (error) {
      console.error("Failed to connect: ", error);
    }
  }, [sdkInitialized, userCredentials, sharedToken, authToken, serverUrl]);

  // init SDK
  useEffect(() => {
    (async () => await initializeSdk())();
  }, []);

  return { connectWithCredentials };
};

export default useConnectWithCredentials;
