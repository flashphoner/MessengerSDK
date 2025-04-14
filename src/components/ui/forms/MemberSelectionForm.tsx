import React, { FC, useState } from 'react';
import { PresenceStatus } from '@flashphoner/sfusdk/dist/sdk/constants';
import { AvatarBadge } from '@/components/ui/avatarBadge/AvatarBadge';
import SafeIconUrl from '@/assets/icons/safe.svg';
import UnsafeIconUrl from '@/assets/icons/unsafe.svg';
import Toggle from '@/components/ui/toggle/Toggle';
import Tooltip from '@/components/ui/tooltip/Tooltip';
import {
  SAFE_USER_TXT,
  UNSAFE_USER_ASK_TXT,
  UNSAFE_USER_ASK_TXT_END,
  UNSAFE_USER_TXT,
} from '@/utils/constants';
import ActionButton from '@/components/ui/buttons/ActionButton';
import Icon from '@/components/ui/icon/Icon';

export type SelectedContactType = {
  userId: string;
  nickname: string;
  friend: boolean;
  status: PresenceStatus;
  publicKey?: string;
  encryptionEnabled?: boolean;
};

export type MemberSelectionFormProps = {
  selfContacts: SelectedContactType[];
  onAction?: (selectedMembers: string[]) => void;
  isActionDisabled?: boolean;
  isHeader?: boolean;
  isTitle?: boolean;
  isCheckBox?: boolean;
  btnTxt?: string;
  askToUpgradeProfile?: (userId: string) => void;
  countUsers?: number;
};

const MemberSelectionForm: FC<MemberSelectionFormProps> = (props) => {
  const {
    selfContacts,
    onAction,
    isHeader = false,
    isCheckBox = false,
    btnTxt,
    askToUpgradeProfile,
    isActionDisabled,
    countUsers,
  } = props;

  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const handleChangeSelectedMember = (userId: string, isSelected: boolean): void => {
    setSelectedMembers((prev) =>
      isSelected ? [...prev, userId] : prev.filter((id) => id !== userId)
    );
  };

  const handleTooltipAction = (userId: string) => {
    if (askToUpgradeProfile) {
      askToUpgradeProfile(userId);
    }
  };

  const renderContacts = (): JSX.Element[] | JSX.Element => {
    if (selfContacts.length === 0) {
      return <p className="text-gray-500 text-sm">No contacts available</p>;
    }

    return selfContacts.map((contact) => (
      <div key={contact.userId} className="mt-1 mb-1 flex items-center gap-2">
        {isCheckBox && (
          <div className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={selectedMembers.includes(contact.userId)}
              onChange={(e) => handleChangeSelectedMember(contact.userId, e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 w-4 h-4"
            />
            <div className="relative">
              <AvatarBadge name={contact.nickname} size="extraSmall" />
            </div>
          </div>
        )}

        <div className="flex">
          <p className="text-xs text-gray-500">@{contact.userId}</p>
        </div>

        <Tooltip
          message={
            contact.encryptionEnabled
              ? `${contact.nickname} ${SAFE_USER_TXT}`
              : `${contact.nickname} ${UNSAFE_USER_TXT} ${UNSAFE_USER_ASK_TXT} ${contact.nickname} ${UNSAFE_USER_ASK_TXT_END}`
          }
          onClickBtn={() => handleTooltipAction(contact.userId)}
          btnText={contact.encryptionEnabled ? undefined : 'Ask'}
        >
          <div className="flex items-center space-x-2 cursor-pointer mr-1 z-1">
            <Icon
              src={contact.encryptionEnabled ? SafeIconUrl : UnsafeIconUrl}
              size={20}
            />
          </div>
        </Tooltip>
      </div>
    ));
  };

  const isDisabledByCount = countUsers
    ? selectedMembers.length !== countUsers
    : selectedMembers.length < 2;

  const finalIsDisabled = isActionDisabled || isDisabledByCount;

  return (
    <div>
      {isHeader && (
        <div className="flex justify-between items-center mb-2 mt-2">
          <Toggle
            label="End to End Encryption"
            enabled={true}
            onToggle={() => {}}
          />
        </div>
      )}

      {renderContacts()}

      {btnTxt && onAction && (
        <ActionButton
          className="text-customColors-textBlue mt-2"
          onClick={() => onAction(selectedMembers)}
          isDisabled={finalIsDisabled}
        >
          {btnTxt}
        </ActionButton>
      )}
    </div>
  );
};

export default MemberSelectionForm;
