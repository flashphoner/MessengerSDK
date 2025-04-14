import React, { useRef, useEffect, useState, Dispatch, SetStateAction } from 'react';
import classNames from "classnames";

// Icons
import ChevronRegular from '@/assets/icons/chevronRegular.svg';
import Icon from '@/components/ui/icon/Icon';

type ConnectionCardsHeaderProps = {
  isConnected: boolean;
  isConnecting?: boolean;
  onConnect: () => void;
  isDisconnected: boolean;
  onDisconnect?: () => void;
  showMenu: boolean;
  setShowMenu: Dispatch<SetStateAction<boolean>>;
};

const ConnectionCardsHeader = (props : ConnectionCardsHeaderProps) => {
  const {
    isConnected,
    isConnecting,
    onConnect,
    onDisconnect,
    showMenu,
    setShowMenu,
  } = props;

  const [isDisconnected, setIsDisconnected] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setShowMenu(prev => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [setShowMenu]);

  const handleMainClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (isConnecting) return;

    if (isConnected || isDisconnected) {
      toggleMenu();
    } else {
      onConnect();
    }
  };

  const handleDisconnect = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onDisconnect) {
      onDisconnect();
    }
    setIsDisconnected(true); // after disconnect
    setShowMenu(false);
  };

  const handleReconnect = (event: React.MouseEvent) => {
    event.stopPropagation();
    onConnect();
    setIsDisconnected(false);
    setShowMenu(false);
  };

  return (
    <div className="flex items-center w-full rounded-md relative">
      <button
        onClick={handleMainClick}
        className={classNames(
          'group w-full items-center py-2 rounded-md font-bold px-4 flex justify-center text-sm transition duration-200 ease-in-out relative',
          {
            'text-customColors-green cursor-not-allowed': isConnecting,
            'bg-white text-customColors-green hover:bg-customColors-lightGreenHover': isConnected,
            'bg-white hover:bg-customColors-lightRedHover': isDisconnected,
            'bg-customColors-green hover:bg-customColors-lightGreenHover text-white': !isConnected && !isDisconnected,
          }
        )}
        disabled={isConnecting}
      >
        {isConnecting ? (
          <span className="w-4 h-4 my-0.5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
        ) : isConnected ? (
          <span className="flex items-center gap-1">
            Connected
            <Icon
              src={ChevronRegular}
              size={10}
              className={`transition-transform duration-200 ${showMenu ? 'rotate-180 mb-1' : 'rotate-0 mt-0.5'}`}
            />
          </span>
        ) : isDisconnected ? (
          <span className="flex items-center gap-1 text-customColors-red">
            Disconnected
            <Icon
              src={ChevronRegular}
              size={10}
              strokeColor='#F04747'
              className={`transition-transform duration-200 ${showMenu ? 'rotate-180 mb-1' : 'rotate-0 mt-0.5'}`}
            />
          </span>
        ) : (
          <span className="text-white group-hover:text-customColors-green transition duration-200">
            Connect
          </span>
        )}
      </button>

      {showMenu && (isConnected || isDisconnected) && (
        <div
          ref={menuRef}
          className="absolute flex flex-col text-center top-[40px] z-50 left-0 right-0 bg-white border rounded-[12px] border-gray-200 shadow-lg text-sm overflow-hidden"
        >
          {isConnected ? (
            <>
              <span className='pb-2 pt-2'>
                Connected the server
              </span>
              <button
                onClick={handleDisconnect}
                className="py-2 font-normal text-md hover:bg-customColors-lightGrayBg whitespace-nowrap"
              >
                Disconnect the server
              </button>
            </>
          ) : (
            <>
              <span className='pb-2 pt-2'>
                Disconnected the server
              </span>
              <button
                onClick={handleReconnect}
                className="pr-4 py-2 font-normal text-md hover:bg-customColors-lightGrayBg whitespace-nowrap"
              >
                Connect to the server
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectionCardsHeader;
