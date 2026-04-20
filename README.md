# DevLink — Developer Job Portal

A full-stack job portal for developers, built with the MERN stack + Socket.io.

## Features
- JWT authentication with refresh tokens (role-based: jobseeker / employer)
- Job listings with full-text search, type filter, location filter, pagination
- One-click job application with cover letter
- Employer dashboard: post jobs, view applicants, update status (pending → shortlisted → hired)
- Real-time in-app messaging with Socket.io
- Profile management

## Tech Stack
- **Frontend:** React 18, Vite, Tailwind CSS, Zustand, React Router v6, Socket.io-client
- **Backend:** Node.js, Express, MongoDB (Mongoose), Socket.io, JWT, bcryptjs
- **Deploy:** Render (Unified Web Service + MongoDB Atlas)

## Setup

### 1. Backend
```bash
cd server
npm install
cp .env.example .env    # fill in MONGO_URI, JWT_SECRET, etc.
npm run dev             # runs on http://localhost:5000
```

### 2. Frontend
```bash
cd client
npm install
npm run dev             # runs on http://localhost:5173
```

### Environment Variables (server/.env)
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=change_this
JWT_REFRESH_SECRET=change_this_too
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

## Deploy to Render (Unified Service)
1. Push your code to GitHub.
2. Sign up / Log in to [Render](https://render.com).
3. Connect your GitHub repository.
4. Render will automatically detect the `render.yaml` configuration file and propose the creation of the `devlink` Web Service.
5. Provide your environment variables (`MONGO_URI`, `JWT_SECRET`, etc.) in the Render dashboard.
6. Deploy! Render will build the React frontend and serve it using the Express backend automatically.
