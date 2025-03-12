**Friends SDK Guide**

`Friends ` example page demonstrating how to use the SDK for managing server connections, friend requests, and friend lists.

---

### 📌 Key Features

1. 🌐 **Server Connection**: Connect or disconnect from a server.
2. 🤝 **Friend Requests**: Send, accept, reject, or revoke requests.
3. ⏳ **Pending Requests**: Manage incoming and outgoing requests.
4. 👥 **Friend List**: View, refresh, and manage friends.

---

### 🚀 How to Use

#### 1. 🌐 Server Connection
- 🚀 Connect or disconnect using credentials.
- Status reflects connection state.
- If issues arise, check server URL and credentials.

#### 2. 🤝 Sending Friend Requests
- ✉️ Enter username or email and click **Add Friend**.
- ⚠️ Error displayed if username is incorrect.
- Track requests under **Pending Requests**.

#### 3. ⏳ Managing Pending Requests

- 📥 **Incoming**: Accept (✔) or Reject (✖).

- 📤 **Outgoing**: Revoke (✖) sent requests.

- Accepted requests move to **Friends** list.

#### 4. 👥 Friend List Management
**Refresh** to update the list.
- Remove friends using **Remove Friend**.

---

### 🛠 Methods

| **Method**                          | **Description**                       |
|-------------------------------------|---------------------------------------|
| [Connect](connect)                  | Connect to the server.                |
| [Disconnect](disconnect)            | Disconnect from the server.           |
| [Add friend](addFriend)             | Send a friend request.                |
| [Revoke invite](revokeFriendInvite) | Revoke an outgoing friend request.    |
| [Accept friend](acceptFriendInvite) | Accept an incoming friend request.    |
| [Reject invite](rejectFriendInvite) | Reject an incoming friend request.    |
| [Get contacts](getContacts)         | Retrieve the list of friends.         |
| [Remove friend](removeFriend)       | Remove a friend from your list.       |

---

