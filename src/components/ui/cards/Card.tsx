import React, {ReactNode, FC} from "react";
import classNames from "classnames";

type CardProps = {
  className?: string;
  children: ReactNode;
};

const Card: FC<CardProps> = ({ className, children }) => {
  const cardClasses = classNames(
    "card p-2 rounded-md transition-colors duration-300 mb-4 min-h-[150]",
    className,
  );
  return <div className={cardClasses}>{children}</div>;
};

export default Card;
