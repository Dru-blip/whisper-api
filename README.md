# Whisper API

This repository provides a  API for Whisper clients, built using NestJS, MikroORM, TypeScript, PostgreSQL, Redis, Nodemailer, and Socket.IO.

## Technologies

-   **[NestJS](https://nestjs.com/):** A progressive Node.js framework for building efficient and scalable server-side applications.
-   **[TypeScript](https://www.typescriptlang.org/):** A strongly typed programming language that builds on JavaScript.
-   **[MikroORM](https://mikro-orm.io/):** A TypeScript ORM for Node.js based on Data Mapper, Unit of Work and Identity Map patterns.
-   **[PostgreSQL](https://www.postgresql.org/):** A powerful, open-source relational database system.
-   **[Redis](https://redis.io/):** An in-memory data structure store, used as a database, cache, and message broker.
-   **[Nodemailer](https://nodemailer.com/about/):** A module for Node.js applications to send emails.
-   **[Socket.IO](https://socket.io/):** A library that enables real-time, bidirectional, and event-based communication between web clients and servers.
-   **Docker & Docker Compose:** Containerization and orchestration for easy deployment.

## TODO List
### Friend System
-   [ ] Create `FriendRequest` entity in MikroORM.
-   [ ] Implement API endpoints for sending, accepting, and declining friend requests.
-   [ ] Implement user search functionality.
-   [ ] **Real-time:** Implement Socket.IO event for new friend requests (`friendRequest:new`).
-   [ ] **Real-time:** Implement Socket.IO event for accepted friend requests (`friendRequest:accepted`).
-   [ ] **Real-time:** Implement Socket.IO event for declined friend requests (`friendRequest:declined`).
-   [ ] **Real-time:** Implement Socket.IO event for when a user is blocked/unblocked (`user:blocked`, `user:unblocked`).

### Conversations (Direct Messages)

-   [ ] Create `Conversation` and `Message` entities.
-   [ ] Implement real-time messaging via Socket.IO.
    -   [ ] **Real-time:** Implement Socket.IO event for new messages (`message:new`).
    -   [ ] **Real-time:** Implement Socket.IO event for message updates (edits, deletions) (`message:updated`).
-   [ ] Implement message history retrieval.
-   [ ] Implement message read receipts (optional).
    -   [ ] **Real-time:** Implement Socket.IO event for message read receipts (`message:read`).

### Channels (Group Conversations)

-   [ ] Create `Channel`, `ChannelMembership`, and `ChannelMessage` entities.
-   [ ] Implement channel creation and management endpoints.
-   [ ] Implement real-time channel messaging.
    -   [ ] **Real-time:** Implement Socket.IO event for new channel messages (`channelMessage:new`).
    -   [ ] **Real-time:** Implement Socket.IO event for channel message updates (`channelMessage:updated`).
-   [ ] Implement channel administration permissions.
    -   [ ] **Real-time:** Implement Socket.IO event for user joins/leaves (`channel:userJoined`, `channel:userLeft`).
    -   [ ] **Real-time:** Implement Socket.IO events for permission changes (`channel:permissionsUpdated`).
-   [ ] Implement channel invites.
    -   [ ] **Real-time:** Implement Socket.IO event for channel invites (`channel:invite`).

### General

-   [ ] Write unit and integration tests for all new features, including Socket.IO event handling.
-   [ ] Improve API documentation, including Socket.IO event schemas.
-   [ ] Refactor code for better organization, especially Socket.IO event handling.
-   [ ] Implement efficient handling of Socket.IO connections and disconnections.
-   [ ] Implement proper authentication and authorization for Socket.IO events.
-   [ ] Implement robust error handling for Socket.IO events.
-   [ ] Implement rate limiting for Socket.IO events.
-   [ ] Consider using Redis Pub/Sub for scaling Socket.IO.


## Prerequisites
-   Node.js
-   PostgreSQL
-   Redis
-   NPM
-   docker and docker compose

## Installation
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Dru-blip/whisper-api.git
    cd whisper-api
    ```
2.  **Install dependencies:**
    ```bash
    npm install # or yarn install
    ```
3.  **Configure environment variables:**

    Create a `.env` file in the root directory and populate it with the necessary environment variables. Example:
    ```
    ACCESS_TOKEN_SECRET=<secret>
    REFRESH_TOKEN_SECRET=<secret>
    ONBOARDING_TOKEN_SECRET=<secret>
    COOKIE_SECRET=<secret>
    ACCESS_TOKEN_EXPIRY=15m
    REFRESH_TOKEN_EXPIRY=7d
    ONBOARDING_TOKEN_EXPIRY=30m
    ```
    ```
    DB_NAME=<database_name>
    DB_PASSWORD=<database_password>
    DB_USER=<database_user>
    DB_PORT=5432
    ```

    ```
    EMAIL_USER=<gmail>
    EMAIL_PASS=<app-password>
    ```

4.  **Run database migrations:**

    ```bash
    npx mikro-orm migration:create --initial
    npx mikro-orm migration:up
    ```
5. **Running Docker containers**
    ```
        docker compose up
    ```

5.  **Start the development server:**

    ```bash
    npm run start:dev # or yarn start:dev
    ```


## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue.
