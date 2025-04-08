import React, { FC, useState } from 'react';

export type EncryptionOptions = {
  useIVAndSalt: boolean;
}

type Props = {
  onOptionsChange: (options: EncryptionOptions) => void;
  isDisabled?: boolean;
}

const EncryptionOptionsForm: FC<Props> = ({ onOptionsChange, isDisabled }) => {
  const [useIV, setUseIV] = useState(false);

  const handleChangeOptions = (checked: boolean) => {
    setUseIV(checked);
    onOptionsChange({ useIVAndSalt: checked });
  };

  return (
    <div>
      <p className="text-md font-bold">Encryption Options</p>
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-xs">
          <input
            disabled={isDisabled}
            type="checkbox"
            checked={useIV}
            onChange={(e) => handleChangeOptions(e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 text-xs"
          />
          Use Initialization Vector and Salt
        </label>
      </div>
    </div>
  );
};

export default EncryptionOptionsForm;
