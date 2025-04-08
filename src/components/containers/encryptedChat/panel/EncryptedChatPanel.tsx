import React, { ChangeEvent, forwardRef, KeyboardEvent, useEffect, useState } from 'react';
import classNames from 'classnames';
import { ExamplePagePanelTypes } from '@/types/Client';
import ConnectionCard from '@/components/ui/cards/ConnectionCard';
import { useSDK } from '@/hooks/sdk/useSDK';
import Card from '@/components/ui/cards/Card';
import SkeletonLoader from '@/components/ui/skeleton/SkeletonLoader';
import useConnectWithCredentials from '@/hooks/panels/useConnectWithCredentials';
import ActionButton from '@/components/ui/buttons/ActionButton';
import { keyManagementService } from '@/services/keyManagementService';
import ChatCard from '@/components/containers/oneToOneChat/panels/ChatCard';
import StyledInput from '@/components/ui/styledInput/StyledInput';
import { ChatType, Message, MessageTargetEntityType } from '@flashphoner/sfusdk/dist/sdk/constants';
import { v4 as uuidv4 } from 'uuid';
import EncryptionOptionsForm, { EncryptionOptions } from '@/components/ui/forms/ecnryption/EncryptionOptionsForm';
import {
  encryptMessageWithPublicKey,
  encryptPrivateKeyWithEmbeddedIvSalt, encryptPrivateKeyWithSeparateIvSalt, exportAESKeyToString,
  exportPrivateKeyToBase64,
  exportPublicKeyToBase64,
  generateAESKey,
  hashSHA256,
  importPublicKeyFromBase64
} from '@/utils/encryption';
import MemberSelectionForm from '@/components/ui/forms/MemberSelectionForm';
import AlertModal from '@/components/ui/alertModal/AlertModal';
import MessageList from '@/components/ui/messageList/MessageList';

