# BLR Estate 🏠

A full-stack real estate listing web application for Bangalore properties.

## Tech Stack

- **Frontend**: React 19 + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (Atlas for production)
- **Auth**: JWT-based authentication

## Project Structure

```
blr-estate/
├── frontend/       # React + Vite app
├── backend/        # Express API server
└── vercel.json     # Vercel deployment config
```

## Getting Started

### Backend

```bash
cd backend
cp .env.example .env   # Fill in your MongoDB URI and JWT secret
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

See `backend/.env.example` for required variables:

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `PORT` | Server port (default: 5001) |

## Deployment

This project is deployed on **Vercel**.

- Frontend is built as a static site from `frontend/`
- Backend runs as serverless Node.js functions
- Set environment variables in the Vercel dashboard
