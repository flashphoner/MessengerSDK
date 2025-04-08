import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
} from '@floating-ui/react';

const Tooltip: React.FC<{
  message: string;
  children: React.ReactNode;
  btnText?: string;
  onClickBtn?: () => void;
}> = ({ message, children, btnText, onClickBtn }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(20), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, {
    move: true,
    restMs: 100,
    delay: { open: 0, close: 100 },
  });

  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  const handleClickBtn = () => {
    if (onClickBtn) {
      onClickBtn();
    }
    setIsOpen(false);
  };

  return (
      <>
        <div
            ref={refs.setReference}
            {...getReferenceProps()}
            className="cursor-pointer flex items-center space-x-3 relative z-10"
        >
          {children}
        </div>

        {isOpen &&
            ReactDOM.createPortal(
                <div
                    ref={refs.setFloating}
                    style={floatingStyles}
                    {...getFloatingProps()}
                    className="bg-gray-800 text-white text-sm rounded-lg shadow-lg p-4 max-w-sm w-max break-words whitespace-normal z-[9999] fixed top-0 left-0"
                >
                  <p className='font-normal'>{message}</p>
                  {btnText && (
                      <button
                          className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded font-normal"
                          onClick={handleClickBtn}
                      >
                        {btnText}
                      </button>
                  )}
                </div>,
                document.body
            )}
      </>
  );
};

export default Tooltip;
