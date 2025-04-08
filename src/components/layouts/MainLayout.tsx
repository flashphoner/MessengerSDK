// src/layouts/MainLayout.tsx
import React, { FC } from 'react';
import Sidebar from "@/components/ui/navigation/SideBar";
import Header from "@/components/ui/header/Header";
import { Outlet } from 'react-router-dom';

type MainLayoutProps = {
  serverUrl: string;
  headerTitle: string;
  isSecondConnectionAvailable: boolean;
  onToggleSecondConnection: () => void;
  onChangeServerUrl: (url: string) => void;
  isShowSecondConnection: boolean;
};

const MainLayout: FC<MainLayoutProps> = (props) => {
  const {
    serverUrl,
    headerTitle,
    isSecondConnectionAvailable,
    onToggleSecondConnection,
    onChangeServerUrl,
    isShowSecondConnection
  } = props;

  return (
    <div className="layout flex h-screen">
      {/* left block - Sidebar */}
      <Sidebar />

      {/* right block – Header + Outlet */}
      <div className="custom-scrollbar flex-grow overflow-x-auto overflow-y-hidden">
        <Header
          title={headerTitle}
          serverUrl={serverUrl}
          isSecondConnectionAvailable={isSecondConnectionAvailable}
          onToggleSecondConnection={onToggleSecondConnection}
          onChangeServerUrl={onChangeServerUrl}
          isShowSecondConnection={isShowSecondConnection}
        />
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
