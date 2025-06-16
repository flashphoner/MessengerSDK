This guide explains how to use the Encrypted group chat feature.

#  SDK Interaction Diagram
- Connect three users
- Add friend
- Share contacts

## Friend‑request sequence

```mermaid
sequenceDiagram
    participant Bob
    participant SDK
    participant Alice
    participant Kiri
    
    Bob   ->> SDK: 1. connect()
    SDK   -->> Bob: 2. USER_INFO
    Alice ->> SDK: 3. connect()
    SDK   -->> Alice: 4. USER_INFO
    Kiri  ->> SDK: 5. connect()
    SDK   -->> Kiri: 6. USER_INFO
    Bob   ->> SDK: 7. addFriend(Alice)
    Bob   ->> SDK: 8. addFriend(Kiri)
    SDK   -->> Bob: 9.  NEW_OUTGOING_FRIEND_INVITE
    SDK   -->> Bob: 10. NEW_OUTGOING_FRIEND_INVITE
    SDK   -->> Alice: 11. NEW_INCOMING_FRIEND_INVITE
    SDK   -->> Kiri: 12. NEW_INCOMING_FRIEND_INVITE
    Alice ->> SDK: 13. acceptFriendInvite
    Kiri  ->> SDK: 14. acceptFriendInvite
    SDK   -->> Alice: 15. INCOMING_FRIEND_INVITE_DELETED
    SDK   -->> Kiri: 16. INCOMING_FRIEND_INVITE_DELETED
    SDK   -->> Bob: 17. OUTGOING_FRIEND_INVITE_DELETED
    SDK   -->> Alice: 18. NEW_CONTACT
    SDK   -->> Bob: 19. NEW_CONTACT
    SDK   -->> Kiri: 20. NEW_CONTACT
```

1. **Bob → SDK — connect()**  
   Bob opens a WebSocket session and authenticates.

2. **SDK → Bob — USER_INFO**  
   SDK sends Bob his profile, feature flags, and authoritative userId.

3. **Alice → SDK — connect()**  
   Alice starts her own session.

4. **SDK → Alice — USER_INFO**  
   Server returns Alice’s profile and userId.

5. **Kiri → SDK — connect()**  
   Kiri opens a third session.

6. **SDK → Kiri — USER_INFO**  
   Server returns Kiri’s profile and userId.

7. **Bob → SDK — addFriend(Alice)**  
   Bob sends a friend request addressed to Alice.

8. **Bob → SDK — addFriend(Kiri)**  
   Bob sends a friend request addressed to Kiri.

9. **SDK → Bob — NEW_OUTGOING_FRIEND_INVITE**  
   Bob’s request to Alice is now marked *pending*.

10. **SDK → Bob — NEW_OUTGOING_FRIEND_INVITE**  
    Bob’s request to Kiri is now marked *pending*.

11. **SDK → Alice — NEW_INCOMING_FRIEND_INVITE**  
    Alice is notified of Bob’s request.

12. **SDK → Kiri — NEW_INCOMING_FRIEND_INVITE**  
    Kiri is notified of Bob’s request.

13. **Alice → SDK — acceptFriendInvite**  
    Alice accepts Bob’s invite.

14. **Kiri → SDK — acceptFriendInvite**  
    Kiri accepts Bob’s invite.

15. **SDK → Alice — INCOMING_FRIEND_INVITE_DELETED**  
    Alice’s pending invite disappears.

16. **SDK → Kiri — INCOMING_FRIEND_INVITE_DELETED**  
    Kiri’s pending invite disappears.

17. **SDK → Bob — OUTGOING_FRIEND_INVITE_DELETED**  
    Bob’s outgoing invite list is cleared.

18. **SDK → Alice — NEW_CONTACT**  
    Bob is added to Alice’s confirmed contacts.

19. **SDK → Bob — NEW_CONTACT**  
    Alice is added to Bob’s confirmed contacts.

20. **SDK → Kiri — NEW_CONTACT**  
    Bob is added to Kiri’s confirmed contacts.

**Result:** After step 20 all three users are mutual contacts and can chat one‑on‑one or together in a group.

> **How the chat is started in the UI**  
> Bob opens **section with title - New chat*, ticks **Alice** and **Kiri**, then clicks **Create**.  
> The component now runs the encrypted sequence shown below.

**Encrypted steps**
- Upgrade profiles
- Share contact 

