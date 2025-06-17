import { useCallback, useState } from "react";
import { SfuExtended } from "@flashphoner/sfusdk";
import { PresenceStatus } from "@flashphoner/sfusdk/dist/sdk/constants";

export function useSdkPresence(sdkInstance: SfuExtended | null) {
  const [ownStatus, setOwnStatus] = useState<PresenceStatus>();

  /**
  * @param status - user presence status
  * @return - Promise<void>
  */
  const updatePresenceStatus = useCallback(
    async (status: PresenceStatus) => {
      if (!sdkInstance) {
        return;
      }

      try {
        await sdkInstance.updatePresenceStatus(status);
        setOwnStatus(status);
      } catch (error) {
        console.error("updatePresenceStatus:", error);
      }
    },
    [sdkInstance],
  );

  /**
  * @param isActive - user activity
  * @return - Promise<void>
  */
  const changePresenceStatusActivity = useCallback(
    async (isActive: boolean) => {
      if (!sdkInstance) {
        return;
      }
      try {
        await sdkInstance.updateActivityStatus(isActive);
      } catch (error) {
        console.error("changePresenceStatusActivity:", error);
      }
    },
    [sdkInstance],
  );

  return {
    ownStatus,
    updatePresenceStatus,
    setOwnStatus,
    changePresenceStatusActivity,
  };
}
