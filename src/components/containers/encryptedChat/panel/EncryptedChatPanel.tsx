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

        /**
         * @function uuidv4
         * @returns {string} - Randomly generated UUID string.
         */
        const chatTemporaryId = uuidv4();
        /**
         * @function keyManagementService.generateKeysForChat
         * @param chatId {string} - Temporary chat ID.
         * @returns {Promise<{ publicKey: string, privateKey: string }>} - Generated key pair.
         */
        await keyManagementService.generateKeysForChat(chatTemporaryId);
        /**
         * @function generateAESKey
         * @returns {Promise<CryptoKey>} - Newly generated AES key.
         */
        const attachmentsAESKey = await generateAESKey();
        /**
         * @function exportAESKeyToString
         * @param key {CryptoKey} - AES key to export.
         * @returns {Promise<string>} - AES key as string (base64).
         */
        const aesAsString = await exportAESKeyToString(attachmentsAESKey);
        /**
         * @function keyManagementService.exportChatPrivateKeyBase64
         * @param chatId {string} - Temporary chat ID.
         * @returns {Promise<string>} - Private key as base64 string.
         */
        const strPrivateKey = await keyManagementService.exportChatPrivateKeyBase64(chatTemporaryId);
        /**
         * @function keyManagementService.exportChatPublicKeyBase64
         * @param chatId {string} - Temporary chat ID.
         * @returns {Promise<string>} - Public key as base64 string.
         */
        const strPublicKey = await keyManagementService.exportChatPublicKeyBase64(chatTemporaryId);
        /**
         * @function uuidv4
         * @returns {string} - Randomly generated password for chat.
         */
        const chatPassword = uuidv4();

        if (!strPrivateKey) {
          throw new Error("Private key generation failed");
        }
        /**
         * @function encryptPrivateKeyWithEmbeddedIvSalt
         * @param privateKey {string} - Private key to encrypt.
         * @param password {string} - Password to encrypt with.
         * @param useIVAndSalt {boolean} - Whether to use IV and salt.
         * @returns {Promise<string>} - Encrypted private key as string.
         */
        const encryptedPrivateKey = await encryptPrivateKeyWithEmbeddedIvSalt(strPrivateKey, chatPassword, options.useIVAndSalt);
        /**
         * @type {Array<string>}
         * @description List of userIds for chat members except current user.
         */
        const members = contacts.map(contact => contact.userId).filter(userId => userId !== userCredentials.username);
        /**
         * @function importPublicKeyFromBase64
         * @param publicKey {string} - Public key as base64 string.
         * @returns {Promise<CryptoKey>} - Imported CryptoKey object.
         *
         * @function encryptMessageWithPublicKey
         * @param key {CryptoKey} - Recipient's public key.
         * @param message {string} - Message to encrypt.
         * @returns {Promise<string>} - Encrypted message.
         */
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
        /**
         * @function handleCreateChat
         * @param params {object}
         * @param params.members {Array<string>} - List of chat member user IDs.
         * @param params.isEncryptionEnabled {boolean} - Whether encryption is enabled.
         * @param params.encryptedPrivateKey {string} - Encrypted chat private key.
         * @param params.publicKey {string} - Chat public key.
         * @param params.encryptedChatPasswords {Array<{ userId: string, password: string }>} - Encrypted passwords for participants.
         * @param params.encryptedAttachmentsSecretKey {string} - Encrypted AES key for attachments.
         * @returns {Promise<Chat>} - The created chat object.
         */
        const createdChat = await handleCreateChat({
          members,
          isEncryptionEnabled: true,
          encryptedPrivateKey,
          publicKey: strPublicKey,
          encryptedChatPasswords: passwords,
          encryptedAttachmentsSecretKey: aesAsString
        });
        /**
         * @function keyManagementService.replaceChatId
         * @param oldId {string} - Temporary chat ID.
         * @param newId {string} - Real chat ID from server.
         * @returns {void}
         */
        if (createdChat) {
          keyManagementService.replaceChatId(chatTemporaryId, createdChat.id);
        } else {
          console.error("Error creating chat");
        }
      } catch (error) {
        /**
         * @function console.error
         * @param message {string} - Error message.
         * @param error {Error} - Caught error.
         * @returns {void}
         */
        console.error("Error in handleCreateEncryptedChat:", error);
      }
    };

    const handleChangeInputMessageValue = (event: ChangeEvent<HTMLInputElement>) => {
      setInputMessageValue(event.target.value);
    };
    /**
     * Handles sending a chat message (encrypted or plaintext, depending on chat settings).
     *
     * 1. Validates input and chat ID.
     * 2. For encrypted chats:
     *    - Retrieves the chat's public key.
     *    - Encrypts the message.
     *    - Sends encrypted message via sendMessage().
     * 3. For unencrypted chats:
     *    - Opens a modal for confirmation if needed.
     *    - Otherwise, sends plaintext message.
     * 4. Resets input and modal state after send.
     *
     * @async
     * @returns {Promise<void>} Promise resolving after message is sent or aborted.
     *
     * @throws {Error} Logs error if message cannot be sent or encryption fails.
     */
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
          /**
           * @function keyManagementService.getChatKeys
           * @param chatId {string}
           * @returns {{ keyPair: { publicKey: string, privateKey: string } }|undefined}
           */
          const chatKeys = keyManagementService.getChatKeys(singleChat.id);
          if (!chatKeys) {
            throw new Error("Chat encryption keys not found!");
          }
          /**
           * @function encryptMessageWithPublicKey
           * @param publicKey {string}
           * @param message {string}
           * @returns {Promise<string>} - Encrypted message body.
           */
          messageBody = await encryptMessageWithPublicKey(chatKeys.keyPair.publicKey, messageBody);
          /**
           * @function sendMessage
           * @param messageObj {object}
           * @param messageObj.targetEntityType {string}
           * @param messageObj.targetEntityId {{ chatId: string }}
           * @param messageObj.body {string}
           * @param messageObj.attachments {Array}
           * @returns {Promise<void>}
           */
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
            <Card
              className={colorName}
              title='Contacts'
            >
              {isConnected && <MemberSelectionForm
                selfContacts={contacts.filter((contact) => contact.userId !== userCredentials.username)}
                askToUpgradeProfile={askToUpgradeProfile}
              />}
            </Card>
            <Card className={colorName} title='Keys'>
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
                  className='text-customColors-textBlue'
                  text={'Create Encrypted chat'}
                  onClick={handleCreateEncryptedChat}
                  isDisabled={Boolean(singleChat?.id && singleChat?.encryptionEnabled) || !selfContacts.length || !checkAllContactsHaveKeys()}
                />
              </Card>
            }
            <Card className={colorName} title='Chat'>
              { singleChat && (
                <ChatCard name={singleChat?.name} members={singleChat?.members} />
              )}
            </Card>
            <Card className={colorName} title='Messages'>
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
            <Card className={colorName} title='Send encrypted message'>
              <div className='flex items-center mt-2'>
                <StyledInput
                  className={'className="w-[172px] h-[40px] border border-customColors-lightBorderGray px-2 text-xs focus:outline-none focus:border-black transition-colors duration-300 placeholder:text-xs text-customColors-placeholderLightGreen"'}
                  disabled={Boolean(!singleChat?.id)}
                  value={inputMessageValue}
                  onChange={handleChangeInputMessageValue}
                  placeholder={"Enter text"}
                  onKeyDown={onEnterInputField}
                />
                <ActionButton
                  text='Send'
                  className={"h-[40px] rounded-r-[12px] rounded-l-[0] px-6 py-2 text-base transition duration-300 bg-customColors-textBlue border-0 text-white"}
                  isDisabled={!singleChat?.id || inputMessageValue.trim().length === 0}
                  onClick={handleSendMessage}
                />
              </div>
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
