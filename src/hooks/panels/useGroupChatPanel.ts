import { useEffect, useCallback } from 'react';
import { ChatMap, Contact } from '@flashphoner/sfusdk/dist/sdk/constants';


const useGroupChatPanel = (props: {
  isConnected: boolean;
  userCredentials: { url: string; username: string; password: string; email?: string };
  userChats: ChatMap | undefined;
  users: Array<string>;
  handleGetContacts: () => Promise<undefined | Array<Contact>>;
  handleCreateChat: (membersList: { members: Array<string> }) => Promise<void>
}) => {
  const {
    isConnected,
    userChats,
    users,
    userCredentials,
    handleCreateChat,
    handleGetContacts,
  } = props;

  const createGroupChat = useCallback(async () => {
    if (users && !!users.length) {
      try {
          await handleCreateChat({members: users});
      } catch (error) {
        console.error("Failed to create group chat:", error);
      }
    } else {
      console.warn("No users provided for group chat creation.");
    }
  }, [users, userCredentials, handleCreateChat]);

  // load chats
  useEffect(() => {
    (async () => {
      try {
        if (isConnected && !userChats) {
          await handleGetContacts();
        }
      } catch (error) {
        console.error("Failed to load chats:", error);
      }
    })();
  }, [isConnected, userChats, handleGetContacts]);

  return {
    createGroupChat,
  };
};

export default useGroupChatPanel;
