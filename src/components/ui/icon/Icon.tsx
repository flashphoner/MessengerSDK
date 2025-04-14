import React from 'react';

type IconProps = {
  src: React.FC<React.SVGProps<SVGSVGElement>> | string;
  className?: string;
  size?: number;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  onClick?: () => void;
};

const Icon: React.FC<IconProps> = (props) => {
  const {
    src,
    className = '',
    size = 16,
    fillColor = 'none',
    strokeColor = 'none',
    strokeWidth = 1,
    onClick
  } = props;

  const SvgIcon = src as React.FC<React.SVGProps<SVGSVGElement>>;

  return (
    <SvgIcon
      className={`cursor-pointer ${className}`}
      width={size}
      height={size}
      fill={fillColor}
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      onClick={onClick}
    />
  );
};

export default Icon;
