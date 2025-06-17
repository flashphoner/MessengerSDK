import { SfuExtended, SfuEvent } from "@flashphoner/sfusdk";
import { Dispatch, SetStateAction } from "react";
import { updateArrayByProperties } from '@/utils/helpers';
import { Contact, PresenceStatus } from '@flashphoner/sfusdk/dist/sdk/constants';
type UpdatedUserStatus = {
  status: PresenceStatus;
  userId: string;
};
export const handlePresenceEvents = (
  sdkInstance: SfuExtended,
  {
    setOwnStatus,
    selfUserId,
    setContacts
  }: {
    setOwnStatus: Dispatch<SetStateAction<PresenceStatus | undefined>>;
    setContacts: Dispatch<SetStateAction<Contact[]>>;
    selfUserId?: string;
  },
) => {
  sdkInstance
    .on(SfuEvent.USER_PRESENCE_STATUS_UPDATED, (event) => {
      /**
      * Returns UserPresenceStatusUpdated
      *
      * @returns {
      *   userId: string;
      *   status: PresenceStatus;
      * }
      */
      const { userId, status } = event as UpdatedUserStatus;
      setContacts((prev) =>
        updateArrayByProperties(prev, userId, {
          status,
        }),
      );

      if (selfUserId && selfUserId && userId === selfUserId) {
        setOwnStatus(status);
      }
    });
};
