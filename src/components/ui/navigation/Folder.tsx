// Internal deps
import React, { useEffect, useState, FC } from "react";
import classNames from "classnames";
import { Link, useLocation } from "react-router-dom";
import { FaFolder, FaFolderOpen } from "react-icons/fa";

export type FolderProps = {
  title: string;
  pages: { name: string; path: string }[];
};

const Folder: FC<FolderProps> = ({ title, pages }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Check if any of the pages is the current location
  useEffect(() => {
    if (pages.some((page) => page.path === location.pathname)) {
      setIsOpen(true);
    }
  }, [location.pathname, pages]);

  const folderHeaderClasses = "flex items-center cursor-pointer";
  const pageLinkClasses = (isActive: boolean) =>
    classNames("block py-1 hover:text-white", {
      "text-white font-bold": isActive,
      "text-gray-300": !isActive,
    });

  return (
    <div className="mb-4">
      <div className={folderHeaderClasses} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <FaFolderOpen className="mr-2" />
        ) : (
          <FaFolder className="mr-2" />
        )}
        <span>{title}</span>
      </div>
      {isOpen && (
        <div className="ml-6 mt-2">
          {pages.map((page) => (
            <Link
              key={page.path}
              to={page.path}
              className={pageLinkClasses(location.pathname === page.path)}
            >
              {page.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Folder;
