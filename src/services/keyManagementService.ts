import {
  generateRSAKeyPair,
  exportPublicKeyToBase64,
  exportPrivateKeyToBase64
} from '@/utils/encryption';

/**
 * Manages user and chat RSA key pairs, supporting generation, export, and management operations.
 */
class KeyManagementService {
  private userKeys: Map<string, { keyPair: CryptoKeyPair; createdAt: Date }> = new Map();
  private chatKeys: Map<string, { keyPair: CryptoKeyPair; createdAt: Date }> = new Map();

  /**
   * Generates and stores RSA key pair for a user.
   * @param userId - Unique identifier for the user.
   * @returns keyPair - public, private keys.
   */
  public async generateKeysForUser(userId: string): Promise<CryptoKeyPair> {
    const keyPair = await generateRSAKeyPair();
    this.userKeys.set(userId, { keyPair, createdAt: new Date() });
    return keyPair;
  }

  /**
   * Generates and stores RSA key pair for a chat.
   * @param chatId - Unique identifier for the chat.
   */
  public async generateKeysForChat(chatId: string): Promise<void> {
    const keyPair = await generateRSAKeyPair();
    this.chatKeys.set(chatId, { keyPair, createdAt: new Date() });
  }

  /**
   * Retrieves a user's key pair.
   * @param userId - Unique identifier for the user.
   * @returns The user's key pair or undefined if not found.
   */
  public getUserKeys(userId: string): { keyPair: CryptoKeyPair; createdAt: Date } | undefined {
    return this.userKeys.get(userId);
  }

  /**
   * Retrieves a chat's key pair.
   * @param chatId - Unique identifier for the chat.
   * @returns The chat's key pair or undefined if not found.
   */
  public getChatKeys(chatId: string): { keyPair: CryptoKeyPair; createdAt: Date } | undefined {
    return this.chatKeys.get(chatId);
  }

  /**
   * Deletes a user's key pair.
   * @param userId - Unique identifier for the user.
   */
  public deleteUserKeys(userId: string): void {
    this.userKeys.delete(userId);
  }

  /**
   * Deletes a chat's key pair.
   * @param chatId - Unique identifier for the chat.
   */
  public deleteChatKeys(chatId: string): void {
    this.chatKeys.delete(chatId);
  }

  /**
   * Replaces the ID of a chat while preserving its key pair and metadata.
   * @param oldChatId - Existing chat ID.
   * @param newChatId - New chat ID to replace the old one.
   */
  public replaceChatId(oldChatId: string, newChatId: string): void {
    const chatKeyPair = this.chatKeys.get(oldChatId);
    if (!chatKeyPair) {
      throw new Error(`Chat with ID ${oldChatId} not found.`);
    }
    this.chatKeys.delete(oldChatId);
    this.chatKeys.set(newChatId, { ...chatKeyPair });
  }

  /**
   * Exports a user's public key in Base64 format.
   * @param userId - Unique identifier for the user.
   * @returns Base64-encoded public key.
   */
  public async exportUserPublicKeyBase64(userId: string): Promise<string> {
    const userKeyPair = this.userKeys.get(userId);
    if (!userKeyPair) {
      throw new Error(`Keys for user with ID ${userId} not found.`);
    }
    return await exportPublicKeyToBase64(userKeyPair.keyPair.publicKey);
  }

  /**
   * Exports a user's private key in Base64 format.
   * @param userId - Unique identifier for the user.
   * @returns Base64-encoded private key.
   */
  public async exportUserPrivateKeyBase64(userId: string): Promise<string> {
    const userKeyPair = this.userKeys.get(userId);
    if (!userKeyPair) {
      throw new Error(`Keys for user with ID ${userId} not found.`);
    }
    return await exportPrivateKeyToBase64(userKeyPair.keyPair.privateKey);
  }

  /**
   * Exports a chat's public key in Base64 format.
   * @param chatId - Unique identifier for the chat.
   * @returns Base64-encoded public key.
   */
  public async exportChatPublicKeyBase64(chatId: string): Promise<string> {
    const chatKeyPair = this.chatKeys.get(chatId);
    if (!chatKeyPair) {
      throw new Error(`Keys for chat with ID ${chatId} not found.`);
    }
    return await exportPublicKeyToBase64(chatKeyPair.keyPair.publicKey);
  }

  /**
   * Exports a chat's private key in Base64 format.
   * @param chatId - Unique identifier for the chat.
   * @returns Base64-encoded private key.
   */
  public async exportChatPrivateKeyBase64(chatId: string): Promise<string> {
    const chatKeyPair = this.chatKeys.get(chatId);
    if (!chatKeyPair) {
      throw new Error(`Keys for chat with ID ${chatId} not found.`);
    }
    return await exportPrivateKeyToBase64(chatKeyPair.keyPair.privateKey);
  }
}

// Export an instance of the KeyManagementService
export const keyManagementService = new KeyManagementService();
