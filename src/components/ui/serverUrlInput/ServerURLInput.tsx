import React, { useState, useEffect, ChangeEvent, KeyboardEvent, FC } from 'react';
import { useNavigate } from "react-router-dom";
import StyledInput from '@/components/ui/styledInput/StyledInput';
import ActionButton from '@/components/ui/buttons/ActionButton';
import { checkServerAvailability } from '@/utils/helpers';
import { isValidUrl } from '@/utils/validations';

type UrlInputProps = {
  onUrlChange: (url: string) => void;
};

const ServerURLInput: FC<UrlInputProps> = ({ onUrlChange }) => {
  const [url, setUrl] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();



  useEffect(() => {
    const savedUrl = localStorage.getItem("serverUrl");
    if (savedUrl) {
      setUrl(savedUrl);
      onUrlChange(savedUrl);
    }
  }, [onUrlChange]);

  const handleUrlSubmit = async () => {
    if (!isValidUrl(url)) {
      setErrorMessage('Incorrect address');
      return;
    }

    setErrorMessage(null);
    checkServerAvailability(url)
      .then((isAvailable) => {
        if (isAvailable) {
          localStorage.setItem("serverUrl", url);
          onUrlChange(url);
          navigate("/");
        } else {
          setErrorMessage('Incorrect address');
        }
      })
      .catch((error) => {
        console.log('Error:', error.message);
        setErrorMessage('Server not available');
      });
  };

  const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      await handleUrlSubmit();
    }
  };

  const handleOnChangeInputUrl = (event: ChangeEvent<HTMLInputElement>) => {
    const {value} = event.target;
    if (!value.length) {
      setErrorMessage(null);
    } else if (!isValidUrl(value)) {
      setErrorMessage("Incorrect address");
    } else if (errorMessage) {
      setErrorMessage(null);
    }
    setUrl(event.target.value);
  };

  return (
    <div className="h-screen flex items-center justify-center w-full bg-gray-800">
      <div className="flex flex-col justify-items-center align-items-start w-80">
        <div className="flex items-center">
          <StyledInput
            value={url}
            onChange={handleOnChangeInputUrl}
            onKeyDown={handleKeyDown}
            placeholder="Enter server url"
            className={'w-full p-2 bg-gray-900 text-white border rounded-md'}
          />
          <ActionButton
            isDisabled={!isValidUrl(url)}
            onClick={handleUrlSubmit}
            className="px-4 bg-white text-black ml-2 h-6"
          >
            Save
          </ActionButton>
        </div>
        <div className="text-red-500 text-xs mt-1 ml-1 h-2">{errorMessage}</div>
      </div>
    </div>
  );
};

export default ServerURLInput;
