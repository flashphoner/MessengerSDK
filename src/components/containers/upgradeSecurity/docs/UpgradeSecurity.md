### Upgrade Profile Security for Encrypted Features

This guide explains how to **upgrade your profile security** by enabling encryption and setting up a **Master Password**. These changes ensure your profile data is protected and allow you to access encrypted chats and other secure functionalities.

### Key Features

1. **Server Connection**
    - Connect or disconnect from the server using a simple button.
    - The connection status is clearly displayed (e.g., Connected, Disconnected).

2. **Profile Encryption**
    - Enable encryption for your profile to secure sensitive information.
    - Encryption is activated using a "Turn On Encryption" button.

3. **Upgrade Profile Access**
    - Once encryption is enabled, you can access advanced features (e.g., secure chats).
    - Hover over the encryption status tooltip or click **“Increase”** to unlock higher-level security.

4. **Cryptographic Settings**
    - Utilize RSA key pairs and (optionally) AES for added protection of profile data.
    - Keys are generated and managed behind the scenes, ensuring secure storage.

5. **Master Password**
    - A single password locks your private key and encryption settings.
    - Future updates will enable changing this Master Password if needed.


### How to Use

1. **Connect to the Server**
    - Click the "Connect" button to establish a connection.
    - Confirm that the interface changes to "Connected."

2. **Turn On Encryption**
    - Click the "Turn On Encryption" button to enable encryption for your profile.
    - Once enabled, your profile data is secured by RSA and/or AES keys.

3. **Manage Encryption Settings**
    - An **Encryption Options** form lets you configure parameters like **IV and Salt** usage.
    - The **Master Password** (default or user-chosen) is used to encrypt your private key.

4. **Upgrade Security Level**
    - If additional security levels are offered, hover over the tooltip and click **“Increase.”**
    - This raises your account’s security level, granting access to encrypted chats or other features.

5. **View Keys & Status**
    - The panel displays any stored **Public Key**, **Private Key** (encrypted), **IV**, and **Salt**.
    - A status indicator (Safe/Unsafe icon) shows whether encryption is ON or OFF.

6. **Master Password**
    - Secures your private key. If it’s still the default, consider updating to a stronger passphrase.
    - Future updates will allow you to **change** this password, re-encrypting your data as needed.


### Encryption Implementation Steps (Using Web Crypto)

Below is the **sequence of actions** required to **encrypt** your profile data and store keys securely when you turn on or upgrade encryption in the panel.

### 1. Generate & Store User Keys

Each user requires a unique **RSA key pair** to enable encrypted features.

**Generate an RSA Key Pair**  
[GitHub (Lines 1–13)](https://github.com/flashphoner/MessengerSDKSamples/blob/1.0/src/utils/encryption.ts#L1-L13)
- Creates both a **public** and a **private** key.
- The **public key** may be shared with the server or other users, while the **private key** remains confidential.

### 1.1 exportPrivateKeyToBase64()

[GitHub (Lines 15–18)](https://github.com/flashphoner/MessengerSDKSamples/blob/1.0/src/utils/encryption.ts#L15-L18)

- **Purpose**: Converts the generated private key into a Base64 string for storage or transmission.
- **Usage**:
    1. After generating a key pair (e.g. **generateRSAKeyPair()**), call **exportPrivateKeyToBase64(privateKey)**.
    2. The returned Base64-encoded private key can be stored locally or sent to the server.

> **Important**: Always protect the Base64 private key – for instance, encrypt it with a user-chosen password.

### 1.2 exportPublicKeyToBase64()

[GitHub (Lines 34–37)](https://github.com/flashphoner/MessengerSDKSamples/blob/1.0/src/utils/encryption.ts#L34-L37)

- **Purpose**: Converts the generated public key into a Base64 string, so others can easily encrypt data for you.
- **Usage**:
    1. Call **exportPublicKeyToBase64(publicKey)** after generating your RSA key pair.
    2. Store or share the Base64 version to let the server or contacts encrypt data for your account.

### 1.3 importPublicKeyFromBase64()

[GitHub (Lines 39–51)](https://github.com/flashphoner/MessengerSDKSamples/blob/1.0/src/utils/encryption.ts#L39-L51)

- **Purpose**: Converts a Base64-encoded public key back into a **CryptoKey** object.
- **Usage**:
    1. Receive a public key from a contact or server, then call **importPublicKeyFromBase64(base64Key)**.
    2. The result is a CryptoKey for encrypting messages or a session password for that user.


### 2. Protect the Private Key

### 2.1 deriveKeyFromPassword()

[GitHub (Lines 53–75)](https://github.com/flashphoner/MessengerSDKSamples/blob/1.0/src/utils/encryption.ts#L53-L75)

- **Purpose**: Creates a cryptographic key based on a user-supplied Master Password.
- **Usage**:
    - This key is used to encrypt or decrypt the RSA private key before storing it.

### 2.2 encryptPrivateKeyWithEmbeddedIvSalt()

[GitHub (Lines 96–114)](https://github.com/flashphoner/MessengerSDKSamples/blob/1.0/src/utils/encryption.ts#L96-L114)

- **Purpose**: Encrypts the Base64-encoded private key with a password-derived key, embedding the **IV** and **salt** in the final string.
- **Usage**:
    1. Convert the private key to Base64 (**exportPrivateKeyToBase64()**).
    2. Call **encryptPrivateKeyWithEmbeddedIvSalt(base64PrivateKey, password, useIVAndSalt)**.
    3. Store or transmit this **encrypted** private key, which is safe to store server-side.

### 2.3 decryptPrivateKey()

[GitHub (Lines 116–147)](https://github.com/flashphoner/MessengerSDKSamples/blob/1.0/src/utils/encryption.ts#L116-L147)

- **Purpose**: Reverses the above step to get back the original Base64 private key.
- **Usage**:
    1. Retrieve the **encrypted private key** from the server or local storage.
    2. Use the same password to recover the original private key for decryption operations.

### SDK Methods
---
| **Method**                                        | **Description**                                                                                               |
|---------------------------------------------------|---------------------------------------------------------------------------------------------------------------|
| [Connect](connect)                                | Connect to the server using user credentials and shared tokens.                                               |
| [Disconnect](disconnect)                          | Disconnect from the server.                                                                                   |
| [Add Friend](addFriend)                           | Send a friend request.                                                                                       |
| [Revoke Invite](revokeFriendInvite)               | Revoke an outgoing friend request.                                                                            |
| [Accept Friend](acceptFriendInvite)               | Accept an incoming friend request.                                                                            |
| [Reject Invite](rejectFriendInvite)               | Reject an incoming friend request.                                                                            |
| [Get Contacts](getContacts)                       | Retrieve the list of contacts.                                                                               |
| [Remove Friend](removeFriend)                     | Remove a friend from your contact list.                                                                      |
| [Add User Encryption Info](addUserEncryptionInfo) | Add encryption settings (keys, statuses) to the user's profile.                                              |
| [Get User Encryption Info](getUserEncryptionInfo) | Retrieve current encryption settings (e.g., whether encryption is on) of the user's profile.                  |

