import { useEffect, useRef, useMemo, useState } from 'react';
import { AvatarBadge } from '@/components/ui/avatarBadge/AvatarBadge';
import ActionButton from '@/components/ui/buttons/ActionButton';
import { Message, UserEncryptionInfo, UserSpecificChatInfo } from '@flashphoner/sfusdk/dist/sdk/constants';
import { keyManagementService } from '@/services/keyManagementService';
import { decryptMessageWithPrivateKey, decryptPrivateKey, importPrivateKeyFromBase64 } from '@/utils/encryption';
import { EncryptionOptions } from '@/components/ui/forms/ecnryption/EncryptionOptionsForm';
import { getFormattedMessageListDate } from '@/utils/formattedDate';

type MessageListProps = {
  singleChat: UserSpecificChatInfo,
  encryptionInfo?: UserEncryptionInfo,
  userCredentials: {
    url: string,
    username: string,
    password: string,
    email?: string,
  },
  messages: Message[],
  username: string,
  encryptionEnabled: boolean,
  options: EncryptionOptions,
  onUpdateMessage: (msgId: string, txt: Partial<Message>) => void,
};

const MessageList = (props: MessageListProps) => {
  const {
    messages,
    username,
    encryptionEnabled,
    singleChat,
    encryptionInfo,
    userCredentials,
    options,
    onUpdateMessage
  } = props;

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [decryptedMessages, setDecryptedMessages] = useState<Set<string>>(new Set());
  /**
   * Decrypts a chat message for the current user, using the chat's encrypted password and private key.
   *
   * 1. Checks if private key and encrypted password are present.
   * 2. Retrieves user's key pair and chat key pair from key management.
   * 3. Decrypts chat password with user's private key.
   * 4. Decrypts chat private key with decrypted password.
   * 5. Imports the chat private key and uses it to decrypt the message body.
   * 6. Updates the message in UI and tracks decrypted messages.
   *
   * @async
   * @param msg {Message} - The encrypted message object to decrypt.
   * @returns {Promise<void>} Promise resolving after message is decrypted and UI updated.
   *
   * @throws {Error} Logs error if decryption fails at any stage.
   */
  const handleDecryptMessage = async (msg: Message) => {

    if (!singleChat?.encryptedPrivateKey || !encryptionInfo?.privateKey) return;

    try {
      /**
       * @function keyManagementService.getUserKeys
       * @param username {string}
       * @returns {{ keyPair: { publicKey: string, privateKey: string } }|undefined}
       */
      const selfKeys = keyManagementService.getUserKeys(userCredentials.username);
      if (!selfKeys) {
        throw new Error("Self keys not found");
      }
      /**
       * @function keyManagementService.getChatKeys
       * @param chatId {string}
       * @returns {{ keyPair: { publicKey: string, privateKey: string } }|undefined}
       */
      const chatKeys = keyManagementService.getChatKeys(singleChat.id);
      if (!chatKeys) {
        throw new Error("Chat keys not found");
      }
      /**
       * @function decryptMessageWithPrivateKey
       * @param privateKey {string}
       * @param encrypted {string}
       * @returns {Promise<string>} - Decrypted chat password.
       */
      const chatPassword = await decryptMessageWithPrivateKey(
        selfKeys.keyPair.privateKey,
        singleChat.encryptedChatPassword
      );
      /**
       * @function decryptPrivateKey
       * @param encryptedPrivateKey {string}
       * @param password {string}
       * @returns {Promise<string>} - Decrypted chat private key.
       */
      const decryptedChatPrivateKey = await decryptPrivateKey(
        singleChat.encryptedPrivateKey,
        chatPassword
      );
      /**
       * @function importPrivateKeyFromBase64
       * @param privateKeyBase64 {string}
       * @returns {Promise<CryptoKey>} - Imported private key object.
       */
      const importedChatPrivateKey = await importPrivateKeyFromBase64(decryptedChatPrivateKey);
      /**
       * @function decryptMessageWithPrivateKey
       * @param privateKey {CryptoKey}
       * @param encryptedMessage {string}
       * @returns {Promise<string>} - Decrypted message text.
       */
      const decryptedMessageTxt = await decryptMessageWithPrivateKey(importedChatPrivateKey, msg.body);

      onUpdateMessage(msg.id, { body: decryptedMessageTxt });

      setDecryptedMessages((prev) => new Set(prev).add(msg.id));

    } catch (error) {
      console.error('Error decrypting message:', error);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const messageItems = useMemo(
    () =>
      messages.map((msg) => (
        <div key={msg.id} className="mt-2 mb-2">
          <div className="flex items-center">
            <AvatarBadge name={msg.from === 'me' ? username : msg.from} size="small" hideUserStatus />
            <p className="ml-1 text-xs capitalize font-bold">
              {msg.from === 'me' ? username : msg.from}
            </p>
            <p className="text-xs ml-1 text-customColors-gray">{getFormattedMessageListDate(msg.date)}</p>
          </div>
          <div className="max-w-md break-words whitespace-normal text-xs mb-1 ml-9">{msg.body}</div>
          {encryptionEnabled && !decryptedMessages.has(msg.id) && (
            <ActionButton className="text-customColors-textBlue" text="Decrypt message" onClick={() => handleDecryptMessage(msg)} />
          )}
        </div>
      )),
    [messages, username, encryptionEnabled, handleDecryptMessage, onUpdateMessage, decryptedMessages]
  );

  return (
    <div className="custom-scrollbar flex flex-col flex-grow flex-shrink overflow-hidden">
      <div className="flex-grow overflow-y-auto p-2 h-80">
        {messages.length > 0 ? (
          <>
            {messageItems}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <p className="text-xs text-gray-500 text-center">No messages yet</p>
        )}
      </div>
    </div>
  );
};

export default MessageList;
