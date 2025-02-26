import { SfuExtended, SpaceEvent } from '@flashphoner/sfusdk';
import { Dispatch, SetStateAction } from 'react';
import { SfuSpace } from '@flashphoner/sfusdk/dist/sdk/constants';

export const handleSpaceEvents = (
  sdkInstance: SfuExtended, {
    getUserSpaces,
  }: {
    setSingleSpace: Dispatch<SetStateAction<SfuSpace | null>>;
    singleSpace: SfuSpace | null
    getUserSpaces: () => void;
  },
) => {
  // TODO: will be use in space examples
  sdkInstance
    .on(SpaceEvent.USER_SPACES, (event) => {
    })
    .on(SpaceEvent.NEW_SPACE, async (event) => {
    })
    .on(SpaceEvent.SPACE_DELETED, (event) => {
      getUserSpaces();
    })
    .on(SpaceEvent.SPACE_OVERVIEW_UPDATED, (event) => {
    })
    .on(SpaceEvent.NEW_SPACE_CATEGORY, (event) => {
    })
    .on(SpaceEvent.SPACE_CATEGORY_DELETED, (event) => {
    })
    .on(SpaceEvent.SPACE_CATEGORY_UPDATED, (event) => {
    })
    .on(SpaceEvent.NEW_SPACE_CHANNEL, async (event) => {
      getUserSpaces();
    })
    .on(SpaceEvent.SPACE_CHANNEL_DELETED, (event) => {
      getUserSpaces();
    })
    .on(SpaceEvent.SPACE_CHANNEL_UPDATED, (event) => {
      getUserSpaces();
    })
    .on(SpaceEvent.NEW_SPACE_THREAD, async (event) => {
    })
    .on(SpaceEvent.SPACE_THREAD_UPDATED, (event) => {
    })
    .on(SpaceEvent.SPACE_THREAD_DELETED, (event) => {
    })
    .on(SpaceEvent.USER_JOINED_TO_SPACE, (event) => {
      getUserSpaces();
    })
    .on(SpaceEvent.USER_LEFT_SPACE, (event) => {
      getUserSpaces();
    })
    .on(SpaceEvent.NEW_SPACE_ROLE, (event) => {
    })
    .on(SpaceEvent.SPACE_ROLE_UPDATED, (event) => {
    })
    .on(SpaceEvent.SPACE_ROLE_DELETED, (event) => {
    })
    .on(SpaceEvent.ADDED_ROLE_TO_MEMBER, (event) => {
    })
    .on(SpaceEvent.REMOVED_ROLE_FROM_MEMBER, (event) => {
    });
};
