This guide explains how to use the Encrypted Group Chat feature, which enables secure communication by encrypting messages, creating group chats, and managing user profiles with advanced encryption settings.

### Key Features

1. **Server Connection**:
    - Connect or disconnect from the server using a simple button.
    - The connection status is clearly displayed (e.g., Connected, Disconnected).

2. **Profile Encryption**:
    - Enable encryption for your profile to secure sensitive information.
    - Encryption is activated using a "Turn On Encryption" button.

3. **Upgrade Security Level**:
    - Upgrade your profile security level to access encrypted features.
    - An "Upgrade" option is provided for enhancing security and unlocking chat encryption.

4. **Encrypted Group Chat Creation**:
    - Create secure, encrypted group chats with selected contacts.
    - Available only after all participants have upgraded their security levels.

5. **Fallback to Regular Chat**:
    - If a participant has not upgraded their encryption, a regular chat will be created instead.
    - When sending a message in a regular chat, a warning modal will appear stating that the chat is not encrypted.
6. **Secure Messaging**:
    - Messages in group chats are encrypted using public/private key pairs for maximum security.
    - A prompt is shown when attempting to send messages in non-encrypted chats.

7. **Contact Card**:
    - View your contacts and their encryption status in the contact card.
    - Use the "Ask to Upgrade" button to notify contacts to enable encryption for enhanced security.

8. **Decryption of Messages**:
    - Decrypt messages in encrypted chats using your private key.
    - Messages are automatically decrypted if you have access to the correct encryption keys.

### How to Use

1. **Connect to the Server**:
    - Click the "Connect" button to establish a connection.
    - Verify that the connection status changes to "Connected" in the interface.

2. **Turn On Encryption**:
    - Click the "Turn On Encryption" button to enable encryption for your profile.
    - This generates public/private keys, ensuring secure communication.

3. **Upgrade Security Level**:
    - If required, click the "Upgrade" button to enhance your security level.
    - Upgrading allows you to access encrypted group chat features.

4. **Add or View Contacts**:
    - Open the contact card to view your contacts.
    - If a contact does not have encryption enabled, click "Ask to Upgrade" to send them a request.

5. **Create an Encrypted Group Chat**:
    - Select participants from your contact list who have enabled encryption.
    - Click "Create Encrypted Chat" to start a secure group chat.
    - If one or more participants have not enabled encryption, a regular chat will be created instead.

6. **Send an Encrypted or Regular Message**:
    - Type your message in the input field within the group chat.
    - If the chat is encrypted, the message will be encrypted before sending.
    - If the chat is not encrypted, a warning modal will appear stating:
    
     **End-to-End security is OFF. [Recipient] does not have encryption enabled. Are you sure you want to send this message?**
     Confirm to send the message or cancel to avoid sending it unencrypted.

7. **Decrypt Messages**:
    - View messages in the chat history and decrypt them automatically if you have access to the private key.
    - Use the "Decrypt" button if manual decryption is required.


### Encryption Implementation Steps (Using Web Crypto)

This section explains the **sequence of actions** required to **encrypt and decrypt** messages in a secure chat environment.

### 1. Generate & Store User Keys

Each user requires a unique **RSA key pair** to encrypt and decrypt messages.

