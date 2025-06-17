// External deps
import { useCallback, useState } from "react";

// Internal deps
import { SfuExtended } from "@flashphoner/sfusdk";
import {
  Contact,
  FriendInvite,
  UserContacts,
} from "@flashphoner/sfusdk/dist/sdk/constants";
import { updateArray, updateArrayByProperties } from "@/utils/helpers";

export function useSdkContacts(sdkInstance: SfuExtended | null, isConnected: boolean) {
  const [contacts, setContacts] = useState<Array<Contact>>([]);
  const [incomingList, setIncomingList] = useState<FriendInvite[]>([]);
  const [outGoingList, setOutgoingList] = useState<FriendInvite[]>([]);
  const [contactsError, setContactsError] = useState<string>();

  const handleGetContacts = useCallback(async () => {
    if (!sdkInstance || !isConnected) return;
    try {
      const {
        contacts,
        incomingFriendInvites,
        outgoingFriendInvites,
      }: UserContacts = await sdkInstance.getContacts();
      setContacts(contacts);
      setIncomingList(incomingFriendInvites);
      setOutgoingList(outgoingFriendInvites);
      return contacts;
    } catch (error) {
      console.error(error);
    }
  }, [isConnected]);

  /**
  * @param userId - Unique user ID
  * @returns Promise<void>
  */
  const addFriend = useCallback(
    async (userId: string) => {
      if (!sdkInstance) return;
      try {
        await sdkInstance.addFriend({ userId });
      } catch (error) {
        if (typeof error === 'object' && error !== null && 'type' in error && 'error' in error) {
          if (error.type === 'OPERATION_FAILED' && error.error === "User doesn't exists") {
            setContactsError("User doesn't exists.");
          } else {
            setContactsError("An unexpected contacts error occurred. Please try again.");
          }
        } else {
          setContactsError("An unexpected contacts error occurred. Please try again.");
        }
        setTimeout(() => {
          setContactsError('');
        }, 5000);
      }
    },
    [sdkInstance, contacts],
  );

  /**
  * @param iviteId - id of incoming friend invite
  * @returns Promise<void>
  */
  const acceptFriendRequest = useCallback(
    async (inviteId: string) => {
      if (!sdkInstance) return;
      try {
        const response = await sdkInstance.acceptFriendInvite({ inviteId });
        const { userId, nickname, status } = response;
        setIncomingList((prev) =>
          updateArray(prev, inviteId, "remove", "inviteId"),
        );
        setContacts((prev) =>
          updateArrayByProperties(prev, userId, {
            nickname: nickname,
            friend: true,
            status
          }),
        );
      } catch (error) {
        console.error(error);
      }
    },
    [sdkInstance],
  );

  /**
  * @param iviteId - id of incoming friend invite
  * @returns Promise<void>
  */
  const rejectIncomingFriendInvite = useCallback(
    async (inviteId: string) => {
      if (!sdkInstance) return;
      try {
        await sdkInstance.rejectFriendInvite({ inviteId });
        setOutgoingList((prev) =>
          updateArray(prev, inviteId, "remove", "inviteId"),
        );
        setIncomingList((prev) =>
          updateArray(prev, inviteId, "remove", "inviteId"),
        );
      } catch (error) {
        console.error(error);
      }
    },
    [sdkInstance],
  );

  /**
  * @param iviteId - id of outgoing friend invite
  * @returns Promise<void>
  */
  const revokeOutGoingFriendRequest = useCallback(
    async (inviteId: string) => {
      if (!sdkInstance) return;

      try {
         await sdkInstance.revokeFriendInvite({
          inviteId,
        });
        setIncomingList((prev) =>
          updateArray(prev, inviteId, "remove", "inviteId"),
        );
        setOutgoingList((prev) =>
          updateArray(prev, inviteId, "remove", "inviteId"),
        );
      } catch (error) {
        console.error(error);
      }
    },
    [sdkInstance],
  );

  /**
  * @param userId - Unique user ID
  * @returns Promise<void>
  */
  const handleRemoveFriend = useCallback(
    async (userId: string) => {
      if (!sdkInstance) {
        return;
      }
      try {
        await sdkInstance.removeFriend({ userId });
        setContacts((prev) => updateArray(prev, userId, "remove", "userId"));
      } catch (error) {
        console.error(error);
      }
    },
    [sdkInstance],
  );

  return {
    contacts,
    incomingList,
    outGoingList,
    addFriend,
    contactsError,
    acceptFriendRequest,
    rejectIncomingFriendInvite,
    handleRemoveFriend,
    revokeOutGoingFriendRequest,
    handleGetContacts,
    setIncomingList,
    setOutgoingList,
    setContacts,
  };
}
