**Access Rights SDK Usage Guide**

Use the `Access Rights` SDK to manage server connections, create/join spaces, organize categories, and interact with channels, including managing privacy settings that affect user access and contact lists.

---

### 📌 Key Features

1. 🌐 **Server Connection**: Connect or disconnect from the server.
2. 🏠 **Space Management**: Create, join, and manage spaces.
3. 🗂 **Categories**: View and manage categories within spaces.
4. 📢 **Channels**: Manage channels (public or private) and access rules.
5. 👥 **Contacts**: View and interact with contact lists depending on channel access.

---

### 🚀 How to Use

#### 1. Server Connection
- **Connect** or **Disconnect** from the server.
- Status updates to **CONNECTED** or **DISCONNECTED**.

#### 2. Space Management
- **Create Space**: Enter a name and click **Create**.
- **Join Space**: Enter an invite code and click **Join**.
- **Leave Space**: Click **Leave** to exit the current space.

#### 3. Categories
- View categories within a space, including **name** and **creator**.

#### 4. Channels
- **Public/Private Channels**:
    - View and manage channels within a space.
    - Toggle channel visibility between **Public** and **Private**:
        - When a channel becomes **Private**, users who are not members will lose access:
            - The second user will **no longer see the channel**.
            - **Contacts** between users will also be removed, making the contact list **empty**.
        - When a channel is returned to **Public**:
            - The second user **regains access** to the channel.
            - **Contacts** between users are restored.

#### 5. Contacts
- **Public Channel**: Users can see each other and are connected as contacts.
- **Private Channel**: When access is restricted, users lose visibility of each other.

---

### 📝 Scenario Summary

- **Public Channel**: Users can **see channels** and **connect as contacts**.
- **Private Channel**: Users who are **not members** lose:
    - **Channel visibility**.
    - **Contact connection**, resulting in an **empty contact list**.
- **Switching Back to Public**: Users regain:
    - **Channel access**.
    - **Contacts**, reconnecting them to the network.

---

## 🔑 SDK Methods

| **Method**                                 | **Description**                            |
|--------------------------------------------|--------------------------------------------|
| [Connect](connect)                         | Connect to the server.                     |
| [Disconnect](disconnect)                   | Disconnect from the server.                |
| [Create a space](createSpace)              | Create a new space.                        |
| [Join to space](joinSpaceByInviteCode)     | Join an existing space using invite code.  |
| [Leave from space](leaveSpace)             | Leave the current space.                   |
| [Update space channel](updateSpaceChannel) | Change channel between public and private. |
| [Get contacts](getContacts)                | Retrieve the list of contacts.             |
| [Delete a space](deleteSpace)              | Delete space                               |

