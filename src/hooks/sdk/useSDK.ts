// External deps
import { useEffect, useRef } from "react";

// Internal deps
import { handleContactEvents } from "@/events/contacts";
import { handleChatEvents } from "@/events/chat";
import { handleSpaceEvents } from "@/events/space";
import { useSdkExamples } from "@/hooks/sdk/useSdkExamples";
import { handlePresenceEvents } from '@/events/presence';

// Local deps
import { useSdkConnection } from "./useSdkConnection";
import { useSdkContacts } from "./useSdkContacts";
import { useSdkSpaces } from "./useSdkSpaces";
import { useSdkPresence } from "./useSdkPresence";
import { useSdkChats } from "./useSdkChats";
import { useSdkEncryption } from '@/hooks/sdk/useSdkEncryption';

export function useSDK() {
  const isSubscribed = useRef<boolean>(false);

  // connection
  const {
    sdkInstance,
    connect,
    disconnect,
    isConnected,
    selfUserInfo,
    isConnecting,
    initializeSdk,
    sdkInitialized,
    setIsConnected,
    authToken,
  } = useSdkConnection();

  // contacts
  const {
    contacts,
    incomingList,
    outGoingList,
    addFriend,
    contactsError,
    acceptFriendRequest,
    revokeOutGoingFriendRequest,
    rejectIncomingFriendInvite,
    handleRemoveFriend,
    handleGetContacts,
    setIncomingList,
    setOutgoingList,
    setContacts,
  } = useSdkContacts(sdkInstance, isConnected);

  // example page
  const {
    getFreeExampleUser,
    freeUserCredentials,
    errorExample
  } = useSdkExamples(sdkInstance, sdkInitialized);

  // space
  const {
    singleSpace,
    userSpaces,
    singleSpaceInviteCode,
    createSpace,
    getUserSpaces,
    inviteToSpace,
    joinToSpace,
    leaveSpace,
    deleteSpace,
    updateSpaceChannel,
    setSingleSpace,
  } = useSdkSpaces(sdkInstance);

  // status
  const { ownStatus, updatePresenceStatus, setOwnStatus, changePresenceStatusActivity } = useSdkPresence(sdkInstance);

  // chat
  const {
    loadChats,
    handleCreateChat,
    handleInviteUserToChat,
    handleLeaveFromChat,
    handleDeleteChat,
    singleChat,
    userChats,
    setSingleChat,
    handleChangeNickName,
    sendMessage,
    messages,
    setMessages,
  } = useSdkChats(sdkInstance);

  // encryption
  const {loadEncryptionInfo, addEncryptionInfo, encryptionInfo} = useSdkEncryption(sdkInstance);

  const handleReset = () => {
    setSingleSpace(null);
  };
  // own status update for self
  useEffect(() => {
    if (selfUserInfo) {
      setOwnStatus(selfUserInfo.status);
    }
  }, [selfUserInfo?.status, isConnected]);

  // events init subscribe
  useEffect(() => {
    if (!isConnected && ownStatus) {
      setOwnStatus(undefined);
    } else if (sdkInstance && isConnected && !isSubscribed.current && selfUserInfo) {
      handleContactEvents(sdkInstance, {
        setIncomingList,
        setOutgoingList,
        setContacts,
        setOwnStatus,
      });
      handlePresenceEvents(sdkInstance, {
        setOwnStatus,
        setContacts,
        selfUserId: selfUserInfo.username,
      });
      handleChatEvents(sdkInstance, {
        setSingleChat,
        setMessages,
        messages,
      });
      handleSpaceEvents(sdkInstance, {
        setSingleSpace,
        singleSpace,
        getUserSpaces,
      });
      isSubscribed.current = true;
    }

    return () => {
      if (isConnected) {
        isSubscribed.current = false;
      }
    };
  }, [isConnected, selfUserInfo, sdkInstance, singleSpace]);

  return {
    // Example
    getFreeExampleUser,
    freeUserCredentials,

    // Connection
    sdkInstance,
    sdkInitialized,
    initializeSdk,
    selfUserInfo,
    connect,
    authToken,
    setIsConnected,
    disconnect,
    isConnected,
    isConnecting,

    // Contacts
    contacts,
    incomingList,
    outGoingList,
    handleGetContacts,
    addFriend,
    acceptFriendRequest,
    rejectIncomingFriendInvite,
    revokeOutGoingFriendRequest,
    handleRemoveFriend,
    contactsError,

    // Space
    singleSpace,
    userSpaces,
    createSpace,
    singleSpaceInviteCode,
    getUserSpaces,
    inviteToSpace,
    joinToSpace,
    leaveSpace,
    deleteSpace,
    setSingleSpace,

    // Status
    ownStatus,
    updatePresenceStatus,
    setOwnStatus,
    changePresenceStatusActivity,

    // Chats
    setSingleChat,
    singleChat,
    loadChats,
    handleCreateChat,
    handleInviteUserToChat,
    handleDeleteChat,
    handleLeaveFromChat,
    userChats,
    handleChangeNickName,
    updateSpaceChannel,

    // Messages
    sendMessage,
    messages,
    setMessages,

    //encryption
    loadEncryptionInfo,
    addEncryptionInfo,
    encryptionInfo,

    // Errors
    errorExample,

    // reset
    handleReset
  };
}
