import { SfuExtended, SfuEvent } from "@flashphoner/sfusdk";
import { MessageStatus, UserSpecificChatInfo, Message } from '@flashphoner/sfusdk/dist/sdk/constants';
import { Dispatch, SetStateAction } from "react";

export const handleChatEvents = (
  sdkInstance: SfuExtended,
  {
    setSingleChat,
    setMessages,
    messages,
  }: {
    setSingleChat: Dispatch<SetStateAction<UserSpecificChatInfo | null>>;
    setMessages: Dispatch<SetStateAction<Array<Message>>>;
    messages: Array<Message> | undefined;
  },
) => {
  sdkInstance
    .on(SfuEvent.NEW_CHAT, (event) => {
      setMessages([]);
      /**
      * Returns UserSpecificChatInfo
      *
      * @returns {
      *   id: string;
      *   roomId: string;
      *   favourite: boolean;
      *   hidden: boolean;
      *   channel: boolean;
      *   name: string;
      *   owner: UserId;
      *   creationDate: number;
      *   members: Array<UserId>;
      *   lastReadMessageId: string;
      *   lastReadMessageDate: number;
      *   canSend: boolean;
      *   type: ChatType;
      *   notificationSettings: NotificationMode;
      *   muteSettings: MuteSettings;
      *   channelSendPolicy: ChannelSendPolicy;
      *   chatReceivePolicy: ChatReceivePolicy;
      *   sendPermissionList: Array<string>;
      *   allowedToAddExternalUser: boolean;
      *   messagesCount: number;
      *   firstMessageId: string;
      *   firstMessageDate: number;
      *   lastMessageId: string;
      *   lastMessageDate: number;
      *   encryptionEnabled: boolean;
      *   encryptedPrivateKey: string;
      *   publicKey: string;
      *   encryptedChatPassword: string;
      *   encryptedAttachmentsSecretKey: string;
      * }
      */
      const newChat = event as UserSpecificChatInfo;
      setSingleChat((prevState: UserSpecificChatInfo | null) => {
        if (!prevState) {
          return { ...newChat };
        }
        return { ...newChat };
      });

    })
    .on(SfuEvent.CHAT_DELETED, () => {
      /**
      * Returns UserSpecificChatInfo
      *
      * @returns {
      *   id: string;
      *   roomId: string;
      *   favourite: boolean;
      *   hidden: boolean;
      *   channel: boolean;
      *   name: string;
      *   owner: UserId;
      *   creationDate: number;
      *   members: Array<UserId>;
      *   lastReadMessageId: string;
      *   lastReadMessageDate: number;
      *   canSend: boolean;
      *   type: ChatType;
      *   notificationSettings: NotificationMode;
      *   muteSettings: MuteSettings;
      *   channelSendPolicy: ChannelSendPolicy;
      *   chatReceivePolicy: ChatReceivePolicy;
      *   sendPermissionList: Array<string>;
      *   allowedToAddExternalUser: boolean;
      *   messagesCount: number;
      *   firstMessageId: string;
      *   firstMessageDate: number;
      *   lastMessageId: string;
      *   lastMessageDate: number;
      *   encryptionEnabled: boolean;
      *   encryptedPrivateKey: string;
      *   publicKey: string;
      *   encryptedChatPassword: string;
      *   encryptedAttachmentsSecretKey: string;
      * }
      */
      setSingleChat(null);
    })
    .on(SfuEvent.CHAT_UPDATED, (event) => {
      /**
      * Returns UserSpecificChatInfo
      *
      * @returns {
      *   id: string;
      *   roomId: string;
      *   favourite: boolean;
      *   hidden: boolean;
      *   channel: boolean;
      *   name: string;
      *   owner: UserId;
      *   creationDate: number;
      *   members: Array<UserId>;
      *   lastReadMessageId: string;
      *   lastReadMessageDate: number;
      *   canSend: boolean;
      *   type: ChatType;
      *   notificationSettings: NotificationMode;
      *   muteSettings: MuteSettings;
      *   channelSendPolicy: ChannelSendPolicy;
      *   chatReceivePolicy: ChatReceivePolicy;
      *   sendPermissionList: Array<string>;
      *   allowedToAddExternalUser: boolean;
      *   messagesCount: number;
      *   firstMessageId: string;
      *   firstMessageDate: number;
      *   lastMessageId: string;
      *   lastMessageDate: number;
      *   encryptionEnabled: boolean;
      *   encryptedPrivateKey: string;
      *   publicKey: string;
      *   encryptedChatPassword: string;
      *   encryptedAttachmentsSecretKey: string;
      * }
      */
      const updatedChat = event as UserSpecificChatInfo;
      setSingleChat(updatedChat);
    })
    .on(SfuEvent.MESSAGE, (msg) => {
      const message = msg as Message;

      setMessages((prevMessages) => [...prevMessages, message]);
    // const updatedChat = event as UserSpecificChatInfo;
    // setSingleChat(updatedChat);
  });

};
