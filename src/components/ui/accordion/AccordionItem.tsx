import React, { useState, memo, useCallback, ReactNode, FC } from "react";
import Icon from '@/components/ui/icon/Icon';
import ChevronIcon from '@/assets/icons/chevron.svg';

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
        <div
          onClick={toggleOpen}
          className="w-full flex justify-between items-start focus:outline-none"
        >
          <span className="text-md font-bold mb-2 text-customColors-textGray">{title}</span>
          <Icon className={`${isOpen ? '' : 'transform rotate-180'} transition-transform duration-300`} src={ChevronIcon} size={16} />
        </div>
        {isOpen && <div>{children}</div>}
      </div>
    );
  },
);

AccordionItem.displayName = "AccordionItem";
export default AccordionItem;
