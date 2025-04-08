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

  const handleDecryptMessage = async (msg: Message) => {

    if (!singleChat?.encryptedPrivateKey || !encryptionInfo?.privateKey) return;

    try {
      const selfKeys = keyManagementService.getUserKeys(userCredentials.username);
      if (!selfKeys) throw new Error("Self keys not found");

      const chatKeys = keyManagementService.getChatKeys(singleChat.id);
      if (!chatKeys) throw new Error("Chat keys not found");

      const chatPassword = await decryptMessageWithPrivateKey(
        selfKeys.keyPair.privateKey,
        singleChat.encryptedChatPassword
      );
      const decryptedChatPrivateKey = await decryptPrivateKey(
        singleChat.encryptedPrivateKey,
        chatPassword
      );

      const importedChatPrivateKey = await importPrivateKeyFromBase64(decryptedChatPrivateKey);

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
            <ActionButton text="Decrypt message" onClick={() => handleDecryptMessage(msg)} />
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
