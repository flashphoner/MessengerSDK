Use the **Presence** SDK to manage server connections, update your status, and interact with friends.

```mermaid
sequenceDiagram
    participant Bob
    participant SDK
    participant Alice
    
    Bob ->> SDK: 1. connect()
    SDK -->> Bob: 2. connect response with authToken
    Bob ->> SDK: 3. getUserInfo()
    SDK -->> Bob: 4. resolve Promise USER_INFO
    Alice ->> SDK: 5. connect()
    Alice ->> SDK: 6. getUserInfo()
    SDK -->> Alice: 7. resolve Promise USER_INFO
    Bob ->> SDK: 8. updatePresenceStatus()
    SDK -->> Bob: 9. Event USER_INFO_CHANGED
    SDK -->> Bob: 10. Event USER_PRESENCE_STATUS_UPDATED
    SDK -->> Alice: 11. Event USER_PRESENCE_STATUS_UPDATED
    
```

### 1. Bob Connect
- Click on **Connect** button invoke  **[connect](connect)**  function on the SDK.
  Bob’s client opens a WebSocket session and authenticates.

**Call**
[Github (Lines 86–95)](https://github.com/flashphoner/MessengerSDKSamples/blob/1.0/src/hooks/sdk/useSdkConnection.ts#L86-L95)

**Doc**
[Github (Lines 71–84)](https://github.com/flashphoner/MessengerSDKSamples/blob/1.0/src/hooks/sdk/useSdkConnection.ts#L71-L84)

### 2. Receive authToken from **[connect](connect)** response
- used to bob's second connection
[Github (Lines 80–84)](https://github.com/flashphoner/MessengerSDKSamples/blob/1.0/src/hooks/sdk/useSdkConnection.ts#L80-L84)

### 3. Bob calls **[getUserInfo](getUserInfo)**
- After the connection is established, we are getting self-information about user
[Github (Lines 104)](https://github.com/flashphoner/MessengerSDKSamples/blob/1.0/src/hooks/sdk/useSdkConnection.ts#L104-L104)

### 4. Bob receives USER_INFO
- Information about user
[Github (Lines 98-102)](https://github.com/flashphoner/MessengerSDKSamples/blob/1.0/src/hooks/sdk/useSdkConnection.ts#L98-L102)

### 5. Alice Connect
- Click on **Connect** button invoke  **[connect](connect)**  function on the SDK.
  Alice’s client opens a WebSocket session and authenticates.

**Call**
[Github (Lines 86–95)](https://github.com/flashphoner/MessengerSDKSamples/blob/1.0/src/hooks/sdk/useSdkConnection.ts#L86-L95)

**Doc**
[Github (Lines 71–84)](https://github.com/flashphoner/MessengerSDKSamples/blob/1.0/src/hooks/sdk/useSdkConnection.ts#L71-L84)

### 6. Alice calls **[getUserInfo](getUserInfo)**
- After the connection is established, we are getting self-information about user
[Github (Lines 104)](https://github.com/flashphoner/MessengerSDKSamples/blob/1.0/src/hooks/sdk/useSdkConnection.ts#L104-L104)

### 7. Alice receives USER_INFO
- Information about user
[Github (Lines 98-102)](https://github.com/flashphoner/MessengerSDKSamples/blob/1.0/src/hooks/sdk/useSdkConnection.ts#L98-L102)

### 8. Bob calls **[updatePresenceStatus](updatePresenceStatus)**
- Select your status from the dropdown:
  - **Online**: Available.
  - **Idle**: Inactive.
  - **Do Not Disturb**: No interruptions.
  - **Invisible**: Appear offline.
- Status updates in real-time for friends.

**Call**
[Github (Lines 19)](https://github.com/flashphoner/MessengerSDKSamples/blob/1.0/src/hooks/sdk/useSdkPresence.ts#L19-L19)

**Doc**
[Github (Lines 8-11)](https://github.com/flashphoner/MessengerSDKSamples/blob/1.0/src/hooks/sdk/useSdkPresence.ts#L8-L11)

### 9. Bob receives USER_INFO_CHANGED

```tsdoc
{
  userId: UserId,
  info: UserInfo
}
```

### 10. Bob receives USER_PRESENCE_STATUS_UPDATED
[Github (Lines 23–30)](https://github.com/flashphoner/MessengerSDKSamples/blob/1.0/src/events/presence.ts#L23-L30)

### 11. Alice receives USER_PRESENCE_STATUS_UPDATED
[Github (Lines 23–30)](https://github.com/flashphoner/MessengerSDKSamples/blob/1.0/src/events/presence.ts#L23-L30)

### SDK Methods
---

| **Method**                                           | **Description**                                                 |
|------------------------------------------------------|-----------------------------------------------------------------|
| ****[connect](connect)****                           | Connect to the server using user credentials and shared tokens. |
| ****[disconnect](disconnect)****                     | Disconnect from the server.                                     |
| ****[getUserInfo](getUserInfo)****                   | Get information about user.                                     |
| ****[updatePresenceStatus](updatePresenceStatus)**** | Update your presence status.                                    |
| ****[getContacts](getContacts)****                   | Retrieve the list of friends.                                   |
---
