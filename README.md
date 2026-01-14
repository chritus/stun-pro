# Distributed Chat Application

This project is a distributed communication system that supports both group and private messaging. It is built with a React frontend, a Node.js backend using WebSockets, and Firebase for the database.

## Project Description

This application allows multiple users to connect and communicate across a network. Users can create and join groups, send messages to the entire group (multicast), and send private messages to specific online members (unicast). The system demonstrates key concepts in distributed systems, such as explicit message delivery, active membership management, and basic communication reliability.

## Core Features

*   **Group Management:**
    *   Users can create a group.
    *   Users can join or leave a group.
    *   The system keeps track of active members.
*   **Group Communication:**
    *   A member can send a message to the entire group.
    *   All online members of the group receive the message.
*   **Private Messaging:**
    *   A member can choose a specific user in the group and send a direct private message.
    *   Only the intended recipient receives the private message.
*   **Distributed Operation:**
    *   The system runs across multiple nodes (simulated on a single machine).
    *   Communication uses WebSockets for message passing.
*   **Reliability:**
    *   Detects when a member joins or leaves.
    *   Logs messages in Firebase.

## Tech Stack

*   **Frontend:** React, Vite
*   **Backend:** Node.js, Express, WebSockets (`ws`)
*   **Database:** Firebase Firestore

## How to Run

### Backend

1.  Navigate to the `backend` directory.
2.  Install dependencies: `npm install`
3.  Create a `serviceAccountKey.json` file in the `backend` directory with your Firebase service account credentials.
4.  Start the server: `npm start`

The backend server will be running on `http://localhost:8080`.

### Frontend

1.  Navigate to the `chat-frontend` directory.
2.  Install dependencies: `npm install`
3.  In `src/firebase.js`, replace the placeholder Firebase config with your own.
4.  Start the frontend application: `npm run dev`

The frontend will be running on `http://localhost:5173` (or another port if 5173 is in use).

## Implemented Features

*   **User Identification:** Users can enter a username to join the chat.
*   **Real-time User List:** Users can see a list of other online users.
*   **Group Creation:** Users can create new chat groups.
*   **Join Group:** Users can join existing groups.
*   **Group Messaging:** Users can send messages to groups they have joined.
*   **Private Messaging:** Users can send private messages to other users.
*   **Message Persistence:** Messages are stored in Firebase Firestore.
*   **Minimalist UI:** The UI is designed to be simple and easy to use, inspired by WhatsApp.
*   **Reliability:** The system detects when users join or leave and updates the user list accordingly.
