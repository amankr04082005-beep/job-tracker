# Job Application Tracker

Full-stack app to track job applications. This folder currently has the **server** (Node.js, Express, MongoDB, JWT).

## Run the server
```bash
cd server
npm install
cp .env.example .env     # then set a strong JWT_SECRET
npm run dev
```
Needs MongoDB running locally (or put a MongoDB Atlas connection string in `MONGO_URI`).

## API
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | No | Create account |
| POST | /api/auth/login | No | Login, returns JWT |
| GET | /api/auth/me | Yes | Current user |
| GET | /api/jobs?status=&search= | Yes | List jobs with filters |
| GET | /api/jobs/stats/summary | Yes | Count per status |
| POST | /api/jobs | Yes | Add job |
| GET | /api/jobs/:id | Yes | Get one job |
| PUT | /api/jobs/:id | Yes | Update job |
| DELETE | /api/jobs/:id | Yes | Delete job |

Send the token as `Authorization: Bearer <token>`.
