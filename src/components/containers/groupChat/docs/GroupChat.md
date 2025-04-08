Use the **Group Chat** SDK to manage server connections, create group chats, and interact with contacts. This guide explains how group chats dynamically influence contact connections between users.

## Key Features

- **Server Connection**: Connect or disconnect from the server.
- **Group Chat Management**: Create, leave, and manage group chats.
- **Contacts**: Maintain contacts dynamically based on group chat membership.


## How to Use

### 1. Server Connection

- Connect or Disconnect from the server.
- Status updates to **CONNECTED** or **DISCONNECTED**.

### 2. Group Chat Management

- **Create Group Chat**: Click **Create Group Chat** to start a chat with selected users.
- **Leave or Remove Group Chat**:
    - **Leave**: Click **Leave** to exit the group chat.
    - **Remove**: If the owner or a participant **removes** the group chat or **leaves**:
        - The group chat is **disbanded**, and all participants **lose contact** with each other.

### 3. Contacts

- **Group Chat = Contacts Connected**:
    - Users in the **same group chat** are added to each other's **contact lists**.
- **Leaving or Removing Chat**:
    - If a **participant leaves** or the **chat is deleted**, related contact connections are **removed**.
    - Contacts are maintained only if users are part of the **same group chat**.


## Scenario Summary

- **Contacts and Group Chats**:
    - When users are part of the **same group chat**, they appear in each other's **contact lists**.
    - If a user **leaves** the group chat or **the chat is deleted** by the owner:
        - **All contact links** between users in that chat are **removed**.
    - **Rejoining or creating** a new group chat will **restore contact connections**.

### SDK Methods
---
| **Method**                   | **Description**                            |
|------------------------------|--------------------------------------------|
| [Connect](connect)           | Connect to the server.                     |
| [Disconnect](disconnect)     | Disconnect from the server.                |
| [Create a chat](createChat)  | Create a new chat with selected users.|
| [Leave from chat](leaveChat) | Leave an existing group chat.              |
| [Delete a chat](deleteChat)  | Remove the group chat entirely.            |
| [Get contacts](getContacts)  | Retrieve the list of contacts.             |
