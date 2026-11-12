# Real-Time Code Editor

A collaborative web-based code editor where multiple users can join the same room, write code together in real time, and run code snippets from the browser.

This project combines a React frontend with an Express + Socket.IO backend to support live code synchronization, room-based collaboration, user authentication, and code execution.

## What it does

- Lets users sign up and sign in to access the editor
- Creates or joins collaborative coding rooms
- Syncs code changes across connected users in real time
- Shows which users are currently in the room
- Supports language selection and code execution in the editor
- Displays live typing and collaboration activity
- Stores user and room-related data using MongoDB

## Tech stack

### Frontend
- React
- Vite
- Monaco Editor via `@monaco-editor/react`
- React Router
- Socket.IO client
- Tailwind CSS

### Backend
- Node.js
- Express
- Socket.IO
- MongoDB with Mongoose
- JWT-based authentication
- Cookie-based session support

## Project structure

```text
realtime_code_editor/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── public/
│   ├── routers/
│   ├── services/
│   └── index.js
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Features

### Real-time collaboration
The server listens for Socket.IO events such as `join`, `codeChange`, `typing`, and `languageChangde`, and broadcasts updates to all users in the same room.

### Authentication
The backend exposes auth routes under `/api/auth` and uses JWT and cookies to manage login and registration.

### Code execution
The backend sends code to the Piston execution API and emits the result back to the connected room.

### Frontend experience
The frontend provides the editor UI, room navigation, sign-in and sign-up flows, and real-time collaboration logic.

## Getting started

### Prerequisites

- Node.js
- npm
- MongoDB instance or MongoDB connection string

### 1. Install dependencies

At the project root:

```bash
npm install
```

Then install frontend dependencies:

```bash
cd frontend
npm install
cd ..
```

### 2. Configure environment variables

Create a `.env` file in the root if required by your local MongoDB and auth setup, and provide the values your backend expects for:

- MongoDB connection URI
- JWT secret
- any app-specific configuration

### 3. Run the app

Start the backend:

```bash
npm run dev
```

Start the frontend in a separate terminal:

```bash
cd frontend
npm run dev
```

The frontend is typically served on Vite's local development port, while the backend runs on port 5000.

### Production build

```bash
npm run build
```

This installs dependencies and builds the frontend bundle for deployment.

## Example workflow

1. Sign up or sign in
2. Open the home page and create or join a room
3. Share the room ID with another user
4. Both users connect to the same code session
5. Edit code together in real time
6. Run the code and view execution output in the room

## Notes

This project is designed as a collaborative coding platform for pair programming, live demos, and remote coding sessions. It is suitable for learning how to combine real-time communication, authentication, and editor-based workflows in a single application.

## License

This project currently includes an ISC license as defined in the root `package.json`.
