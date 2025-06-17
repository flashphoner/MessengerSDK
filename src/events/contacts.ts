import { Dispatch, SetStateAction } from "react";
import { SfuExtended, SfuEvent } from "@flashphoner/sfusdk";
import {
  Contact,
  ContactDeleted,
  ContactUpdated,
  FriendInvite,
  FriendInviteDeleted,
  NewContact,
  NewFriendInvite,
  PresenceStatus,
} from "@flashphoner/sfusdk/dist/sdk/constants";
import { updateArray, updateArrayByProperties } from "@/utils/helpers";


export const handleContactEvents = (
  sdkInstance: SfuExtended,
  {
    setIncomingList,
    setOutgoingList,
    setContacts,
  }: {
    setIncomingList: Dispatch<SetStateAction<FriendInvite[]>>;
    setOutgoingList: Dispatch<SetStateAction<FriendInvite[]>>;
    setContacts: Dispatch<SetStateAction<Contact[]>>;
    setOwnStatus: Dispatch<SetStateAction<PresenceStatus | undefined>>;
    resetOutGoingList?: (inviteId: string) => void;
    currentUserId?: string;
  },
) => {
  sdkInstance
    .on(SfuEvent.NEW_CONTACT, (event) => {
      /**
       * Returns NewContact
       *
       * @returns {
       *   contact: Contact;
       * }
       *
       * type Contact
       * {
       *   userId: string;
       *   nickname: string;
       *   friend: boolean;
       *   status: PresenceStatus;
       *   publicKey: string;
       *   encryptionEnabled: boolean;
       *   personalSettings: ContactPersonalSettings;
       * }
       */
      const { contact } = event as NewContact;
      setContacts((prev) =>
        updateArrayByProperties(prev, contact.userId, contact)
      );
    })
    .on(SfuEvent.CONTACT_DELETED, (event) => {
      /**
       * Returns ContactDeleted
       *
       * @returns {
       *   userId: string;
       * }
       */
      const { userId } = event as ContactDeleted;
      setContacts((prev) => updateArray(prev, userId, "remove", "userId"));
    })
    .on(SfuEvent.NEW_INCOMING_FRIEND_INVITE, (event) => {
      /**
       * Returns NewFriendInvite
       *
       * @returns {
       *   userId: string;
       *   nickname: string;
       *   inviteId: string;
       * }
       */
      const { userId, inviteId, nickname } = event as NewFriendInvite;
      setIncomingList((prev) =>
        updateArrayByProperties(prev, userId, { inviteId, nickname }),
      );
    })
    .on(SfuEvent.NEW_OUTGOING_FRIEND_INVITE, (event) => {
      /**
       * Returns NewFriendInvite
       *
       * @returns {
       *   userId: string;
       *   nickname: string;
       *   inviteId: string;
       * }
       */
      const { userId, inviteId, nickname } = event as NewFriendInvite;
      setOutgoingList((prev) =>
        updateArrayByProperties(prev, userId, { inviteId, nickname }),
      );
    })
    .on(SfuEvent.INCOMING_FRIEND_INVITE_DELETED, (event) => {
      /**
       * Returns FriendInviteDeleted
       *
       * @returns {
       *   inviteId: string;
       * }
       */
      const { inviteId } = event as FriendInviteDeleted;

      setIncomingList((prev) =>
        updateArray(prev, inviteId, "remove", "inviteId"),
      );
    })
    .on(SfuEvent.OUTGOING_FRIEND_INVITE_DELETED, (event) => {
      /**
       * Returns FriendInviteDeleted
       *
       * @returns {
       *   inviteId: string;
       * }
       */
      const { inviteId } = event as FriendInviteDeleted;
      setOutgoingList((prev) =>
        updateArray(prev, inviteId, "remove", "inviteId"),
      );
    })
    .on(SfuEvent.CONTACT_UPDATED, (event) => {
      /**
       * Returns user info
       *
       * @returns {
       *   userId: string;            // Unique user ID
       *   nickname: string;          // Display name
       *   status: string;            // Presence state
       *   publicKey: string;         // SPKI in Base64 (present when encryption is on)
       *   encryptionEnabled: boolean;// Keys exist and are usable
       *   friend: boolean;           // True if mutual friendship established
       * }
       */
      const { contact } = event as ContactUpdated;
      setContacts((prev) =>
        updateArrayByProperties(prev, contact.userId, contact),
      );
    });
};
