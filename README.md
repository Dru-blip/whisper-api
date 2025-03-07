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
    npx mikro-orm migration:create initial
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