```mermaid
sequenceDiagram
    participant Bob
    participant SDK
    participant Alice
    participant Kiri
    
    Note over Bob: App actions:<br/> 1. Generate keys<br/>2. Export keys<br/>3. Derive AES key<br/>4. Make verification hash<br/>5. (opt) add IV + salt
    Note over Alice: App actions:<br/> 6‑10. Same five steps
    Note over Kiri: App actions:<br/> 11‑15. Same five steps

    Bob   ->> SDK: 16. addUserEncryptionInfo()
    SDK   -->> Bob: 17. CONTACT_UPDATED
    SDK   -->> Bob: 18. USER_ENCRYPTION_INFO_ADDED
    SDK   ->> Alice: 19. CONTACT_UPDATED
    SDK   ->> Kiri: 20. CONTACT_UPDATED

    Alice ->> SDK: 21. addUserEncryptionInfo()
    SDK   -->> Alice: 22. CONTACT_UPDATED
    SDK   -->> Alice: 23. USER_ENCRYPTION_INFO_ADDED
    SDK   ->> Bob: 24. CONTACT_UPDATED
    SDK   ->> Kiri: 25. CONTACT_UPDATED

    Kiri  ->> SDK: 26. addUserEncryptionInfo()
    SDK   -->> Kiri: 27. CONTACT_UPDATED
    SDK   -->> Kiri: 28. USER_ENCRYPTION_INFO_ADDED
    SDK   ->> Bob: 29. CONTACT_UPDATED
    SDK   ->> Alice: 30. CONTACT_UPDATED
```

# End‑to‑End Encryption Flow (Bob ⇌ Alice)

## Profile upgrade (per user)

### App actions:

