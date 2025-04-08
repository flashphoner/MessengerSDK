// src/components/ui/navigation/SideBar/index.tsx
import React, { FC, useRef, useState, useEffect } from "react";
import { useLayoutStore } from "@/hooks/helpers/useLayoutStore";
import { toggleSidebarOpen } from "@/stores/layoutStore";

import Folder from "./Folder";
import { FoldersData } from "./SideBarData";
import BurgerArrowIcon from '@/assets/icons/burger-arrow-left.svg';

const Sidebar: FC = () => {
  // Global flag: sidebar open/closed
  const sidebarOpen = useLayoutStore(state => state.sidebarOpen);

  // Sidebar width: 60px when closed, 256px when open
  const sidebarWidth = sidebarOpen ? "256px" : "60px";

  // Ref for the container rendering folder list
  const contentRef = useRef<HTMLDivElement>(null);

  // Local state for maxHeight to animate the list height
  const [maxHeight, setMaxHeight] = useState<number>(0);

  // Calculate content height when sidebarOpen changes
  useEffect(() => {
    if (sidebarOpen) {
      const scrollH = contentRef.current?.scrollHeight || 0;
      setMaxHeight(scrollH * 4);  // expand to the real height
    } else {
      setMaxHeight(0);       // collapse to 0
    }
  }, [sidebarOpen]);

  return (
    <div
      className={`
        min-h-screen
        border-r border-customColors-borderGrey
        bg-customColors-sidebarGrey
        flex-shrink-0
        transition-width duration-300 ease-in-out
        overflow-hidden
        bg-customColors-sideBarGrey
      `}
      style={{ width: sidebarWidth }}
    >
      {/* Sidebar header */}
      <div className="py-4 px-4 font-normal border-b bg-color-white flex items-center justify-between bg-white">
        {/* Show title when sidebar is open */}
        {sidebarOpen && <span>API Samples</span>}

        {/* Toggle button */}
        <button onClick={toggleSidebarOpen} className="mt-1">
          <img
            src={BurgerArrowIcon}
            alt="toggle sidebar"
            className={`transition-transform duration-200 ${sidebarOpen ? 'rotate-0' : 'rotate-180'}`}
          />
        </button>
      </div>

      {/*
        Content (folder list).
        Keep in the DOM but animate height and opacity.
      */}
      <div
        ref={contentRef}
        className={`
          p-4 calc-main-height
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          maxHeight,
          overflowY: 'auto', // scroll will appear if content is too large
        }}
      >
        {FoldersData.map((folder) => (
          <Folder
            key={folder.title}
            title={folder.title}
            pages={folder.pages}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
