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
      const newChat = event as UserSpecificChatInfo;
      setSingleChat((prevState: UserSpecificChatInfo | null) => {
        if (!prevState) {
          return { ...newChat };
        }
        return { ...newChat };
      });

    })
    .on(SfuEvent.CHAT_DELETED, () => {
      setSingleChat(null);
    })
    .on(SfuEvent.CHAT_UPDATED, (event) => {
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