### 1. Generate RSA Key Pair
[GitHub (Lines 1–13)](https://github.com/flashphoner/MessengerSDKSamples/blob/1.0/src/utils/encryption.ts#L1-L13)
- Required for encrypting your data.

#### 2. Export Keys to Base64

[GitHub (Lines 15–18)](https://github.com/flashphoner/MessengerSDKSamples/blob/1.0/src/utils/encryption.ts#L15-L18)

- **Purpose**: Converts the generated private key into a Base64 string for storage or transmission.
- **Usage**:
    1. After generating a key pair via **generateRSAKeyPair()**, call **exportPrivateKeyToBase64(privateKey)**.
    2. The returned Base64-encoded private key can be stored or sent to a server.

> **Important**: Always protect the Base64 private key. Encrypt it (e.g., with a password) before saving or transmitting.

[GitHub (Lines 34–37)](https://github.com/flashphoner/MessengerSDKSamples/blob/1.0/src/utils/encryption.ts#L34-L37)

- **Purpose**: Converts the generated public key into a Base64 string so that others can easily encrypt messages for you.
- **Usage**:
    1. Call **exportPublicKeyToBase64(publicKey)** after generating your RSA key pair.
    2. Store or share the Base64-encoded public key so other users can encrypt messages for you.


#### 3. Derive a key from the Master Password

[GitHub (Lines 53–75)](https://github.com/flashphoner/MessengerSDKSamples/blob/1.0/src/utils/encryption.ts#L53-L75)

- **Purpose**: Derives a cryptographic key from a user-supplied password now we are using static *MS-PASSWORD* value.
- **Usage**:
    - Internally used to generate a strong key from a user-chosen password or passphrase.
    - This derived key is then used to encrypt or decrypt the private key.

- Used to encrypt the private key securely.

### 4. Prepare verification hash
- Generate a verification hash by **MS-PASSWORD**.
  [GitHub (Lines 174 – 183)](https://github.com/flashphoner/MessengerSDKSamples/blob/1.0/src/utils/encryption.ts#L174-L183)

- Produces a one-way **SHA-256 fingerprint** that proves the client still possesses the correct master password, without revealing the password itself.
- Pass **verificationHash** inside **addUserEncryptionInfo()**


### 5. Encrypt the Private Key optional using IV and Salt
- IV and salt are embedded automatically or click on checkbox in *Encryption Options*
  [GitHub (Lines 96–114)](https://github.com/flashphoner/MessengerSDKSamples/blob/1.0/src/utils/encryption.ts#L96-L114)

- **Purpose**: Encrypts the Base64-encoded private key using a password-derived key, embedding the IV and salt in the resulting string.
- **Usage**:
    1. Get the Base64 private key via **exportPrivateKeyToBase64()**.
    2. Call **encryptPrivateKeyWithEmbeddedIvSalt(base64PrivateKey, password, useIVAndSalt)**.
    3. Store or send this **encrypted private key**, which contains the IV and salt.

### Repeat key-generation flow (second user, third user)
- These steps mirror **6–10**, but are performed by the second user (Alice):
- These steps mirror **11–15**, but are performed by the third user (Kiri):

### Persist encryption info (Bob)
- **16. addUserEncryptionInfo** — Bob uploads his *publicKey*, encrypted *privateKey*, IV and salt to the server.
- **17. CONTACT_UPDATED** — for Bob.
- **18. USER_ENCRYPTION_INFO_ADDED** — the server acknowledges Bob’s encryption data is now stored.
- **19. CONTACT_UPDATED** - about Bob to Alice
- **20. CONTACT_UPDATED** - about Bob to Kiri

### Persist encryption info (Alice)
- **21. addUserEncryptionInfo** — Alice performs the same upload with her own keys.
- **22. CONTACT_UPDATED** — the server confirms Alice’s contact card was refreshed.
- **23. USER_ENCRYPTION_INFO_ADDED** — the server acknowledges Bob’s encryption data is now stored.
- **24. CONTACT_UPDATED** — Event for Bob about Alice's updates.
- **25. CONTACT_UPDATED** — Event for Kiri about Alice's updates.


### Persist encryption info (Kiri)
- **26. addUserEncryptionInfo** — Kiri performs the same upload with her own keys.
- **27. CONTACT_UPDATED** — the server confirms Kiri’s contact card was refreshed.
- **28. USER_ENCRYPTION_INFO_ADDED** — the server acknowledges Kiri’s encryption data is now stored.
- **29. CONTACT_UPDATED** — Event for Bob about Alice's updates.
- **30. CONTACT_UPDATED** — Event for Alice about Alice's updates.

### Create encrypted chat diagram description

- Create encrypted chat
- Send encrypted message
- Decrypt message


```mermaid
sequenceDiagram
    participant Bob
    participant SDK
    participant Alice
    participant Kiri
    Bob   ->> SDK: 1. createChat(isEncryptionEnabled=true)
    SDK   -->> Bob: 2. Resolve SFU_NEW_CHAT
    SDK   -->> Alice: 3. Event SFU_NEW_CHAT
    SDK   -->> Kiri: 4. Event SFU_NEW_CHAT

    Bob   ->> SDK: 5. sendMessage(encrypted)
    SDK   -->> Bob: 6. Resolve SFU_MESSAGE_STATE
    SDK   -->> Alice: 7. Event SFU_MESSAGE
    SDK   -->> Kiri: 8. Event SFU_MESSAGE
    
    Note over Bob: App actions: <br/>9. Decrypt message
    Note over Alice: App actions: <br/>10. Decrypt message    
    Note over Kiri: App actions: <br/>11. Decrypt message   
```


### 1. Encrypted‑chat workflow (runtime)
- **Create encrypted chat**
  Bob calls **handleCreateEncryptedChat**, which
  [GitHub (Lines 143–177)](https://github.com/flashphoner/MessengerSDKSamples/blob/1.0/src/components/containers/encryptedChat/panel/EncryptedChatPanel.tsx#L143-L177)
- generates a temporary RSA key pair and an AES‑256;
- creates a random chat password with **uuidv4()**;
- encrypts the chat’s private key with **encryptPrivateKeyWithEmbeddedIvSalt**;
- loops through every contact and for each one
    - imports the contact’s public key with **importPublicKeyFromBase64**,
    - encrypts the chat password using **encryptMessageWithPublicKey**,
    - appends the result to **encryptedChatPasswords**;
- finally invokes **handleCreateChat** with  
  publicKey, encryptedPrivateKey, encryptedChatPasswords and encryptedAttachmentsSecretKey.

**2. Resolve SFU_NEW_CHAT** — server returns **chatId**

**3. Event SFU_NEW_CHAT** — Alice receives chat metadata: Bob’s chat public key and her encrypted chat password.
**4. Event SFU_NEW_CHAT** — Kiri receives chat metadata: Bob’s chat public key and her encrypted chat password.

**5. sendMessage** — Inside **handleSendMessage** the plaintext is encrypted with the chat public key and dispatched to the server.

[GitHub (Lines 198–240)](https://github.com/flashphoner/MessengerSDKSamples/blob/1.0/src/components/containers/encryptedChat/panel/EncryptedChatPanel.tsx#L198-L240)


**6. Resolve SFU_MESSAGE_STATE** — server stores the ciphertext and marks the message as **sent**.

**7. Event SFU_MESSAGE** — Alice’s client receives the encrypted payload in real time.
**8. Event SFU_MESSAGE** — Kiri’s client receives the encrypted payload in real time.

**9-11. Decrypt message**
- Alice retrieves chat keys via **getChatKeys** from keyManagementService(first access decrypts them with her chat password).
  [GitHub (Lines 41–48)](https://github.com/flashphoner/MessengerSDKSamples/blob/1.0/src/services/keyManagementService.ts#L41-L48)

- Passes the ciphertext to reveal the plaintext.
  [GitHub (Lines 162–172)](https://github.com/flashphoner/MessengerSDKSamples/blob/1.0/src/utils/encryption.ts#L162-L172)

**Result:** From this point on, every message and attachment in the chat is protected end‑to‑end.

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
