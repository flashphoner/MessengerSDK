This guide explains how to use the **Encrypted Chat** feature, which enables secure communication by encrypting messages, creating private chats, and managing user profiles with advanced encryption settings.


### Key Features

1. **Server Connection**
   - Connect or disconnect from the server using a simple button.
   - The connection status is clearly displayed (e.g., Connected, Disconnected).

2. **Profile Encryption**
   - Enable encryption for your profile to secure sensitive information.
   - Encryption is activated using a "Turn On Encryption" button.

3. **Upgrade Security Level**
   - Upgrade your profile security level to access encrypted features.
   - An "Upgrade" option is provided for enhancing security and unlocking chat encryption.

4. **Encrypted Chat Creation**
   - Create secure, encrypted one-on-one chats with other users.
   - Available only after **both** participants have upgraded their security levels.

5. **Secure Messaging**
   - Messages are encrypted using public/private key pairs for maximum security.
   - A prompt is shown when attempting to send messages in non-encrypted chats.

6. **Contact Card**
   - View your contacts and their encryption status in the contact card.
   - Use the "Ask to Upgrade" button to notify contacts to enable encryption for enhanced security.


### How to Use

1. **Connect to the Server**
   - Click the "Connect" button to establish a connection.
   - Verify that the status changes to "Connected" in the interface.

2. **Turn On Encryption**
   - Click the "Turn On Encryption" button to enable encryption for your profile.
   - Once enabled, your profile data and chats are protected by cryptographic keys.

3. **Upgrade Security Level**
   - If required, click the "Upgrade" button to enhance your security level.
   - Upgrading grants access to encrypted chat features.

4. **Add or View Contacts**
   - Open the contact card to view your contacts.
   - If a contact has not enabled encryption, click "Ask to Upgrade" to send them a request.

5. **Create an Encrypted Chat**
   - When both you and the other user have encryption enabled, click "Create Encrypted Chat."
   - A secure chat will be created, allowing you to exchange encrypted messages.

6. **Send an Encrypted Message**
   - Type your message in the input field within the chat.
   - Click "Send Message" to transmit the **encrypted** message.
   - If encryption is not enabled, a warning modal will appear, asking you to confirm sending unencrypted.

7. **Manage Messages**
   - View chat history and decrypt messages when needed.
   - Use the "Decrypt" button to securely access any encrypted messages.


### 1. Generate RSA Key Pair

