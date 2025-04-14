import React, { useState, FC, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Internal deps
import NotFound from '@/components/ui/404Error/NotFound';
import ServerURLInput from '@/components/ui/serverUrlInput/ServerURLInput';
import MainLayout from '@/components/layouts/MainLayout';
import Friends from "@/pages/direct/Friends";
import OneToOneChat from "@/pages/direct/OneToOneChat";
import Presence from "@/pages/direct/Presence";
import GroupChat from "@/pages/direct/GroupChat";
import ChangeNickName from "@/pages/direct/ChangeNickName";
import AccessRights from "@/pages/spaces/AccessRights";
import Contacts from "@/pages/spaces/Contacts";
import PresenceActivity from '@/pages/direct/PresenceActivity';
import UpgradeSecurity from '@/pages/encryption/UpgradeSecurity';
import EncryptedChat from '@/pages/encryption/EncryptedChat';
import EncryptedGroupChat from '@/pages/encryption/EncryptedGroupChat';

const MainRoutes: FC = () => {
  const location = useLocation();
  const [serverUrl, setServerUrl] = useState<string>("");
  const [headerTitle, setHeaderTitle] = useState<string>("");
  const [isSecondConnectionAvailable, setIsSecondConnectionAvailable] = useState<boolean>(false);
  const [isShowSecondConnection, setIsShowSecondConnection] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // New state to handle loading

  const handleChangeServerUrl = (url: string) => {
    setServerUrl(url);
    localStorage.setItem("serverUrl", url);
  };

  const handleToggleSecondConnection = () => {
    setIsShowSecondConnection(!isShowSecondConnection);
  };

  const isCanUseSecondConnection = () => {
    setIsSecondConnectionAvailable(true);
  };

  useEffect(() => {
    // Check if server URL is already in localStorage
    const storedUrl = localStorage.getItem("serverUrl");
    if (storedUrl) {
      setServerUrl(storedUrl); // Set serverUrl from localStorage
    }

    // Simulate loading state to avoid flicker (only if serverUrl is empty)
    setIsLoading(false);

    // Reset second connection states on pathname change
    setIsShowSecondConnection(false);
    setIsSecondConnectionAvailable(false);
  }, [location.pathname]);

  return (
    <>
      {
        isLoading ? ( // Show loading state initially to avoid flicker
          <div>Loading...</div>
        ) : serverUrl ? (
          <Routes>
            <Route path="/" element={
              <MainLayout
                serverUrl={serverUrl}
                isSecondConnectionAvailable={isSecondConnectionAvailable}
                onToggleSecondConnection={handleToggleSecondConnection}
                onChangeServerUrl={handleChangeServerUrl}
                isShowSecondConnection={isShowSecondConnection}
              />
            }>
              <Route
                index
                element={
                  <Friends
                    serverUrl={serverUrl}
                    handleSetDynamicTitle={setHeaderTitle}
                    isCanUseSecondConnection={isCanUseSecondConnection}
                    isShowSecondConnection={isShowSecondConnection}
                  />
                }
              />
              <Route
                path="Presence"
                element={
                  <Presence
                    serverUrl={serverUrl}
                    handleSetDynamicTitle={setHeaderTitle}
                    isCanUseSecondConnection={isCanUseSecondConnection}
                    isShowSecondConnection={isShowSecondConnection}
                  />
                }
              />
              <Route
                path="PresenceActivity"
                element={
                  <PresenceActivity
                    serverUrl={serverUrl}
                    handleSetDynamicTitle={setHeaderTitle}
                    isCanUseSecondConnection={isCanUseSecondConnection}
                    isShowSecondConnection={isShowSecondConnection}
                  />
                }
              />
              <Route
                path="Contacts"
                element={
                  <Contacts
                    serverUrl={serverUrl}
                    handleSetDynamicTitle={setHeaderTitle}
                    isCanUseSecondConnection={isCanUseSecondConnection}
                    isShowSecondConnection={isShowSecondConnection}
                  />
                }
              />
              <Route
                path="OneToOneChat"
                element={
                  <OneToOneChat
                    serverUrl={serverUrl}
                    handleSetDynamicTitle={setHeaderTitle}
                    isCanUseSecondConnection={isCanUseSecondConnection}
                    isShowSecondConnection={isShowSecondConnection}
                  />
                }
              />
              <Route
                path="GroupChat"
                element={
                  <GroupChat
                    serverUrl={serverUrl}
                    handleSetDynamicTitle={setHeaderTitle}
                    isCanUseSecondConnection={isCanUseSecondConnection}
                    isShowSecondConnection={isShowSecondConnection}
                  />
                }
              />
              <Route
                path="ChangeNickname"
                element={
                  <ChangeNickName
                    serverUrl={serverUrl}
                    handleSetDynamicTitle={setHeaderTitle}
                    isCanUseSecondConnection={isCanUseSecondConnection}
                    isShowSecondConnection={isShowSecondConnection}
                  />
                }
              />
              <Route
                path="AccessRights"
                element={
                  <AccessRights
                    serverUrl={serverUrl}
                    handleSetDynamicTitle={setHeaderTitle}
                    isCanUseSecondConnection={isCanUseSecondConnection}
                    isShowSecondConnection={isShowSecondConnection}
                  />
                }
              />
              <Route
                path="UpgradeSecurity"
                element={
                  <UpgradeSecurity
                    serverUrl={serverUrl}
                    handleSetDynamicTitle={setHeaderTitle}
                    isCanUseSecondConnection={isCanUseSecondConnection}
                    isShowSecondConnection={isShowSecondConnection}
                  />
                }
              />
              <Route
                path="EncryptedChat"
                element={
                  <EncryptedChat
                    serverUrl={serverUrl}
                    handleSetDynamicTitle={setHeaderTitle}
                    isCanUseSecondConnection={isCanUseSecondConnection}
                    isShowSecondConnection={isShowSecondConnection}
                  />
                }
              />
              <Route
                path="EncryptedGroupChat"
                element={
                  <EncryptedGroupChat
                    serverUrl={serverUrl}
                    handleSetDynamicTitle={setHeaderTitle}
                    isCanUseSecondConnection={isCanUseSecondConnection}
                    isShowSecondConnection={isShowSecondConnection}
                  />
                }
              />
            </Route>
            <Route path="*" element={ <NotFound /> } />
          </Routes>
        ) : (
          <ServerURLInput onUrlChange={handleChangeServerUrl} />
        )
      }
    </>
  );
};

export default MainRoutes;
