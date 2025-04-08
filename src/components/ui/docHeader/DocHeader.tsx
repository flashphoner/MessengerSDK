import React from "react";
import BurgerArrowIcon from '@/assets/icons/burger-arrow-left.svg';

export type DocsHeaderProps = {
  /** Flag: whether the panel is open or collapsed */
  docsOpen?: boolean;
  /** Callback triggered when the icon is clicked to toggle the panel */
  onClickCollapse?: () => void;
};

function DocHeader({ docsOpen = false, onClickCollapse }: DocsHeaderProps) {
  return (
    <header className="pl-4 pt-2 pb-2 flex items-center justify-between">
      {/* Display title when docs are open */}
      {docsOpen && (
        <p className="text-md text-gray-600 mr-2">User Interface Guide</p>
      )}

      {/* Collapse icon button */}
      {onClickCollapse && <div className="cursor-pointer mr-4" onClick={onClickCollapse}>
        <img
          src={BurgerArrowIcon}
          alt="toggle docs"
          className={`transition-transform duration-200 ${docsOpen ? 'rotate-0' : 'rotate-180'}`}
        />
      </div>}
    </header>
  );
}

export default DocHeader;
