# LawyerConnect

A "LinkedIn for lawyers" mini project: clients can browse lawyer profiles (specialization,
experience, ratings), and message them in real time. Built with the MERN stack
(MongoDB, Express, React, Node) plus Socket.io for live chat.

## Features

- **Auth** — sign up as a `client` or `lawyer`, JWT-based login
- **Lawyer directory** — search & filter by specialization, city, minimum years of experience
- **Lawyer profile** — bio, bar registration number, consultation fee, verified badge
- **Ratings & reviews** — clients leave a 1–5 star rating + written review; a lawyer's
  average rating updates automatically
- **Real-time chat** — Socket.io powered messaging between a client and a lawyer, with
  message history stored in MongoDB
- **Dashboard** — lawyers edit their own profile; everyone sees their conversation list

## Project structure

```
lawyer-connect/
  backend/          Express + MongoDB + Socket.io API
    models/          User, Message, Rating schemas
    routes/          auth, lawyers, ratings, messages
    middleware/      JWT auth middleware
    server.js        entry point (REST + Socket.io)
  frontend/         React (Vite) app
    src/pages/       Home, Login, Register, LawyerList, LawyerProfile, Chat, Dashboard
    src/components/  Navbar, LawyerCard, RatingStars, ProtectedRoute
    src/context/      AuthContext (login/register/logout, token storage)
```

## Prerequisites

- Node.js 18+
- A MongoDB instance — either install MongoDB locally, or use a free
  [MongoDB Atlas](https://www.mongodb.com/atlas) cluster and paste its connection
  string into `MONGO_URI`

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env
# edit .env: set MONGO_URI, and change JWT_SECRET to any long random string
npm install
npm run dev        # starts on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env
# .env only needs VITE_API_URL=http://localhost:5000 (default is already correct)
npm install
npm run dev        # starts on http://localhost:5173
```

Open http://localhost:5173 in your browser. Register once as a **lawyer** (fill in
specialization, experience, bar number, etc.) and once as a **client** in another
browser/incognito tab, so you can search for the lawyer, view the profile, leave a
rating, and open the chat.

## How the pieces fit together (for your viva)

- **Auth**: `bcryptjs` hashes passwords; `jsonwebtoken` issues a JWT on login/register,
  stored in `localStorage` and attached to every API request via an axios interceptor.
- **Search**: `GET /api/lawyers` builds a Mongo query dynamically from query params
  (specialization, city, minExperience, free-text search across name/specialization/bio).
- **Ratings**: `POST /api/ratings/:lawyerId` upserts a rating (one per client per lawyer)
  and recalculates the lawyer's `avgRating`/`ratingCount` on the `User` document so listing
  and sorting stay fast (no need to aggregate on every page load).
- **Chat**: the frontend opens one Socket.io connection authenticated with the JWT.
  Each conversation is a deterministic room name (`sortedUserId1_sortedUserId2`), so a
  client and lawyer always land in the same room regardless of who messages first. Every
  message is also persisted to MongoDB so chat history survives a refresh.

## Ideas to extend it further

- Email/SMS notification when a new message arrives while offline
- Admin panel to actually verify a lawyer's bar registration number
- Payment integration for paid consultations
- Video call link generation for a booked consultation
