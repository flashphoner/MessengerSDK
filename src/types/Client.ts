import { ConnectionDetails } from '@flashphoner/sfusdk/dist/sdk/constants';

export type CredentialsType = {
  url?: string;
  username?: string;
  password?: string;
  authToken?: string;
  device?: string;
  userId?: string;
  details?: ConnectionDetails,
  serverUrl?: string;
  email?: string
};
export type ExamplePageTypes = {
  serverUrl: string;
  handleSetDynamicTitle?: (title: string) => void;
  showSecondConnection?: boolean;
  isCanUseSecondConnection?: () => void;
  isShowSecondConnection: boolean;
};
export type ExamplePagePanelTypes = {
  colorName: string,
  userCredentials: {
    url: string,
    username: string,
    password: string,
    email?: string,
  },
  sharedToken?: string,
  updateSharedToken?: (token: string) => void,
  users: Array<CredentialsType>,
  serverUrl: string,
}
export type ExamplePanelHandlers = {
  clearData?: () => void;
};
export enum usersListType {
  Incoming = "Incoming",
  Outgoing = "Outgoing",
  Presence = "Presence",
  Friends = "Friends",
  Contacts = "Contacts",
}
