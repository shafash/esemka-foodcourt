# Esemka Foodcourt — Client

This folder contains the **frontend application** for Esemka Foodcourt. It is built with **React and Vite** and provides the interface used by admins and members to manage menus, ingredients, members, tables, and reservations.

## Features

* Login and registration
* Admin and member dashboards
* Menu management
* Category management
* Ingredient and unit management
* Member management
* Table and reservation management
* Reservation booking and detail views
* Menu image uploads
* Toast notifications
* Invoice and report export

## Tech Stack

* **React 19** — Frontend library
* **Vite** — Development server and build tool
* **React Router DOM** — Routing
* **Axios** — API requests
* **React Hook Form** — Form handling
* **React Icons** — Icons
* **Sonner** — Toast notifications
* **jsPDF & jsPDF AutoTable** — PDF and report generation
* **ESLint** — Code linting

## Project Structure

```text id="u4y2q9"
client/
├── public/                 # Static assets
│
├── src/
│   ├── components/        # Reusable and feature-specific components
│   ├── constants/         # API and application constants
│   ├── context/           # Authentication context
│   ├── hooks/             # Custom React hooks
│   ├── layouts/           # Page and dashboard layouts
│   ├── pages/             # Application pages
│   ├── routes/            # Route configuration
│   ├── services/          # API service modules
│   ├── styles/            # CSS files
│   ├── utils/             # Helper and utility functions
│   ├── App.jsx            # Main application component
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles
│
├── .env                   # Environment variables
├── eslint.config.js       # ESLint configuration
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Requirements

Before running the client, make sure you have:

* Node.js
* npm
* The Esemka Foodcourt backend running

The backend should be available at the API URL configured in the `.env` file.

## 🚀 Installation

From the project root:

```bash id="4ygk20"
cd client
npm install
```

## Configuration

Create a `.env` file inside the `client` directory:

```env id="tvk8b1"
VITE_API_BASE_URL=http://localhost:5000/api
```

This value is used as the base URL for API requests.

If `VITE_API_BASE_URL` is not provided, the application falls back to:

```text id="f1p3wv"
http://localhost:5000/api
```

If your backend is running on a different host or port, update the value accordingly.

## Running the App

### Development

Start the Vite development server:

```bash id="1m9n6p"
npm run dev
```

The application will usually be available at:

```text id="d4v2y7"
http://localhost:5173
```

### Production Build

Create a production build:

```bash id="8hcm9n"
npm run build
```

### Preview Production Build

To preview the production build locally:

```bash id="qv7d2n"
npm run preview
```

## 📡 API Integration

The client communicates with the backend through the API services located in:

```text id="x4z1f6"
src/services/
```

The API configuration can be found in:

```text id="j6w8p2"
src/constants/api.js
```

The request layer handles several things automatically:

* Uses `VITE_API_BASE_URL` as the API base URL
* Adds the JWT bearer token to authenticated requests
* Handles unauthorized (`401`) responses
* Redirects users to the login page when their session is no longer valid
* Provides backend error messages to the UI

## Authentication & Routes

Authentication is managed using `AuthContext`.

The application separates routes into three main groups:

* **Public routes** — login and registration
* **Protected routes** — pages that require authentication
* **Role-based routes** — pages and features available specifically to admins or members

Route protection is handled through:

```text id="e5q3k8"
ProtectedRoute
PublicRoute
```

The dashboard layout also adjusts the available navigation based on the user's role.

## Reports & Exports

The client includes PDF and report generation features, mainly for reservation and dashboard-related data.

The project uses:

* `jsPDF`
* `jsPDF AutoTable`

Related helper functions can be found in:

```text id="b8r2m1"
src/utils/
```

## Styling

Application styles are organized inside:

```text id="a3x7n5"
src/styles/
```

Styles are separated by feature or section to make it easier to maintain and update individual parts of the application.

## Development Notes

* Keep API configuration inside `.env` instead of hardcoding URLs throughout the application.
* Make sure the backend is running before testing features that require API access.
* Authentication state is managed through `AuthContext`.
* Use the existing service modules when adding new API requests.
* Run ESLint when checking the code for common issues.

---

**Esemka Foodcourt Client** — React frontend for the food court management system.