export type UserPanelHandlers = {
  clearData: () => void;
};
const EncryptedChatPanel = forwardRef<UserPanelHandlers, ExamplePagePanelTypes>(
  (props, ref) => {
    const {
      colorName,
      userCredentials,
      updateSharedToken,
      sharedToken,
      users,
      serverUrl,
    } = props;

    const {
      // init
      initializeSdk,
      sdkInitialized,
      //connect
      connect,
      disconnect,
      isConnected,
      authToken,
      isConnecting,

      // presence
      ownStatus,

      // contacts
      addFriend,
      acceptFriendRequest,
      incomingList,
      handleGetContacts,
      contacts,

      // encryption
      loadEncryptionInfo,
      addEncryptionInfo,
      encryptionInfo,

      // chat
      handleCreateChat,
      singleChat,
      loadChats,
      sendMessage,
      messages,
      setMessages,
      setSingleChat,
    } = useSDK();

    const [inputMessageValue, setInputMessageValue] = useState('');
    const [options, setOptions] = useState<EncryptionOptions>({ useIVAndSalt: false });
    const [isAskRequest, setIsAskRequest] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { connectWithCredentials } = useConnectWithCredentials({
      initializeSdk,
      sdkInitialized,
      credentials: { userCredentials, sharedToken, authToken },
      connect,
      serverUrl
    });

    const checkAllContactsHaveKeys = () => {
      const missingKeys = contacts.filter(contact => !contact.publicKey);
      return missingKeys.length <= 0;
    };

    const selfContacts = contacts.filter((contact) => contact.userId !== userCredentials.username);

    const handleTurnOnEncryption = async () => {

      const ms = 'MS-PASSWORD';

      await keyManagementService.generateKeysForUser(userCredentials.username);
      const selfKeys = keyManagementService.getUserKeys(userCredentials.username);
      const verificationHash = await hashSHA256(ms);

      if (selfKeys && selfKeys.keyPair.privateKey) {
        const strPrivateKey = await exportPrivateKeyToBase64(selfKeys.keyPair.privateKey);
        const strPublicKey = await exportPublicKeyToBase64(selfKeys.keyPair.publicKey);

        const { encryptedPrivateKey, iv, salt } = await encryptPrivateKeyWithSeparateIvSalt(strPrivateKey, ms, options.useIVAndSalt);

        const encryptionData = {
          publicKey: strPublicKey,
          privateKey: encryptedPrivateKey,
          verificationHash,
          iv,
          salt
        };

        await addEncryptionInfo(encryptionData);
      }
    };

    const handleCreateDirectChat = async (): Promise<void> => {
      if (users && userCredentials) {
        const chatUsers = users.filter((user) => user.username !== userCredentials.username)[0].username;
        if (chatUsers && !!chatUsers.length) {
          await handleCreateChat({
            type: ChatType.PRIVATE,
            channel: false,
            members: [chatUsers],
          });
        }
      }
    };

    const handleCreateEncryptedChat = async () => {
      try {
        setSingleChat(null);
        setMessages([]);

        const chatTemporaryId = uuidv4();
        await keyManagementService.generateKeysForChat(chatTemporaryId);
        const attachmentsAESKey = await generateAESKey();
        const aesAsString = await exportAESKeyToString(attachmentsAESKey);

        const strPrivateKey = await keyManagementService.exportChatPrivateKeyBase64(chatTemporaryId);
        const strPublicKey = await keyManagementService.exportChatPublicKeyBase64(chatTemporaryId);
        const chatPassword = uuidv4();

        if (!strPrivateKey) throw new Error("Private key generation failed");

        const encryptedPrivateKey = await encryptPrivateKeyWithEmbeddedIvSalt(strPrivateKey, chatPassword, options.useIVAndSalt);

        const members = contacts.map(contact => contact.userId).filter(userId => userId !== userCredentials.username);

        const passwords = await Promise.all(
          contacts.map(async (contact) => {
            try {
              const participantKey = await importPublicKeyFromBase64(contact.publicKey);
              const encryptedPassword = await encryptMessageWithPublicKey(participantKey, chatPassword);
              return { userId: contact.userId, password: encryptedPassword };
            } catch (error) {
              console.error(`Error encrypting password for user ${contact.userId}:`, error);
              throw error;
            }
          })
        );
        const createdChat = await handleCreateChat({
          members,
          isEncryptionEnabled: true,
          encryptedPrivateKey,
          publicKey: strPublicKey,
          encryptedChatPasswords: passwords,
          encryptedAttachmentsSecretKey: aesAsString
        });

        if (createdChat) {
          keyManagementService.replaceChatId(chatTemporaryId, createdChat.id);
        } else {
          console.error("Error creating chat");
        }
      } catch (error) {
        console.error("Error in handleCreateEncryptedChat:", error);
      }
    };

    const handleChangeInputMessageValue = (event: ChangeEvent<HTMLInputElement>) => {
      setInputMessageValue(event.target.value);
    };

    const handleSendMessage = async (): Promise<void> => {
      if (!singleChat?.id || inputMessageValue.trim().length === 0) {
        return;
      }

      try {
        let messageBody = inputMessageValue;

        if (!messageBody) {
          setInputMessageValue('');
          return;
        }

        if (singleChat.encryptionEnabled) {
          const chatKeys = keyManagementService.getChatKeys(singleChat.id);
          if (!chatKeys) throw new Error("Chat encryption keys not found!");

          messageBody = await encryptMessageWithPublicKey(chatKeys.keyPair.publicKey, messageBody);

          await sendMessage({
            targetEntityType: MessageTargetEntityType.CHAT,
            targetEntityId: { chatId: singleChat.id },
            body: messageBody,
            attachments: [],
          });

          setInputMessageValue('');
          setIsModalOpen(false);

        } else if (!singleChat.encryptionEnabled) {
          if (!isModalOpen && !isAskRequest) {
            setIsModalOpen(true);
          } else {
            await sendMessage({
              targetEntityType: MessageTargetEntityType.CHAT,
              targetEntityId: { chatId: singleChat.id },
              body: messageBody,
              attachments: [],
            });

            setIsAskRequest(true);
            setInputMessageValue('');
            setIsModalOpen(false);
          }
        }
      } catch (error) {
        console.error("Error in handleSendMessage:", error);
      }
    };


    const handleUpdateMessage = (messageId: string, updates: Partial<Message>) => {
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.id === messageId ? { ...message, ...updates } : message
        )
      );
    };

    const askToUpgradeProfile = async (userId: string) => {
      if (!singleChat) {
        setInputMessageValue(`Hey ${userId} You can up your security level and participate in End to End encrypted chats.`);
        await handleCreateDirectChat();
        return;
      }
      setInputMessageValue(`Hey ${userId} You can up your security level and participate in End to End encrypted chats.`);
    };
    const onEnterInputField = async (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        await handleSendMessage();
      }
    };
    // prepare friends, state
    useEffect(() => {
      (async () => {
        if (isConnected && users) {
          const contactList = await handleGetContacts();
          if (contactList && contactList.length === 1) {
            const friends = contactList.filter((contact) => contact.friend);
            if (!friends.length && userCredentials) {
              users.filter((user ) => user.username !== userCredentials.username).map(async (user) => {
                if (user.username) {
                  await addFriend(user.username);
                }
              });
            }
          }
        }
      })();
    }, [isConnected, userCredentials]);

    useEffect(() => {
      if (incomingList) {
        incomingList.map(async ({ inviteId }) => {
          await acceptFriendRequest(inviteId);
        });
      }
    }, [incomingList]);

    useEffect(() => {
      if (authToken && updateSharedToken) {
        updateSharedToken(authToken);
      }
    }, [authToken]);

    useEffect(() => {
      (async () => {
        if (isConnected) {
          await loadEncryptionInfo();
          await loadChats();
        }
      })();
    }, [isConnected]);

    // styles
    const cardClasses = classNames(
      'card p-2 border rounded-md transition-colors duration-300 mb-4',
      colorName
    );

    const textClassKey = classNames('w-55 overflow-hidden text-ellipsis whitespace-nowrap text-xs mb-1');

    return (
      <div className="user-panel">
        {userCredentials?.username && (
          <div>
            <ConnectionCard
              className={cardClasses}
              connect={connectWithCredentials}
              disconnect={disconnect}
              isConnected={isConnected}
              userName={userCredentials.username}
              ownStatus={ownStatus}
              isConnecting={isConnecting}
              isEncryption={encryptionInfo?.encryptionEnabled}
              onUpgradeSecurity={handleTurnOnEncryption}
              isDisconnectOff
            />
            <Card className={colorName}>
              <p>Contacts</p>
              <MemberSelectionForm selfContacts={contacts.filter((contact) => contact.userId !== userCredentials.username)} askToUpgradeProfile={askToUpgradeProfile}/>
            </Card>
            <Card className={colorName}>
              <p className="card-title font-bold">Keys</p>
              {encryptionInfo?.privateKey && <p className={textClassKey}>Private key: <span className="font-bold">{encryptionInfo?.privateKey}</span></p>}
              {encryptionInfo?.publicKey && <p className={textClassKey}>Public key: <span className="font-bold">{encryptionInfo?.publicKey}</span></p>}
              {encryptionInfo?.iv && <p className={textClassKey}>IV: <span className="font-bold">{encryptionInfo?.iv}</span></p>}
              {encryptionInfo?.salt && <p className={textClassKey}>Salt: <span className="font-bold">{encryptionInfo?.salt}</span></p>}
            </Card>
            <Card className={colorName}>
              <EncryptionOptionsForm
                onOptionsChange={setOptions}
                isDisabled={Boolean(encryptionInfo?.encryptionEnabled)}
              />
            </Card>
            { userCredentials.username === users[0].username &&
              <Card className={colorName}>
                <ActionButton
                  text={'Create Encrypted chat'}
                  onClick={handleCreateEncryptedChat}
                  isDisabled={Boolean(singleChat?.id && singleChat?.encryptionEnabled) || !selfContacts.length || !checkAllContactsHaveKeys()}
                />
              </Card>
            }
            <Card className={colorName}>
              <p className="card-title mb-2 font-bold">Chat</p>
              { singleChat && (
                <ChatCard name={singleChat?.name} members={singleChat?.members} />
              )}
            </Card>
            <Card className={colorName}>
              <p className="card-title font-bold">Messages</p>
              {singleChat && (
                <MessageList
                  options={options}
                  singleChat={singleChat}
                  encryptionInfo={encryptionInfo}
                  userCredentials={userCredentials}
                  messages={messages}
                  username={userCredentials.username}
                  encryptionEnabled={singleChat.encryptionEnabled}
                  onUpdateMessage={handleUpdateMessage}
                />
              )}
            </Card>
            <Card className={colorName}>
              <p className="card-title mb-2 font-bold">Send encrypted message</p>
              <StyledInput
                disabled={Boolean(!singleChat?.id)}
                value={inputMessageValue}
                onChange={handleChangeInputMessageValue}
                placeholder={"Enter text message"}
                onKeyDown={onEnterInputField}
              />
              <ActionButton
                text={singleChat && singleChat.encryptionEnabled ? 'Send encrypted message' : 'Send message'}
                className="mt-2"
                isDisabled={!singleChat?.id || inputMessageValue.trim().length === 0}
                onClick={handleSendMessage}
              />
            </Card>
          </div>
        )
        }
        {!userCredentials?.username && (<SkeletonLoader />)}

        {isModalOpen && <AlertModal
          width={'w-80'}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onOk={handleSendMessage}
          title='End to End security is OFF'
          message={`${userCredentials.username === users[0].username ? users[1].username : users[0].username} does not have End to End encryption configured. Are you sure you want to send the message and continue communicating with ${users[1].username}`}
          isActionButtons
        />}
      </div>
    );
  }
);
EncryptedChatPanel.displayName = 'EncryptedChatPanel';
export default EncryptedChatPanel;
