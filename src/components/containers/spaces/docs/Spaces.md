**Contacts Management SDK Usage Guide**

Use the `Contacts in space` SDK to manage server connections, create/join spaces, and interact with contacts within shared spaces. This guide emphasizes how contacts are updated dynamically based on shared space membership.

---

### 📌 Key Features

1. 🌐 **Server Connection**: Connect or disconnect from the server.
2. 🏠 **Space Management**: Create, join, and manage shared spaces.
3. 📋 **Categories**: View categories within spaces.
4. 👥 **Contacts**: View, update, and lose/gain contacts based on shared space participation.

---
### 🌟 Features Overview

#### 1. Server Connection
- **Connect** or **Disconnect** from the server.
- Status updates to **CONNECTED** or **DISCONNECTED**.

#### 2. Space Management
- **Create Space**: Enter a name and click **Create**.
- **Join Space**: Enter an invite code and click **Join**.
- **Leave Space**: Click **Leave** to exit the current space.
    - **Leaving the space** will **remove contacts** linked through that space.

#### 3. Categories
- View the list of categories within a space, including the **name** and **creator**.

#### 4. Contacts
- **Shared Space = Active Contacts**:
    - If users share a **space**, they are automatically added to each other's **contact list**.
- **Leaving or Deleting a Space**:
    - If a user **leaves** a shared space or **the space is deleted**, contacts associated with that space are **removed**.
    - Contacts are visible only if **both users remain in the same space**.

---
### 📝 Scenario Summary

- **Contacts and Spaces**:
    - When two users are in the **same space**, they appear in each other's **contact lists**.
    - If one user **leaves** or **deletes** the shared space:
        - Both users **lose contact**, and their **contact lists** are updated to reflect this.
    - If they **rejoin** the same space, they will be **added back** to each other's contact lists.

This mechanism ensures that contact lists dynamically update based on shared membership in spaces, reflecting real-time interactions and availability.


### 🔑 SDK Methods

| **Method**                                           | **Description**                             |
|------------------------------------------------------|---------------------------------------------|
| [Connect](connect)                                   | Connect to the server.                      |
| [Disconnect](disconnect)                             | Disconnect from the server.                 |
| [Create a space](createSpace)                        | Create a new shared space.                  |
| [Join to space](joinSpaceByInviteCode)               | Join an existing space using an invite code.|
| [Leave from space](leaveSpace)                       | Leave the current space.                    |
| [Get contacts](getContacts)                          | Retrieve the list of current contacts.      |
| [Generate space invite code](generateNewSpaceInvite) | Generate an invite code for a space.   |
