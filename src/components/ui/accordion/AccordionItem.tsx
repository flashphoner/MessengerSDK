import React, { useState, memo, useCallback, ReactNode, FC } from "react";

type AccordionItemProps = {
  title: string;
  children: ReactNode;
};

const AccordionItem: FC<AccordionItemProps> = memo(
  ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), []);

    return (
      <div className="rounded-md mb-2">
        <button
          onClick={toggleOpen}
          className="w-full flex justify-between items-center text-left text-gray-800 focus:outline-none"
        >
          <span className="text-md font-bold">{title}</span>
          <svg
            className={`w-3 h-3 text-gray-600 transform transition-transform duration-200 ${isOpen ? "rotate-90" : "-rotate-90"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 01.707 1.707L5.414 10l5.293 5.293a1 1 0 01-1.414 1.414l-6-6a1 1 0 010-1.414l6-6A1 1 0 0110 3z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {isOpen && <div>{children}</div>}
      </div>
    );
  },
);

AccordionItem.displayName = "AccordionItem";
export default AccordionItem;
