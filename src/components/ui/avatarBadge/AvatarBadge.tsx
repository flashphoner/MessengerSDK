// External deps
import React, { useMemo, FC} from "react";
import classNames from "classnames";

export type Status = "ONLINE" | "IDLE" | "DO_NOT_DISTURB" | "OFFLINE";

type AvatarBadgeProps = {
  name: string;
  badgeContent?: string;
  status?: Status;
  size?: "extraSmall" | "small" | "medium" | "large";
  hideUserStatus?: boolean;
};

const corporateColors: string[] = [
  "#10B5E9",
  "#7A3CFF",
  "#E67E22",
  "#E74C3C",
  "#1ABC9C",
  "#21B275",
  "#1066E9",
  "#E91E63",
  "#F1C40F",
];

const getStatusBadgeColor = (status: Status): string => {
  const statusColors: { [key in Status]: string } = {
    ONLINE: "bg-customColors-green",
    IDLE: "bg-customColors-yellow",
    DO_NOT_DISTURB: "bg-customColors-red",
    OFFLINE: "bg-customColors-gray",
  };
  return statusColors[status] || "bg-gray-500";
};

const getInitials = (name: string): string => {
  return name ? name.charAt(0).toUpperCase() : "";
};

const getAvatarColor = (name: string): string => {
  const hashName = (name: string): number => {
    let hash = 5381;
    for (let i = 0; i < name.length; i++) {
      hash = (hash * 33) ^ name.charCodeAt(i);
    }
    return Math.abs(hash);
  };

  const uniqueCode = hashName(name) % corporateColors.length;
  return corporateColors[uniqueCode];
};



const getAvatarSizeClasses = (
  size: "extraSmall" |"small" | "medium" | "large",
): { avatar: string; badge: string } => {
  switch (size) {
    case "extraSmall":
      return { avatar: "w-4 h-4 text-xs", badge: "w-1 h-1" };
    case "small":
      return { avatar: "w-8 h-8 text-xs", badge: "w-2.5 h-2.5" };
    case "medium":
      return { avatar: "w-12 h-12 text-lg", badge: "w-3 h-3" };
    case "large":
    default:
      return { avatar: "w-16 h-16 text-xl", badge: "w-4 h-4" };
  }
};

export const AvatarBadge: FC<AvatarBadgeProps> = ({
  name,
  badgeContent,
  status = "OFFLINE",
  size = "medium",
  hideUserStatus = false
}) => {
  const initials = useMemo(() => getInitials(name), [name]);
  const avatarBgColor = useMemo(() => getAvatarColor(name), [name]);
  const { avatar: avatarSizeClasses, badge: badgeSizeClasses } = useMemo(
    () => getAvatarSizeClasses(size),
    [size, status],
  );
  const statusBadgeColor = getStatusBadgeColor(status);
  return (
    <div className="relative inline-block">
      <div
        className={classNames(
          "rounded-full flex items-center justify-center text-white font-normal",
          avatarSizeClasses,
        )}
        style={{ backgroundColor: avatarBgColor }}
      >
        {initials}
      </div>
      {!hideUserStatus && <span
        className={classNames(
          'absolute bottom-0 right-0 rounded-full',
          badgeSizeClasses,
          statusBadgeColor
        )}
      /> }

      {badgeContent && (
        <span
          className={classNames(
            "absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-1.5 py-0.5",
          )}
        >
          {badgeContent}
        </span>
      )}
    </div>
  );
};
