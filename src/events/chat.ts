import { SfuExtended, SfuEvent } from "@flashphoner/sfusdk";
import { UserSpecificChatInfo } from "@flashphoner/sfusdk/dist/sdk/constants";
import { Dispatch, SetStateAction } from "react";

export const handleChatEvents = (
  sdkInstance: SfuExtended,
  {
    setSingleChat,
  }: {
    setSingleChat: Dispatch<SetStateAction<UserSpecificChatInfo | null>>;
  },
) => {
  sdkInstance
    .on(SfuEvent.NEW_CHAT, (event) => {
      const newChat = event as UserSpecificChatInfo;
      setSingleChat((prevState: UserSpecificChatInfo | null) => {
        if (!prevState) {
          return { ...newChat };
        }
        return { ...prevState, newChat };
      });
    })
    .on(SfuEvent.CHAT_DELETED, () => {
      setSingleChat(null);
    })
    .on(SfuEvent.CHAT_UPDATED, (event) => {
      const updatedChat = event as UserSpecificChatInfo;
      setSingleChat(updatedChat);
    });
};
