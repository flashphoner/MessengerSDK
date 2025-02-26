import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { UserCredentialsTypes } from '@/pages/direct/Presence';
import useFingerprint from '@/hooks/helpers/useFingerprint';
import { useSDK } from '@/hooks/sdk/useSDK';

type useExampleManagerProps = {
  countUsers: number;
  serverUrl: string;
  resetTrigger?: boolean;
};

const useExampleManager = (props: useExampleManagerProps) => {
  const { countUsers, serverUrl } = props;
  const location = useLocation();
  const fingerprint = useFingerprint();
  const { initializeSdk, sdkInitialized, getFreeExampleUser, errorExample } = useSDK();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [secondConnectionToken, setSecondConnectionToken] = useState<string>();
  const [users, setUsers] = useState<Array<UserCredentialsTypes>>([]);

  const fillUsers = async () => {
    if (sdkInitialized && fingerprint && countUsers) {
      const initialUsers: UserCredentialsTypes[] = [];
      for (let i = 0; i < countUsers; i++) {
        const user = await getFreeExampleUser({ url: serverUrl, timeout: 0 });
        if (user) {
          initialUsers.push({
            url: serverUrl,
            username: user.userId,
            password: user.password,
            device: fingerprint,
            email: user.email,
          });
        }
      }
      setUsers(initialUsers);
      if (isModalOpen) {
        setIsModalOpen(false);
      }
    }
  };

  useEffect(() => {
    (async () => {
      await initializeSdk();
      await fillUsers();
    })();
  }, [location.pathname, sdkInitialized, fingerprint]);

  useEffect(() => {
    if (errorExample) {
      setIsModalOpen(true);
    }
  }, [errorExample]);

  return {
    getFreeExampleUser,
    setSecondConnectionToken,
    secondConnectionToken,
    fingerprint,
    location,
    users,
    isModalOpen,
    errorExample,
  };
};

export default useExampleManager;
