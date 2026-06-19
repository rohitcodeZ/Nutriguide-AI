# NutriGuide AI — MERN Stack

An AI-powered Indian & Global Diet/Nutrition Assistant built with the **MERN stack**:
- **M**ongoDB — database with Mongoose ODM
- **E**xpress — REST API backend
- **R**eact + Vite — futuristic dark neon green frontend
- **N**ode.js — server runtime

## Features

- JWT authentication with bcrypt password hashing
- AI Diet Plan Generator (4 goals × 2 diet modes = 8 unique plans)
- 19 seeded Indian + global recipes with ingredient-based search
- Food Analyzer — nutrition breakdown + health score for Indian foods
- Regional Diet Suggestions (9 Indian states + seasonal variations)
- Dashboard with calorie/water/macro tracking and weekly chart
- Admin panel with user management and analytics
- Futuristic glassmorphism dark neon green UI

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone & Install
```bash
git clone <repo>
cd nutriguide-ai
cp .env.example .env        # edit MONGO_URI and JWT_SECRET
npm run install:all         # installs root, server, and client deps
```

### 2. Seed the Database
```bash
npm run seed
# Creates admin@nutriguide.ai / password123 + 19 recipes + 11 diet suggestions
```

### 3. Run in Development
```bash
npm run dev
# Starts both server (port 5000) and client (port 5173) concurrently
```

Open **http://localhost:5173** in your browser.

### 4. Production
```bash
cd client && npm run build   # build React app to client/dist/
cd ../server && npm start    # serve API; add express.static for client/dist if needed
```

## Environment Variables

| Variable      | Default                          | Description                  |
|---------------|----------------------------------|------------------------------|
| `MONGO_URI`   | `mongodb://localhost:27017/nutriguide` | MongoDB connection string |
| `JWT_SECRET`  | `nutriguide-ai-secret-2024`      | JWT signing secret           |
| `PORT`        | `5000`                           | Backend server port          |
| `CLIENT_URL`  | `http://localhost:5173`          | Frontend URL (CORS)          |

## Project Structure

```
nutriguide-ai/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── pages/           # Home, Login, Register, Dashboard, ...
│   │   ├── components/      # Sidebar, AppLayout, ProtectedRoute
│   │   ├── context/         # AuthContext.jsx
│   │   ├── services/        # api.js (axios instance)
│   │   └── index.css        # Dark neon green theme
│   ├── index.html
│   └── package.json
├── server/                  # Express + MongoDB backend
│   ├── models/              # User, Recipe, Recommendation, NutritionLog, DietSuggestion
│   ├── routes/              # auth, recipes, recommendations, food, suggestions, logs, dashboard, admin
│   ├── middleware/          # auth.js (JWT + admin guards)
│   ├── data/seed.js         # Database seeder
│   ├── index.js             # Entry point
│   └── package.json
├── .env.example
├── .gitignore
└── package.json             # Root scripts with concurrently
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login + get JWT |
| GET | `/api/auth/me` | Yes | Get current user |
| PATCH | `/api/auth/profile` | Yes | Update profile |
| GET | `/api/dashboard/stats` | Yes | Today's nutrition stats |
| GET | `/api/dashboard/insights` | Yes | AI health insights |
| GET | `/api/logs` | Yes | Get nutrition logs |
| POST | `/api/logs` | Yes | Add nutrition log |
| DELETE | `/api/logs/:id` | Yes | Delete log |
| GET | `/api/recommendations` | Yes | Get meal plans |
| POST | `/api/recommendations` | Yes | Generate new plan |
| GET | `/api/recipes` | Yes | Browse recipes |
| POST | `/api/recipes` | Yes | Add recipe |
| POST | `/api/recipes/generate` | Yes | Match by ingredients |
| POST | `/api/food/analyze` | Yes | Analyze food nutrition |
| GET | `/api/suggestions/location` | Yes | Diet by state/region |
| GET | `/api/suggestions/weather` | Yes | Diet by season |
| GET | `/api/admin/users` | Admin | List all users |
| GET | `/api/admin/analytics` | Admin | System analytics |

## Demo Accounts
- **Admin:** `admin@nutriguide.ai` / `password123`
- **User:** `priya@example.com` / `password123`

## MongoDB Atlas (Cloud)
Replace `MONGO_URI` in `.env` with your Atlas connection string:
```
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/nutriguide?retryWrites=true&w=majority
```
