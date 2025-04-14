import React, { FC } from "react";
import ActionButton from "@/components/ui/buttons/ActionButton";
import Tooltip from '@/components/ui/tooltip/Tooltip';
import { UNSAFE_SELF_USER_TXT } from '@/utils/constants';
import UnsafeIconUrl from '@/assets/icons/unsafe.svg';
import Icon from '@/components/ui/icon/Icon';

type AlertModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  onOk?: () => void;
  title?: string;
  message: string | null;
  width?: string;
  isActionButtons?: boolean;
};

const AlertModal: FC<AlertModalProps> = ({ isOpen, title = "Warning!", message, onClose, onOk, width = "max-w-md", isActionButtons = false}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div
        className={`relative bg-white p-4 rounded-lg shadow-lg ${width} text-center z-10`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          {isActionButtons && <div className="flex items-center">
            {<Tooltip message={`${UNSAFE_SELF_USER_TXT}`}>
              <div className="flex items-center space-x-2 cursor-pointer mr-1">
                {<Icon src={UnsafeIconUrl} size={20} />}
              </div>
            </Tooltip>}
          </div> }
          <p className="text-lg font-semibold">{title}</p>
          { isActionButtons && (
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              x
            </button>
          ) }
        </div>

        <p className="text-gray-600 mb-6 max-w-md break-words whitespace-normal text-xs">{message}</p>

        {isActionButtons && (
          <div className="flex justify-between">
            <ActionButton onClick={onClose}>
              Cancel
            </ActionButton>
            <ActionButton onClick={onOk}>
              Send
            </ActionButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertModal;
