**Presence Activity SDK Usage Guide**

Use the `Presence Activity` SDK to manage server connections, update activity status, and interact with friends.

---

### 📌 Key Features

1. 🌐 **Server Connection**: Connect or disconnect from the server.
2. ⚙️ **Current Activity**: View and toggle your activity status (e.g., Idle/Active).
3. 👥 **Friends List**: View and monitor friends.

---

### 🚀 How to Use

#### 1. Server Connection
- **Connect** or **Disconnect** from the server.
- Status updates to **CONNECTED** or **DISCONNECTED**.

#### 2. Current Activity
- Toggle your activity status using **Change Activity**.
- Status can be `idle` or `active` to show current behavior.

#### 3. Friends Management
- View your friends with their name, email, and status.
- Friend list updates in real-time as statuses change.

---

### 🔑 SDK Methods

| **Method**                                     | **Description**                         |
|------------------------------------------------|-----------------------------------------|
| [Connect](connect)                             | Establish a connection to the server.   |
| [Disconnect](disconnect)                       | Terminate the connection.               |
| [Update activity status](updateActivityStatus) | Toggle your activity state.             |
| [Friends list](getContacts)                    | Retrieve the list of friends.           |
