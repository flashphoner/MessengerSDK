import { useCallback, useState } from "react";
import { SfuExtended } from "@flashphoner/sfusdk";
import {
  ChatMap, MessageAttachment, MessageTargetEntityId, MessageTargetEntityType, UserChatEncryptedPassword,
  UserId,
  UserSpecificChatInfo, Message, ChatType
} from '@flashphoner/sfusdk/dist/sdk/constants';

export type createChatTypes = {
  channel?: boolean;
  members: string[];
  isEncryptionEnabled?: boolean;
  encryptedPrivateKey?: string;
  publicKey?: string;
  encryptedChatPasswords?: Array<UserChatEncryptedPassword>;
  type?: ChatType;
  encryptedAttachmentsSecretKey?: string;
}

export function useSdkChats(sdkInstance: SfuExtended | null) {
  const [singleChat, setSingleChat] = useState<UserSpecificChatInfo | null>(null);
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [userChats, setUserChats] = useState<ChatMap>();

  const handleCreateChat = useCallback(
    async ({ type, channel, members,
             isEncryptionEnabled, encryptedPrivateKey,
             publicKey, encryptedChatPasswords, encryptedAttachmentsSecretKey }: createChatTypes) => {

      if (!sdkInstance) return;

      try {

        const response = await sdkInstance.createChat({
          type,
          channel,
          members,
          isEncryptionEnabled,
          encryptedPrivateKey,
          publicKey,
          encryptedChatPasswords,
          encryptedAttachmentsSecretKey: encryptedAttachmentsSecretKey
        });
        setSingleChat(response);
        return response;
      } catch (error) {
        console.error("handleCreateChat:", error);
      }
    },
    [sdkInstance],
  );

  const handleDeleteChat = useCallback(
    async (id: string) => {
      if (!sdkInstance) return;

      try {
        await sdkInstance.deleteChat({
          id,
        });
        setSingleChat(null);
      } catch (error) {
        console.error("handleDeleteChat:", error);
      }
    },
    [sdkInstance],
  );

  const handleLeaveFromChat = useCallback(
    async (chatId: string, userId: string) => {
      if (!sdkInstance) return;

      try {
        await sdkInstance.removeMemberFromChat({
          id: chatId,
          member: userId,
        });
        setSingleChat(null);
      } catch (error) {
        console.error("handleLeaveFromChat:", error);
      }
    },
    [sdkInstance],
  );

  const handleInviteUserToChat = useCallback(
    async (userId: UserId, encryptedChatPassword?: string) => {
      if (!sdkInstance) return;

      try {
        if (!singleChat?.id) {
          return;
        }
        const response = await sdkInstance.addMemberToChat({
          id: singleChat.id,
          member: userId,
          encryptedChatPassword,
        });
        setSingleChat(response);
      } catch (error) {
        console.error("handleInviteUserToChat:", error);
      }
    },
    [sdkInstance],
  );

  const loadChats = useCallback(async () => {
    if (!sdkInstance) return;
    try {
      const chatsList: ChatMap = await sdkInstance.getUserChats();
      setUserChats(chatsList);
      const firstChatInfo = Object.values(chatsList)[0];
      setSingleChat(firstChatInfo);
    } catch (error) {
      console.error("loadChats:", error);
    }
  }, [sdkInstance]);

  const handleChangeNickName = useCallback(
    async (nickname: string) => {
      if (!sdkInstance) return;
      try {
        await sdkInstance.changeUserNickname(nickname);
      } catch (error) {
        console.error("handleChangeNickName:", error);
      }
    },
    [sdkInstance],
  );

  const sendMessage = useCallback(
    async (messageObj: {
      body?: string;
      to?: string;
      parentId?: string;
      targetEntityType: MessageTargetEntityType;
      targetEntityId: MessageTargetEntityId;
      attachments?: Array<MessageAttachment>;
    }) => {
      if (!sdkInstance) return;
      try {
        const response = await sdkInstance.sendMessage(messageObj);
        const newMessage = {
          ...response,
          from: 'me',
          to: 'me',
          status: response.state,
          body: messageObj.body || '',
          privateMessage: false,
          reactions: []
        };

        setMessages((prevMessages) => [...prevMessages, newMessage]);
      } catch (error) {
        console.error("handleChangeNickName:", error);
      }
    },
    [sdkInstance],
  );
  return {
    // methods
    loadChats,
    handleCreateChat,
    handleInviteUserToChat,
    handleLeaveFromChat,
    handleDeleteChat,
    handleChangeNickName,
    // set
    setSingleChat,
    setUserChats,
    // get
    singleChat,
    userChats,

    // messages
    sendMessage,
    messages,
    setMessages
  };
}
