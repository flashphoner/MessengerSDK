import { useCallback, useState } from "react";
import { SfuExtended } from "@flashphoner/sfusdk";
import { ExamplesUser } from "@flashphoner/sfusdk/dist/sdk/constants";
import sendFriendRequestCard from '@/components/containers/friends/panel/SendFriendRequestCard';

export type FreeUserOptionsType = {
  url: string;
  timeout?: number;
};

export function useSdkExamples(sdkInstance: SfuExtended | null, sdkInitialized: boolean = false) {
  const [freeUserCredentials, setFreeUserCredentials] = useState<ExamplesUser>();
  const [errorExample, setErrorExample] = useState<string | null>(null);

  // getFreeExampleUser
  const getFreeExampleUser = useCallback(
    async (options: FreeUserOptionsType) => {
      if (!sdkInstance) {
        return;
      }
      try {
        options.timeout = 0;
        const response: ExamplesUser = await sdkInstance.getExamplesFreeUser(options);
        setFreeUserCredentials(response);
        return response;
      } catch (error) {
        if (typeof error === 'object' && error !== null && 'type' in error && 'error' in error) {
          if (error.type === 'OPERATION_FAILED' && error.error === 'All users are busy. Try again later.') {
            setErrorExample("All users are busy. Please try again later.");
          } else {
            setErrorExample("An unexpected example error occurred. Please try again.");
          }
        } else {
          setErrorExample("An unexpected example error occurred. Please try again.");
        }
      }
    },
    [sdkInitialized],
  );

  return {
    getFreeExampleUser,
    freeUserCredentials,
    errorExample,
  };
}
