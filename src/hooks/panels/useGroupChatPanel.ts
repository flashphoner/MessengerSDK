import { useEffect, useCallback } from 'react';
import { ChatMap, ChatType, Contact, UserSpecificChatInfo } from '@flashphoner/sfusdk/dist/sdk/constants';
import { createChatTypes } from '@/hooks/sdk/useSdkChats';

const useGroupChatPanel = (props: {
  isConnected: boolean;
  userCredentials: { url: string; username: string; password: string; email?: string };
  userChats: ChatMap | undefined;
  users: string[];
  handleGetContacts: () => Promise<undefined | Array<Contact>>;
  handleCreateChat: ({ type, channel, members, isEncryptionEnabled, encryptedPrivateKey, publicKey, encryptedChatPasswords }: createChatTypes) => Promise<undefined | UserSpecificChatInfo>
}) => {
  const {
    isConnected,
    // loadChats,
    userChats,
    users,
    userCredentials,
    handleCreateChat,
    handleGetContacts,
  } = props;

  const createGroupChat = useCallback(async () => {
    if (users && !!users.length) {
      try {
          await handleCreateChat({
            type: ChatType.PRIVATE,
            channel: false,
            members: users,
          });
      } catch (error) {
        console.error("Failed to create group chat:", error);
      }
    } else {
      console.warn("No users provided for group chat creation.");
    }
  }, [users, userCredentials, handleCreateChat]);

  // load contacts
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
