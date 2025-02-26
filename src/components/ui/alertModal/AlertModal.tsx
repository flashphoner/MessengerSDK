// External deps
import React, {FC} from 'react';

type AlertModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  message: string | null;
  timeLeft?: string;
};

const AlertModal: FC<AlertModalProps> = (props) => {
  const { isOpen, title = "Warning!", message } = props;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
        <p className="text-xl font-semibold mb-4 text-yellow-500">{title}</p>
        <p className="text-gray-600 mb-6">{message}</p>
      </div>
    </div>
  );
};

export default AlertModal;
