// Internal deps
import React, { useEffect, useState, FC } from "react";
import classNames from "classnames";
import { Link, useLocation } from "react-router-dom";
import ChevronIcon from '@/assets/icons/chevron.svg';

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

  const folderHeaderClasses = "flex items-center cursor-pointer justify-between";
  const pageLinkClasses = (isActive: boolean) =>
    classNames("block py-1 hover:text-customColors-textBlue text-md", {
      "text-customColors-textBlue": isActive,
      "text-customColor-grey": !isActive,
    });

  return (
    <div className="mb-4">
      <div className={folderHeaderClasses} onClick={() => setIsOpen(!isOpen)}>
        <span className="font-bold">{title}</span>
        {
          <img
            src={ChevronIcon}
            width="16px"
            height="16px"
            alt="safe"
            className={`${isOpen ? '' : 'transform rotate-180'} transition-transform duration-300`}
          />
        }
      </div>
      {isOpen && (
        <div className="mt-2">
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
