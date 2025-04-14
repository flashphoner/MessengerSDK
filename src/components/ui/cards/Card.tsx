import React, {ReactNode, FC} from "react";
import classNames from "classnames";

type CardProps = {
  className?: string;
  title?: string;
  children: ReactNode;
};

const Card: FC<CardProps> = ({ className, children, title }) => {
  const cardClasses = classNames(
    "card py-4 px-6 rounded-sm border-0 transition-colors duration-300 mb-2 min-h-[108px]",
    className,
  );
  return (
    <div className={cardClasses}>
      {title ? <p className="font-bold mb-2 text-md text-customColors-textGray">{title}</p> : null}
      {children}
    </div>
  );
};

export default Card;
