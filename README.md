# Esemka Foodcourt

Esemka Foodcourt is a full-stack web application for managing food court operations. It provides separate interfaces for **admins and members**, while the backend handles authentication, menus, ingredients, tables, reservations, and other application data.

## Features

* Admin and member authentication
* Role-based access
* Admin dashboard
* Menu and category management
* Ingredient and unit management
* Member management
* Table management
* Table reservations and reservation status updates
* Menu image uploads
* Invoice and report export to PDF

## Project Structure

```text
esemka-foodcourt/
├── client/                 # React frontend
│   ├── src/               # Components, pages, services, context, etc.
│   ├── public/            # Public assets
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Express backend
│   ├── prisma/            # Prisma schema, migrations, and seed
│   ├── src/               # Routes, controllers, services, middleware, etc.
│   ├── uploads/            # Uploaded files and images
│   ├── package.json
│   └── server.js
│
├── README.md
└── .gitignore
```

## 🛠️ Tech Stack

### Frontend

* React 19
* Vite
* React Router
* Axios
* React Hook Form
* React Icons
* Sonner
* jsPDF & jsPDF AutoTable

### Backend

* Node.js
* Express
* Prisma ORM
* MySQL
* JWT
* Zod
* Multer
* Helmet
* CORS
* Morgan

## Requirements

Before running the project, make sure you have:

* Node.js and npm
* MySQL
* Git

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd esemka-foodcourt
```

Install the frontend dependencies:

```bash
cd client
npm install
```

Then install the backend dependencies:

```bash
cd ../server
npm install
```

After installing the dependencies, create a `.env` file in both the `client` and `server` folders.

## Environment Variables

### Client

Create `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Server

Create `server/.env`:

```env
DATABASE_URL="mysql://root:123@localhost:3306/esemka_foodcourt"
PORT=5000
JWT_SECRET=esemka_foodcourt_secret_key
JWT_EXPIRES_IN=7d
```

> Update `DATABASE_URL` to match your local MySQL configuration.

## Database

The backend uses **MySQL** with **Prisma ORM**.

The database schema is located at:

```text
server/prisma/schema.prisma
```

The main models include:

* User & Role
* Category
* Menu
* Ingredient
* Unit
* Table
* Reservation
* Reservation Detail

To set up Prisma:

```bash
cd server

npm run prisma:generate
npm run prisma:migrate
```

You can also use Prisma Studio to view and manage the database:

```bash
npm run prisma:studio
```

## Running the Project

The frontend and backend need to be run separately.

### Start the Backend

```bash
cd server
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

### Start the Frontend

Open a new terminal:

```bash
cd client
npm run dev
```

The frontend will usually be available at:

```text
http://localhost:5173
```

### Build the Frontend

To create a production build:

```bash
cd client
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Authentication

The backend uses **JWT (JSON Web Token)** for authentication.

After logging in, the frontend uses the JWT token when making requests to protected API endpoints.

Role-based access is also used to separate the features available to **admins and members**.

## API

The backend API uses `/api` as its base path:

```text
/api
```

The frontend communicates with the backend using Axios. API-related services can be found in:

```text
client/src/services/
```

JWT authentication is also handled through the frontend service layer.

## File Uploads

Uploaded menu images are stored in:

```text
server/uploads/
```

The backend serves this directory as static files through:

```text
/uploads
```

## Notes

A few things to keep in mind when running the project:

* Make sure MySQL is running before starting the backend.
* Check that the `.env` files are configured correctly.
* The frontend and backend must be started separately.
* Run the Prisma migration when setting up the database for the first time.
* The `server/uploads` directory is used to store uploaded images.

---

**Esemka Foodcourt** — a web-based food court management system.
