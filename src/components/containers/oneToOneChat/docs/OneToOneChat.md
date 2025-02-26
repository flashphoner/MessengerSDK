**One-to-One Chat SDK Usage Guide**

The `One-to-One Chat` page demonstrates a practical example of using the SDK for managing server connections, creating and managing chats, and interacting with contacts. This guide explains each section and includes critical notes about the behavior of chats and contact relationships.

---

### 📌 Overview

The interface is divided into the following functional areas:

1. 🌐 **Server Connection**: Connect or disconnect from the server.
2. 💬 **Group Chat Management**: Create, leave, and manage group chats.
3. 👥 **Contacts**: Maintain contacts dynamically based on group chat membership.
---

### 🚀 How to Use

#### 1. Connection to Server
- **Purpose**: Establish or terminate a connection to a server using valid credentials.
- **Steps**:
    - Click **Connect** to establish a connection.
    - The status changes to **CONNECTED** upon success.
    - Click **Disconnect** to terminate the connection. The status changes to **DISCONNECTED**.
- **What to Monitor**:
    - Ensure the connection status updates accurately.
    - If the connection fails, check the credentials and server URL.

---

#### 2. Managing Chats
- **Purpose**: Create, manage, and interact within one-to-one chats.
- **Steps**:
    1. **Create a Chat**:
        - Click **Create Chat** in the **Chat** section to establish a one-to-one chat between the connected users.
        - The chat name will reflect the usernames of the participants (e.g., `user90, user84`).
    2. **Delete or Leave a Chat**:
        - To remove the chat:
            - The **Delete** button allows complete deletion of the chat.
            - The **Leave** button removes the user from the chat.
- **Critical Note**:
    - If **either user deletes or leaves the chat**, the associated contacts will lose their connection. This means the relationship between the users is no longer maintained unless a new chat is created.
- **What to Monitor**:
    - Ensure the chat reflects the current participants accurately.
    - Monitor the contact list to confirm that relationships are preserved only while the chat exists.

---

#### 3. Managing Contacts
- **Purpose**: View and interact with contacts associated with the chat.
- **Steps**:
    - Contacts displayed in the **Contacts** section are automatically associated when a chat is created.
    - If the chat is deleted or a user leaves, the contact association is removed.
- **What to Monitor**:
    - Ensure the contact list updates dynamically when chats are created or removed.
    - Understand that contacts are tied to the chat’s existence.

---

### 🔑 Key SDK Functionalities

1. **Connection Management**:
    - Use the `connect` and `disconnect` methods to handle server connections.
2. **Chat Management**:
    - Use `createChat` to start a chat between users.
    - Use `deleteChat` or `leaveChat` to terminate the chat and remove the relationship between contacts.
3. **Contact Management**:
    - Contacts are tied to the existence of chats and are managed dynamically.

---

### 📄 Example Interface Sections

### Connection to Server
- Shows the current connection state (e.g., CONNECTED, DISCONNECTED).
- Buttons: **Connect** and **Disconnect**.

### Chat
- **Create Chat**: Establish a one-to-one chat between users.
- **Delete Chat**: Completely remove the chat and associated contact relationships.
- **Leave Chat**: Exit the chat, removing contact associations for the leaving user.

### Contacts
- Displays the list of contacts associated with the current chat.
- Updates dynamically when chats are created or removed.

---

### ⚠️ Important Note

- **Contact Relationships**: Contacts are tied directly to the existence of chats. If a user leaves or deletes the chat:
    - The associated contacts will lose their relationship.
    - To re-establish the connection, a new chat must be created.
---
### 🛠 Methods

| **Method**                   | **Description**                                    |
|------------------------------|----------------------------------------------------|
| [Connect](connect)           | Establish a connection to the server.             |
| [Disconnect](disconnect)     | Terminate the connection to the server.           |
| [Create a chat](createChat)  | Create a one-to-one chat between two users.        |
| [Delete a chat](deleteChat)  | Delete the chat and remove associated contacts.    |
| [Leave from chat](leaveChat) | Leave the chat and remove the relationship.        |
| [Get contacts](getContacts)  | Retrieve the list of associated contacts.          |

---
