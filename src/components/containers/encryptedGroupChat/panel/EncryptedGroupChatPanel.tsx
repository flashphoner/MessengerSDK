import React, {
  forwardRef,
  useEffect,
  ChangeEvent, useState
} from 'react';
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
import { MessageTargetEntityType, Message, UserChatEncryptedPassword } from '@flashphoner/sfusdk/dist/sdk/constants';
import { v4 as uuidv4 } from 'uuid';
import EncryptionOptionsForm from '@/components/ui/forms/ecnryption/EncryptionOptionsForm';
import {
  encryptMessageWithPublicKey, encryptPrivateKeyWithEmbeddedIvSalt, exportAESKeyToString,
  exportPrivateKeyToBase64,
  exportPublicKeyToBase64, generateAESKey,
  importPublicKeyFromBase64
} from '@/utils/encryption';
import MemberSelectionForm from '@/components/ui/forms/MemberSelectionForm';
import MessageList from '@/components/ui/messageList/MessageList';
import useEncryption from '@/hooks/encryption/useEncryption';

export type UserPanelHandlers = {
  clearData: () => void;
};
const EncryptedGroupChatPanel = forwardRef<UserPanelHandlers, ExamplePagePanelTypes>(
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
    } = useSDK();

    const selfContacts = contacts.filter((contact) => contact.userId !== userCredentials.username);
    const [inputMessageValue, setInputMessageValue] = useState<string>('');
    const [options, setOptions] = useState({ useIVAndSalt: false});

    const { connectWithCredentials } = useConnectWithCredentials({
      initializeSdk,
      sdkInitialized,
      credentials: { userCredentials, sharedToken, authToken },
      connect,
      serverUrl
    });

    // Encryption hook
    const { turnOnEncryption } = useEncryption(userCredentials.username, options, addEncryptionInfo);

    const handleCreateEncryptedChat = async (members: string[]) => {
      const chatTemporaryId = uuidv4();
      await keyManagementService.generateKeysForChat(chatTemporaryId);
      const chatKeys = keyManagementService.getChatKeys(chatTemporaryId);

      if (chatKeys && chatKeys.keyPair) {
        const chatPassword = uuidv4();
        const strPrivateKey = await exportPrivateKeyToBase64(chatKeys.keyPair.privateKey);
        const strPublicKey = await exportPublicKeyToBase64(chatKeys.keyPair.publicKey);
        const attachmentsAESKey = await generateAESKey();
        const aesAsString = await exportAESKeyToString(attachmentsAESKey);

        const encryptedPrivateKey = await encryptPrivateKeyWithEmbeddedIvSalt(strPrivateKey, chatPassword, options.useIVAndSalt);

        const members = contacts.map((contact) => contact.userId);
        const passwords = (
          await Promise.all(
            contacts.map(async (contact) => {
              try {
                const participantKey = await importPublicKeyFromBase64(contact.publicKey);
                const encryptedPassword = await encryptMessageWithPublicKey(participantKey, chatPassword);
                return {
                  userId: contact.userId,
                  password: encryptedPassword,
                };
              } catch (error) {
                console.error(`Failed to process user ${contact.userId}:`, error);
                return null;
              }
            })
          )
        ).filter((entry): entry is UserChatEncryptedPassword => entry !== null);

        const createdChat = await handleCreateChat({
          members,
          isEncryptionEnabled: true,
          encryptedPrivateKey: encryptedPrivateKey,
          publicKey: strPublicKey,
          encryptedChatPasswords: passwords,
          encryptedAttachmentsSecretKey: aesAsString
        });

        if (createdChat?.id) {
          keyManagementService.replaceChatId(chatTemporaryId, createdChat.id);
        }
      }
    };

    const handleCheckBeforeCreate = async (selectedMembers: string[]) => {
      const hasInvalidMembers = contacts.some((contact) => {
        const isSelected = selectedMembers.includes(contact.userId);
        const isEncryptionEnabled = contact.encryptionEnabled;
        return isSelected && !isEncryptionEnabled;
      });

      if (hasInvalidMembers) {
        console.error("Some participants don't have encryption enabled.");
        return;
      }
      await handleCreateEncryptedChat(selectedMembers);
    };


    const handleChangeInputMessageValue = (event: ChangeEvent<HTMLInputElement>) => {
      setInputMessageValue(event.target.value);
    };

    const handleSendEncryptedMessage = async (): Promise<void> => {
      if (!singleChat?.id || inputMessageValue.trim().length === 0) {
        return;
      }
      const chatKeys = keyManagementService.getChatKeys(singleChat.id);
      if (chatKeys) {
        let messageBody = inputMessageValue;
        messageBody = await encryptMessageWithPublicKey(chatKeys.keyPair.publicKey, messageBody);

        await sendMessage({
          targetEntityType: MessageTargetEntityType.CHAT,
          targetEntityId: { chatId: singleChat.id },
          body: messageBody,
          attachments: [],
        });
        setInputMessageValue('');
      }
    };

    const askToUpgradeProfile = (userId: string) => {
      const formattedUserId = userId.charAt(0).toUpperCase() + userId.slice(1);
      setInputMessageValue(`Hey @${formattedUserId} You can up your security level and participate in End to End encrypted chats.`);
    };

    const handleUpdateMessage = (messageId: string, updates: Partial<Message>) => {
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.id === messageId ? { ...message, ...updates } : message
        )
      );
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

    useEffect(() => {
      (async() => {
        if (!encryptionInfo?.encryptionEnabled && isConnected) {
          await turnOnEncryption();
        }
      })();
    }, [encryptionInfo, isConnected]);

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
              isDisconnectOff
            />
            <Card className={colorName} title={'Keys'}>
              {encryptionInfo?.privateKey && <p className={textClassKey}>Private key: <span className="font-bold">{encryptionInfo?.privateKey}</span></p>}
              {encryptionInfo?.publicKey && <p className={textClassKey}>Public key: <span className="font-bold">{encryptionInfo?.publicKey}</span></p>}
              {encryptionInfo?.iv && <p className={textClassKey}>IV: <span className="font-bold">{encryptionInfo?.iv}</span></p>}
              {encryptionInfo?.salt && <p className={textClassKey}>Salt: <span className="font-bold">{encryptionInfo?.salt}</span></p>}
            </Card>
            { !encryptionInfo?.encryptionEnabled &&
              <Card className={colorName}>
                <EncryptionOptionsForm onOptionsChange={setOptions} isDisabled={Boolean(encryptionInfo?.encryptionEnabled)} />
              </Card>
            }
            {
              users[0].username === userCredentials.username  && !singleChat?.id && (
                <Card className={colorName} title="New chat">
                  {!singleChat && isConnected && selfContacts.length > 0 && (
                    <>
                      <MemberSelectionForm
                        selfContacts={selfContacts}
                        onAction={handleCheckBeforeCreate}
                        isActionDisabled={contacts.length === 0}
                        isHeader
                        isTitle
                        isCheckBox
                        btnTxt="Create"
                      />
                    </>
                  )}

                  {singleChat && isConnected && (
                    <MemberSelectionForm
                      selfContacts={selfContacts}
                      askToUpgradeProfile={askToUpgradeProfile}
                      onAction={handleCheckBeforeCreate}
                      isActionDisabled={contacts.length === 0}
                    />
                  )}
                </Card>
              )
            }
            <Card className={colorName}>
              <p className="card-title mb-2 font-bold">Group chat</p>
              {singleChat && singleChat.encryptionEnabled && (
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
            <Card className={colorName} title='Send encrypted message'>
              <div className="flex items-center mt-2">
                <StyledInput
                  disabled={Boolean(!singleChat?.id)}
                  value={inputMessageValue}
                  onChange={handleChangeInputMessageValue}
                  placeholder={"Enter text message"}
                  className={'className="w-[172px] h-[40px] border border-customColors-lightBorderGray px-2 text-xs focus:outline-none focus:border-black transition-colors duration-300 placeholder:text-xs text-customColors-placeholderLightGreen"'}
                />
                <ActionButton
                  text="Send"
                  className={"h-[40px] rounded-r-[12px] rounded-l-[0] px-6 py-2 text-base transition duration-300 bg-customColors-textBlue border-0 text-white"}
                  isDisabled={!singleChat?.id || inputMessageValue.trim().length === 0}
                  onClick={handleSendEncryptedMessage}
                />
              </div>
            </Card>
          </div>
        )
        }
        {!userCredentials?.username && (<SkeletonLoader />)}
      </div>
    );
  }
);
EncryptedGroupChatPanel.displayName = 'EncryptedGroupChatPanel';
export default EncryptedGroupChatPanel;
