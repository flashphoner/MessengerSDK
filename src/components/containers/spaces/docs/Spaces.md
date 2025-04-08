This page allows you to connect to the server,
create or join a space, manage categories, toggle channel privacy,
and view your contacts. It is designed so that only the appropriate buttons and forms appear,
depending on your status (e.g., whether you're the space creator or an invited member).

## Key Features

- Server Connection: Connect or disconnect from the server.
- Space Management: Create, join, and manage shared spaces.
- Categories: View categories within spaces.
- Channel Privacy: Toggle between public and private channels.
- Contacts: View, update, and lose/gain contacts based on shared space participation.


## Overview

### 1. Connect or Disconnect

1. **Connect**
  - At the top of the page, find the Connect button.
  - Click Connect to establish a server connection.
  - A status message (e.g., "Connected") confirms you are now online.

2. **Disconnect**
  - To end the session, click Disconnect.
  - The status updates to show you’re disconnected from the server.

**Tip**: Ensure you are connected before attempting to create or join a space.

### 2. Create or Join a Space

Depending on your role (e.g., if you’re the first user or an invitee), you’ll see different options:

1. **Create Space**
  - If you’re the first user, you’ll see a Create Space form.
  - Enter a name for your new space and click Create.
  - Once created, the space name appears in the Space section.

2. **Generate Invite Code** (Optional)
  - As the space creator, you can generate an invite code for others to join.
  - Click Generate space invite.
  - Copy the invite code to share with teammates.

3. **Join Space**
  - If you’re an invited user, the page shows a Join Space form.
  - Enter the Invite Code provided by the space creator, then click Join.
  - Once joined, you see details about the space, including Categories and Channels.

### 3. Space Details and Actions

1. **Viewing Your Space**
  - After creating or joining, the space’s name appears.
  - You’ll see additional buttons (e.g., Leave, Delete) based on your permissions.

2. **Leave Space**
  - If you are not the space creator, you have a Leave button.
  - Click Leave to exit the space. You will no longer see its channels or contacts.

3. **Delete Space**
  - If you are the space creator, you’ll see a Delete button instead of Leave.
  - Clicking Delete removes the space for all members.

### 4. Categories

Each space can have one or more categories for organizational purposes:

- **Viewing Categories**
  - The Categories section lists the available category names.
  - For example, you might see "General," "Projects," etc.
- **Category Details**
  - Currently, only the name is displayed, but your app could show the category creator or other info as needed.

### 5. Channels

Spaces include one or more channels for communication:

1. **Public Channels**
  - Visible to all members in the space.
  - Users automatically appear in each other’s Contacts when sharing a public channel.

2. **Private Channels**
  - Restricted to only the members you explicitly add to the channel.
  - Non-members cannot see or access this channel.
  - They also disappear from each other’s Contacts if they are not in at least one shared public channel.

3. **Toggling Channel Privacy**
  - If you are the space creator (or have permission), you’ll see a button to Make Public or Make Private.
  - Clicking it will lock or unlock the channel’s visibility:
    - Private → non-members lose access and are removed from each other’s contact lists.
    - Public → all space members regain access, and their contact relationships are restored.

### 6. Contacts

The Contacts section displays the list of users you share a public channel with:

1. **Contacts Appear/Disappear Automatically**
  - If a channel goes private and you’re not included, those users disappear from your Contacts.
  - Switching the channel back to public makes them reappear.

2. **Managing Contacts**
  - There is no direct "Add/Remove" contacts button on this page.
  - Instead, contact visibility is driven by channel membership.

### SDK Methods
---
| **Method**                                           | **Description**                             |
|------------------------------------------------------|---------------------------------------------|
| [Connect](connect)                                   | Connect to the server.                      |
| [Disconnect](disconnect)                             | Disconnect from the server.                 |
| [Create a space](createSpace)                        | Create a new shared space.                  |
| [Join to space](joinSpaceByInviteCode)               | Join an existing space using an invite code.|
| [Leave from space](leaveSpace)                       | Leave the current space.                    |
| [Get contacts](getContacts)                          | Retrieve the list of current contacts.      |
| [Generate space invite code](generateNewSpaceInvite) | Generate an invite code for a space.   |
