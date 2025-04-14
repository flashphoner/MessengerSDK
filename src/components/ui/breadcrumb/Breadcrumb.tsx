import React from 'react';
import Icon from '@/components/ui/icon/Icon';
import Chevron from '@/assets/icons/chevronCrumb.svg';

export type BreadcrumbItem = {
  label: string;
  href?: string; // Optional href for clickable breadcrumb items
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-gray-600">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center">
              {/* If this is not the last item, display as a normal breadcrumb.
                  If item has href, make it a clickable <a> tag, otherwise just a <span>.
              */}
              {!isLast ? (
                item.href ? (
                  <a
                    href={item.href}
                    className="font-normal hover:underline hover:text-customColors-textGray"
                  >
                    {item.label}
                  </a>
                ) : (
                  <span className="font-normal text-customColors-lightGray">{item.label}</span>
                )
              ) : (
                // The last item is bold and non-clickable
                <span className="font-normal text-customColors-textGray">{item.label}</span>
              )}

              {/* Separator (shown except for the last item) */}
              {!isLast && (
                <Icon src={Chevron} size={10} className={'ml-2'}/>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
