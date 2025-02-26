// External deps
import React, {FC} from 'react';
import {useNavigate} from 'react-router-dom';

// Internal deps
import ActionButton from '@/components/ui/buttons/ActionButton';

const NotFound: FC = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/');
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <p className="text-6xl font-extrabold text-red-600 mb-4">404</p>
        <p className="text-xl text-gray-700 mb-8">Oops! The page you are looking for doesn&apos;t exist.</p>
        <p className="text-lg text-gray-500 mb-4">
        It seems that the page you were trying to reach is not available.
        </p>
        <ActionButton
          onClick={handleRedirect}
          text={"Home Page"}
        />
      </div>
    </div>
  );
};

export default NotFound;
