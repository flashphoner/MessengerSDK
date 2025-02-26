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
    <div>
      <StyledInput
        value={userName}
        onChange={handleInputChange}
        placeholder={"Enter username"}
        disabled={!isConnected || !!users.length}
      />
      <p className="text-customColors-red text-xs">{error}</p>
      <ActionButton
        isDisabled={!isConnected || !!users.length}
        onClick={handleSubmit}
        text={"Add Friend"}
        className={"mt-2"}
      />
    </div>
  );
};

export default AddFriendFormCard;