### 1. Generate an RSA key pair
[Code from GitHub](https://github.com/homeronkis/test-code-snippets/blob/main/encryption.ts#L1-L13)
   - This will create a **public** and **private** key pair.
   - The **public key** is shared with others.
   - The **private key** is kept secret for decrypting messages.


#### 1.1 exportPrivateKeyToBase64()
[Code from GitHub](https://github.com/homeronkis/test-code-snippets/blob/main/encryption.ts#L15-L18)
- **Purpose**: Converts the generated **private key** into a Base64 string for storage or transmission.
- **Usage**:
    1. After generating an RSA key pair (e.g., via **generateRSAKeyPair()**), call **exportPrivateKeyToBase64(privateKey)**.
    2. The returned **Base64-encoded private key** can be stored in a database or sent to a server.
- **Important**: Always protect the Base64 private key. Encrypt it before saving or sending it over the network.

#### 1.2 exportPublicKeyToBase64()
[Code from GitHub](https://github.com/homeronkis/test-code-snippets/blob/main/encryption.ts#L34-L37)
- **Purpose**: Converts the generated **public key** into a Base64 string so that others can easily encrypt messages for you.
- **Usage**:
    1. Call **exportPublicKeyToBase64(publicKey)** after generating your RSA key pair.
    2. Store or transmit the **public key** (in Base64) so other participants can encrypt messages specifically for you.

#### 1.3 importPublicKeyFromBase64()
[Code from GitHub](https://github.com/homeronkis/test-code-snippets/blob/main/encryption.ts#L39-L51)
- **Purpose**: Converts a Base64-encoded **public key** back into a **CryptoKey** object.
- **Usage**:
    1. When receiving a contact’s public key in Base64 format, call **importPublicKeyFromBase64(base64Key)**.
    2. Use the resulting **public CryptoKey** to encrypt messages or share a chat password for that participant.

### 2. Protect the Private Key

#### 2.1 deriveKeyFromPassword()
[Code from GitHub](https://github.com/homeronkis/test-code-snippets/blob/main/encryption.ts#L53-L75)
- **Purpose**: Derives a cryptographic key from a user-supplied password.
- **Usage**:
    1. This function is called internally to generate a strong key based on a user-chosen password (or passphrase).
    2. The derived key is then used to encrypt or decrypt the private key.

#### 2.2 encryptPrivateKeyWithEmbeddedIvSalt()
[Code from GitHub](https://github.com/homeronkis/test-code-snippets/blob/main/encryption.ts#L96-L114)
- **Purpose**: Encrypts the Base64-encoded private key using a password-derived key, embedding the IV (initialization vector) and salt into the resulting encrypted string.
- **Usage**:
    1. Obtain the Base64 private key from **exportPrivateKeyToBase64()**.
    2. Call **encryptPrivateKeyWithEmbeddedIvSalt(base64PrivateKey, password, useIVAndSalt)**.
    3. Store or send this **encrypted private key** which contains the IV and salt.

#### 2.3 decryptPrivateKey()
[Code from GitHub](https://github.com/homeronkis/test-code-snippets/blob/main/encryption.ts#L116-L147)
- **Purpose**: Decrypts the **encrypted private key** (which includes the embedded IV and salt) back into its original Base64 form.
- **Usage**:
    1. Retrieve the **encrypted private key** from storage.
    2. Supply the same password used in **encryptPrivateKeyWithEmbeddedIvSalt()**.
    3. Restores the **original private key** (in Base64) so you can import it as a CryptoKey for decryption.

### 3 Encrypt & Decrypt Messages

#### 3.1 encryptMessageWithPublicKey()*
[Code from GitHub](https://github.com/homeronkis/test-code-snippets/blob/main/encryption.ts#L149-L160)
- **Purpose**: Encrypts a message (plaintext) using a recipient’s **public key**.
- **Usage**:
    1. Convert or import the recipient’s public key into a CryptoKey (e.g., **importPublicKeyFromBase64()**).
    2. Call **encryptMessageWithPublicKey(publicKey, plaintextMessage)**.
    3. The resulting ciphertext can only be decrypted by the matching **private key**.

#### 3.2 decryptMessageWithPrivateKey()*
[Code from GitHub](https://github.com/homeronkis/test-code-snippets/blob/main/encryption.ts#L162-L172)
- **Purpose**: Decrypts ciphertext using the corresponding **private key**.
- **Usage**:
    1. Ensure the private key is imported or available as a CryptoKey (after decryption from storage if needed).
    2. Pass the ciphertext to **decryptMessageWithPrivateKey(privateKey, encryptedMessage)**.
    3. The function returns the **original plaintext** message.
 
### 4. Create an Encrypted Group Chat

1. **Generate an RSA Key Pair for the Chat**
    - Use a function like **generateRSAKeyPair()** to produce a **unique** public/private key pair dedicated to this group chat.

2. **Convert & Protect the Chat’s Private Key**
    1. Call **exportPrivateKeyToBase64(chatKeyPair.privateKey)** to get the private key in Base64.
    2. Generate a **chat password** (e.g., using **uuidv4()**).
    3. Encrypt the private key with **encryptPrivateKeyWithEmbeddedIvSalt(base64PrivateKey, chatPassword, useIVAndSalt)** to store it securely.

3. **Share the Chat Password with Participants**
    1. Import each participant’s public key via **importPublicKeyFromBase64()**.
    2. Use **encryptMessageWithPublicKey()** with each participant’s public key to encrypt the **chat password**.
    3. Save or transmit these **encrypted passwords** so each participant can later decrypt the chat password with their private key.

4. **Save the Chat Data**
    - Pass the required fields to your chat creation handler (e.g., **handleCreateChat()**):
        - **encryptedPrivateKey** (result of **encryptPrivateKeyWithEmbeddedIvSalt()**),
        - **publicKey** (Base64 representation of the chat’s public key),
        - **encryptedChatPasswords** (one for each participant),
        - optionally an **AES key** for attachments (generated via **generateAESKey()**).

5. **Initialization**
    - Store the chat’s metadata (public key, encrypted private key, encrypted passwords) so clients can retrieve and decrypt it as needed.

### 5. Send & Receive Messages in the Encrypted Chat

#### 5.1 Sending Encrypted Messages
1. **Sender Retrieves Public Key**
    - Get the chat’s **public key** (or use the stored CryptoKey if already imported).
2. **Encrypt the Message**
    - Call **encryptMessageWithPublicKey(chatPublicKey, messageContent)**.
3. **Transmit**
    - Use your chat function (e.g., **sendMessage()**) to send the encrypted message body to the server or directly to participants.

#### 5.2 Receiving & Decrypting Messages
1. **User Decrypts the Private Key**
    - Retrieve the **encrypted private key** of the chat from storage.
    - Decrypt it locally with the user’s chat password (if necessary), resulting in the **Base64 private key**.
2. **Import the Private Key**
    - Convert that Base64 private key into a **CryptoKey** object.
3. **Decrypt the Message**
    - Call **decryptMessageWithPrivateKey(chatPrivateKey, encryptedMessage)** to get the original plaintext.

### SDK Methods
---
| **Method**                                        | **Description**                                                                                              |
|---------------------------------------------------|--------------------------------------------------------------------------------------------------------------|
| [Connect](connect)                                | Connect to the server using user credentials and shared tokens.                                              |
| [Disconnect](disconnect)                          | Disconnect from the server.                                                                                  |
| [Add User Encryption Info](addUserEncryptionInfo) | Add encryption settings to user profile.                                                                    |
| [Get User Encryption Info](getUserEncryptionInfo) | Retrieve the current encryption settings of the user profile.                                                |
| [Create Chat](createChat)                         | Create a new chat (either regular or encrypted) and handle chat initialization.                              |
| [Send Message](sendMessage)                       | Send a message to the chat, either encrypted or unencrypted, depending on the chat's encryption status.       |
| [Get User Chats](getUserChats)                    | Load the list of chats, including details on encryption status for each chat.                                 |
| [Get Contacts](getContacts)                       | Retrieve the list of contacts that the user has, which is necessary for creating or managing chats.          |
| [Accept Friend Invite](acceptFriendInvite)        | Accept an incoming friend request.                                                                          |
| [Add Friend](addFriend)                           | Send a friend request to another user.                                                                      |
| [Remove Friend](removeFriend)                     | Remove a friend from your contact list.                                                                     |