[Code from GitHub (Lines 1–10)](https://github.com/homeronkis/test-code-snippets/blob/main/encryption.ts#L1-L10)

- Generates an RSA key pair (public and private keys).
- **Public key**: Used to encrypt messages.
- **Private key**: Used to decrypt messages.


### Encryption Implementation Steps (Using Web Crypto)

Below is the **sequence of actions** required to **encrypt and decrypt** messages in a secure single-user (private) chat environment.


### 1. Generate & Store User Keys

Each user requires a unique **RSA key pair** to encrypt and decrypt messages.

**Generate an RSA Key Pair**  
[GitHub (Lines 1–13)](https://github.com/homeronkis/test-code-snippets/blob/main/encryption.ts#L1-L13)
- Creates both a public and private key.
- The **public key** is shared with contacts for encrypting messages; the **private key** remains confidential.

#### 1.1 exportPrivateKeyToBase64()

[GitHub (Lines 15–18)](https://github.com/homeronkis/test-code-snippets/blob/main/encryption.ts#L15-L18)

- **Purpose**: Converts the generated private key into a Base64 string for storage or transmission.
- **Usage**:
   1. After generating a key pair via **generateRSAKeyPair()**, call **exportPrivateKeyToBase64(privateKey)**.
   2. The returned Base64-encoded private key can be stored or sent to a server.

> **Important**: Always protect the Base64 private key. Encrypt it (e.g., with a password) before saving or transmitting.

#### 1.2 exportPublicKeyToBase64()

[GitHub (Lines 34–37)](https://github.com/homeronkis/test-code-snippets/blob/main/encryption.ts#L34-L37)

- **Purpose**: Converts the generated public key into a Base64 string so that others can easily encrypt messages for you.
- **Usage**:
   1. Call **exportPublicKeyToBase64(publicKey)** after generating your RSA key pair.
   2. Store or share the Base64-encoded public key so other users can encrypt messages for you.

#### 1.3 importPublicKeyFromBase64()

[GitHub (Lines 39–51)](https://github.com/homeronkis/test-code-snippets/blob/main/encryption.ts#L39-L51)

- **Purpose**: Converts a Base64-encoded **public key** back into a **CryptoKey** object.
- **Usage**:
   1. When receiving a contact’s public key in Base64 format, call **importPublicKeyFromBase64(base64Key)**.
   2. Use the resulting **public CryptoKey** to encrypt messages or share chat-specific keys for that user.


### 2. Protect the Private Key

#### 2.1 deriveKeyFromPassword()

[GitHub (Lines 53–75)](https://github.com/homeronkis/test-code-snippets/blob/main/encryption.ts#L53-L75)

- **Purpose**: Derives a cryptographic key from a user-supplied password.
- **Usage**:
   - Internally used to generate a strong key from a user-chosen password or passphrase.
   - This derived key is then used to encrypt or decrypt the private key.

#### 2.2 encryptPrivateKeyWithEmbeddedIvSalt()

[GitHub (Lines 96–114)](https://github.com/homeronkis/test-code-snippets/blob/main/encryption.ts#L96-L114)

- **Purpose**: Encrypts the Base64-encoded private key using a password-derived key, embedding the IV and salt in the resulting string.
- **Usage**:
   1. Get the Base64 private key via **exportPrivateKeyToBase64()**.
   2. Call **encryptPrivateKeyWithEmbeddedIvSalt(base64PrivateKey, password, useIVAndSalt)**.
   3. Store or send this **encrypted private key**, which contains the IV and salt.

#### 2.3 decryptPrivateKey()

[GitHub (Lines 116–147)](https://github.com/homeronkis/test-code-snippets/blob/main/encryption.ts#L116-L147)

- **Purpose**: Decrypts the **encrypted private key** (including embedded IV and salt) back into its original Base64 form.
- **Usage**:
   1. Retrieve the **encrypted private key** from storage.
   2. Use the same password used in **encryptPrivateKeyWithEmbeddedIvSalt()**.
   3. Restores the **original private key** (in Base64), which can then be imported as a CryptoKey for decryption.


### 3. Encrypt & Decrypt Messages

#### 3.1 encryptMessageWithPublicKey()

[GitHub (Lines 149–160)](https://github.com/homeronkis/test-code-snippets/blob/main/encryption.ts#L149-L160)

- **Purpose**: Encrypts a message (plaintext) using a recipient’s **public key**.
- **Usage**:
   1. Convert or import the recipient’s public key into a CryptoKey (e.g., *importPublicKeyFromBase64()*).
   2. Call **encryptMessageWithPublicKey(publicKey, plaintextMessage)**.
   3. Only the matching **private key** can decrypt this message.

#### 3.2 decryptMessageWithPrivateKey()

[GitHub (Lines 162–172)](https://github.com/homeronkis/test-code-snippets/blob/main/encryption.ts#L162-L172)

- **Purpose**: Decrypts ciphertext using the corresponding **private key**.
- **Usage**:
   1. Make sure the private key is available as a CryptoKey (import it if needed).
   2. Pass the ciphertext to **decryptMessageWithPrivateKey(privateKey, encryptedMessage)**.
   3. The function returns the **original plaintext** message.


### 4. Create an Encrypted Chat

1. **Generate an RSA Key Pair**
   - Use a function like **generateRSAKeyPair()** to produce a **unique** public/private key pair dedicated to this chat (if needed).

2. **Convert & Protect the Chat’s Private Key** (Optional)
   - If you create a **separate** key pair for the chat itself (rather than per-user keys), you may:
      1. Call **exportPrivateKeyToBase64(chatKeyPair.privateKey)** to get the private key in Base64.
      2. Derive a **chat password** (e.g., using *uuidv4()*).
      3. Encrypt the private key with **encryptPrivateKeyWithEmbeddedIvSalt(base64PrivateKey, chatPassword, useIVAndSalt)**.

3. **Share the Chat Password (If Applicable)**
   1. Import the participant’s public key via **importPublicKeyFromBase64()**.
   2. Use **encryptMessageWithPublicKey()** to encrypt the **chat password** for that participant.
   3. The participant can then decrypt it with their own private key.

4. **Save the Chat Data**
   - Pass relevant fields to your chat creation function (e.g., **createChat()**):
      - **encryptedPrivateKey** (if using a dedicated chat key pair and you encrypt it),
      - **publicKey** (Base64 representation of the chat’s public key),
      - **encryptedChatPasswords** (one for each participant, if applicable),
      - or an **AES key** for attachments (via **generateAESKey()**).

5. **Initialization**
   - Store the chat’s metadata (public key, encrypted private key, etc.) so clients can retrieve and decrypt it as needed.


### 5. Send & Receive Messages in the Encrypted Chat

#### 5.1 Sending Encrypted Messages

1. **Retrieve the Public Key**
   - Get or import the **public key** (from the user or the dedicated chat).

2. **Encrypt the Message**
   - Call **encryptMessageWithPublicKey(publicKey, messageContent)**.

3. **Transmit**
   - Send the encrypted text (e.g., via **sendMessage()**) to the server or directly to the recipient.

#### 5.2 Receiving & Decrypting Messages

1. **Decrypt the Private Key (If Necessary)**
   - If the private key is encrypted, retrieve it from storage and decrypt it with the known password.

2. **Import the Private Key**
   - Convert the Base64 private key into a **CryptoKey** object.

3. **Decrypt the Message**
   - Call **decryptMessageWithPrivateKey(privateKey, encryptedMessage)** to obtain the original plaintext.


### Functional Highlights

- **Connection Status**  
  Clear indication of whether you are connected or disconnected from the server.

- **Security Levels**  
  Easily upgrade your profile security to access advanced features.

- **Warning Modal**  
  Alerts you if you attempt to send messages in a non-encrypted chat.

- **Contact Notifications**  
  Prompt contacts to enable encryption for truly secure communication.

### SDK Methods
---
| **Method**                                        | **Description**                                                                                               |
|---------------------------------------------------|---------------------------------------------------------------------------------------------------------------|
| ****[Connect](connect)****                        | Connect to the server using user credentials and shared tokens.                                               |
| ****[Disconnect](disconnect)****                  | Disconnect from the server.                                                                                   |
| ****[Add User Encryption Info](addUserEncryptionInfo)**** | Add encryption settings to the user's profile.                                                                |
| ****[Get User Encryption Info](getUserEncryptionInfo)**** | Retrieve the current encryption settings of the user's profile.                                               |
| ****[Create Chat](createChat)****                 | Create a new chat (regular or encrypted) and handle chat initialization.                                      |
| ****[Send Message](sendMessage)****               | Send a message (encrypted or unencrypted, depending on the chat's encryption status).                         |
| ****[Get User Chats](getUserChats)****            | Load the list of chats, including details on whether each chat is encrypted.                                  |
| ****[Get Contacts](getContacts)****               | Retrieve the list of contacts for managing or creating chats.                                                 |
| ****[Accept Friend Invite](acceptFriendInvite)**** | Accept an incoming friend request.                                                                            |
| ****[Add Friend](addFriend)****                   | Send a friend request to another user.                                                                        |
| ****[Remove Friend](removeFriend)****             | Remove a friend from your contact list.                                                                       |
