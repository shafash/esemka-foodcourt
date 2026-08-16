# Esemka Foodcourt — Server

This folder contains the **backend API** for Esemka Foodcourt. It is built with **Node.js, Express, and Prisma**, and is responsible for handling authentication, users, menus, ingredients, tables, and reservations.

## Features

* User registration and login
* JWT-based authentication
* Role-based access for admins and members
* User management
* Menu and category management
* Ingredient and unit management
* Table management
* Table reservations
* Reservation status updates and cancellation
* Menu image uploads
* MySQL database integration with Prisma
* Request validation with Zod

## Tech Stack

* **Node.js** — JavaScript runtime
* **Express** — REST API framework
* **Prisma** — Database ORM
* **MySQL** — Database
* **JWT** — Authentication
* **bcrypt / bcryptjs** — Password hashing
* **Zod** — Request validation
* **Multer** — File uploads
* **Helmet** — HTTP security headers
* **CORS** — Cross-origin requests
* **Morgan** — Request logging
* **Dotenv** — Environment variables

## Project Structure

```text
server/
├── prisma/
│   ├── migrations/          # Database migrations
│   ├── schema.prisma        # Database schema
│   ├── seed.js              # Database seed
│   └── dedupe-categories.js
│
├── src/
│   ├── config/              # App and database configuration
│   ├── controllers/         # Request handlers
│   ├── errors/              # Custom error classes
│   ├── middleware/          # Authentication, roles, uploads, etc.
│   ├── routes/              # API routes
│   ├── services/            # Application/business logic
│   ├── utils/               # Helper functions
│   ├── validations/         # Zod validation schemas
│   ├── uploads/             # Upload-related files
│   └── app.js               # Express app configuration
│
├── generated/prisma/        # Generated Prisma client
├── uploads/                 # Uploaded files
├── .env                     # Environment variables
├── package.json
├── server.js                # Server entry point
└── skills-lock.json
```

## Requirements

Make sure you have the following installed:

* Node.js
* npm
* MySQL

You will also need access to a MySQL database, either locally or remotely.

## Installation

From the project root, go to the server directory and install the dependencies:

```bash
cd server
npm install
```

## Environment Variables

Create a `.env` file inside the `server` directory:

```env
DATABASE_URL="mysql://root:123@localhost:3306/esemka_foodcourt"
PORT=5000
JWT_SECRET=esemka_foodcourt_secret_key
JWT_EXPIRES_IN=7d
```

Update `DATABASE_URL` to match your own MySQL configuration.

## Database

The server uses **MySQL** with **Prisma ORM**.

The database schema is defined in:

```text
prisma/schema.prisma
```

The Prisma datasource uses the `DATABASE_URL` environment variable:

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

### Prisma Commands

Generate the Prisma client:

```bash
npm run prisma:generate
```

Run database migrations:

```bash
npm run prisma:migrate
```

Open Prisma Studio:

```bash
npm run prisma:studio
```

## Running the Server

### Development

```bash
npm run dev
```

The development server uses **Nodemon**, so it will automatically restart whenever you make changes to the source code.

### Production

```bash
npm run start
```

By default, the server runs on port `5000`.

## API

All API routes are grouped under the `/api` prefix.

| Route                  | Description                                    |
| ---------------------- | ---------------------------------------------- |
| `/api/auth`            | Login, registration, profile, and admin checks |
| `/api/users`           | User management                                |
| `/api/categories`      | Category management                            |
| `/api/menus`           | Menu management                                |
| `/api/ingredients`     | Ingredient management                          |
| `/api/units`           | Unit management                                |
| `/api/menuIngredients` | Menu and ingredient relationships              |
| `/api/tables`          | Table management                               |
| `/api/reservations`    | Reservation management                         |

The main route configuration can be found in:

```text
src/routes/index.js
```

## Authentication & Authorization

The server uses **JWT** for authentication.

Protected requests must include a bearer token:

```text
Authorization: Bearer <token>
```

Authentication is handled by:

```text
src/middleware/auth.middleware.js
```

Role-based access is handled by:

```text
src/middleware/role.middleware.js
```

The JWT secret and expiration time are configured through the `.env` file.

## File Uploads

The server supports uploading files such as menu images.

Uploaded files are stored in:

```text
uploads/
```

They are served through:

```text
/api/uploads
```

The static file configuration can be found in:

```text
src/app.js
```

## Development Notes

A few things to keep in mind when working on the backend:

* Make sure MySQL is running before starting the server.
* Keep the `.env` file configured correctly for your environment.
* Run Prisma migrations when the database schema changes.
* Do not manually edit files inside `generated/prisma` because they are generated by Prisma.
* Request validation is handled using Zod schemas in `src/validations`.
* Errors and API responses are handled through centralized middleware.
* The default server port is `5000`, but it can be changed through `PORT`.

---

**Esemka Foodcourt Backend** — REST API for managing the food court application.