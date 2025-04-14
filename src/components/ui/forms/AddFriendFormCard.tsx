// External deps
import React, {
  useState,
  FC,
  ChangeEvent,
  useEffect,
} from "react";

// Internal deps
import StyledInput from "@/components/ui/styledInput/StyledInput";
import ActionButton from "@/components/ui/buttons/ActionButton";
import { UserInvite } from '@/components/ui/lists/UsersList';
import Card from '@/components/ui/cards/Card';

type AddFriendFormPropsTypes = {
  onAddFriend: (email: string) => void;
  isConnected: boolean;
  contactsError?: string;
  users: Array<UserInvite>;
};

const AddFriendFormCard: FC<AddFriendFormPropsTypes> = (props) => {
  const { onAddFriend, isConnected, contactsError, users } = props;
  const [userName, setUserName] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const newValue = event.target.value;
    setUserName(newValue);
  };

  const handleSubmit = async (): Promise<void> => {
    if (!isConnected) {
      return;
    }
    onAddFriend(userName);
    setUserName("");
    setError('');
  };

  useEffect(() => {
    if (!isConnected) {
      setUserName("");
    }
  }, [isConnected]);

  useEffect(() => {
    if (contactsError) {
      setError(contactsError);
    }
  }, [contactsError]);

  return (
    <Card title={'Send a friend request'}>
      <div className="flex items-center">
        <StyledInput
          value={userName}
          onChange={handleInputChange}
          placeholder={"Enter username"}
          disabled={!isConnected || !!users.length}
          className={'className="w-[172px] h-[40px] border border-customColors-lightBorderGray px-2 text-xs focus:outline-none focus:border-black transition-colors duration-300 placeholder:text-xs text-customColors-placeholderLightGreen"'}
        />
        <ActionButton
          isDisabled={!isConnected || !!users.length}
          onClick={handleSubmit}
          text={"Add Friend"}
          className={"w-full h-[40px] rounded-r-[12px] rounded-l-[0] px-6 py-2 text-base transition duration-300 bg-customColors-textBlue border-0 text-white"}
        />
      </div>
      <p className="text-customColors-red text-xs">{error}</p>
    </Card>
  );
};

export default AddFriendFormCard;
