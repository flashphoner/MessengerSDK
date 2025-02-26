// External deps
import React, {FC} from "react";

// Local deps
import Folder from "./Folder";
import { FoldersData } from "./SideBarData";

const Sidebar: FC = () => {
  // Fixed width to prevent resizing
  const sidebarContainerClasses =
    "w-64 min-h-screen h-full bg-gray-800 text-white flex-shrink-0";
  const headerClasses = "p-4 font-bold text-lg border-b border-gray-700";
  const folderContainerClasses = "p-4 overflow-y-auto calc-main-height";

  return (
    <div className={sidebarContainerClasses}>
      <div className={headerClasses}>Samples</div>
      <div className={folderContainerClasses}>
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
