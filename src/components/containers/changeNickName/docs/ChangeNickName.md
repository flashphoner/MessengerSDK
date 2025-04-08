Use the **Change Nickname** SDK to manage server connections, create group chats, and update nicknames. This guide explains how nickname changes are reflected for all users in real-time.

## Key Features

- **Server Connection**: Connect or disconnect from the server.
- **Group Chat Management**: Create group chats.
- **Nickname Change**: Update your nickname, and changes are visible to all participants.
- **Contacts**: View the updated contacts with modified nicknames.


## How to Use

### 1. Server Connection

- Connect or Disconnect from the server.
- Status updates to **CONNECTED** or **DISCONNECTED**.

### 2. Group Chat Management

- **Create Group Chat**: Click **Create Group Chat** to start a conversation with selected users.

### 3. Nickname Change

- **Change Nickname**: Enter your new nickname in the **Change Nickname** section and click **Submit**.
  - **Real-time Update**: All users in shared group chats will see the updated nickname instantly.

### 4. Contacts

- **Contacts Update**:
  - Contact lists will reflect the **new nickname** once it is changed.
  - All participants in the same group or chat will **automatically see** the updated name in their contact lists and chat participants.


## Scenario Summary

- **Nickname Changes**:
  - Changing your **nickname** will automatically update the display for all users in **group chats** or **contact lists**.
  - This ensures all participants are aware of any **name changes** and keeps the information consistent and synchronized in real-time.

### SDK Methods
---
| **Method**                                     | **Description**                              |
|------------------------------------------------|----------------------------------------------|
| [Connect](connect)                             | Connect to the server.                       |
| [Disconnect](disconnect)                       | Disconnect from the server.                  |
| [Create a chat](createChat)                    | Create a new chat with selected users.  |
| [Change the user nickname](changeUserNickname) | Change the user's nickname.                  |
| [Get contacts](getContacts)                    | Retrieve the updated list of contacts.       |
