# AI Writing Assistant

Full-stack capstone for **elevatecareer.ai Module 4 (Assignment #04)** — paste text and get AI-powered **rewrite** or **summarise** results via the Claude API.

**Author:** Dhruv Arora  
**Course:** elevatecareer.ai Fullstack Bootcamp — Module 4 Capstone

---

## Live application

| Resource | URL |
| -------- | --- |
| **Live demo (frontend)** | https://elevate-assigment.vercel.app/ |
| **Backend API** | https://elevate-assigment.onrender.com/ |
| **GitHub repository** | https://github.com/Dhruv45arora/elevate-assigment |

### How to try the live demo

1. Open https://elevate-assigment.vercel.app/
2. **Register** a new account (or sign in).
3. Paste text in the textarea.
4. Choose **Rewrite** or **Summarise**.
5. Click **Submit** — the AI result appears below the form.

---

## Tech stack

| Layer | Technology |
| ----- | ---------- |
| Backend | Python, Django, Django REST Framework |
| Auth | JWT (`djangorestframework-simplejwt`) |
| Database | SQLite |
| AI | Anthropic Claude API (`claude-haiku-4-5-20251001`) |
| Frontend | React, Vite, Tailwind CSS |
| Backend hosting | [Render](https://render.com) |
| Frontend hosting | [Vercel](https://vercel.com) |

---

## Project structure

```
elevate-assigment/
├── backend/              # Django REST API
│   ├── accounts/         # Register, login (JWT), /me
│   ├── rewrite/          # POST /api/rewrite/ + Claude integration
│   └── config/           # Settings, URLs, WSGI
├── frontend/             # React single-page app
│   └── src/
│       ├── api/          # API client + JWT handling
│       └── components/   # AuthPanel, WritingAssistant
├── README.md
└── SUBMISSION.md         # Summary for HR / assignment submission
```

---

## Features implemented

### Task 01 — Django REST API

- `POST /api/rewrite/` accepts `{ "text": "...", "mode": "rewrite" | "summarise" }`
- Calls Claude API with mode-specific prompts
- Returns JSON: `{ "result": "...", "mode": "..." }`
- Secured with **JWT** — only authenticated users can access

### Task 02 — React frontend

- Textarea for input
- Mode selector (Rewrite / Summarise)
- Submit button with **loading state**
- Results panel below the form
- Login / register flow

### Task 03 — Connect & deploy

- Frontend connected to production Django API
- Backend deployed on **Render**
- Frontend deployed on **Vercel**
- Both live and working end-to-end

---

## API reference

| Method | Path | Auth | Description |
| ------ | ---- | ---- | ----------- |
| POST | `/api/auth/register/` | No | Create account |
| POST | `/api/auth/login/` | No | Returns JWT `access` + `refresh` |
| POST | `/api/auth/refresh/` | No | Refresh access token |
| GET | `/api/auth/me/` | JWT | Current user info |
| POST | `/api/rewrite/` | JWT | Rewrite or summarise text |

**Example rewrite request:**

```json
POST /api/rewrite/
Authorization: Bearer <access_token>

{
  "text": "Your paragraph here...",
  "mode": "rewrite"
}
```

**Example response:**

```json
{
  "result": "Rewritten text...",
  "mode": "rewrite"
}
```

---

## Local development setup

### Prerequisites

- Python 3.11+
- Node.js 18+
- Anthropic API key ([console.anthropic.com](https://console.anthropic.com/))

### Backend

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
# Edit .env: SECRET_KEY, ANTHROPIC_API_KEY, etc.
python manage.py migrate
python manage.py runserver
```

Runs at **http://127.0.0.1:8000**

### Frontend

```powershell
cd frontend
npm install
copy .env.example .env
# Set VITE_API_URL=http://127.0.0.1:8000
npm run dev
```

Runs at **http://localhost:5173**

---

## Environment variables

### Backend (`backend/.env` — local only, never commit)

| Variable | Local | Production (Render) |
| -------- | ----- | ------------------- |
| `SECRET_KEY` | Random string | Same (set in Render dashboard) |
| `DEBUG` | `True` | `False` |
| `ALLOWED_HOSTS` | `localhost,127.0.0.1` | `elevate-assigment.onrender.com` |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173` | `https://elevate-assigment.vercel.app` |
| `ANTHROPIC_API_KEY` | Your Claude key | Your Claude key |
| `CLAUDE_MODEL` | Optional | `claude-haiku-4-5-20251001` |

### Frontend (`frontend/.env` — local; Vercel env for production)

| Variable | Local | Production (Vercel) |
| -------- | ----- | ------------------- |
| `VITE_API_URL` | `http://127.0.0.1:8000` | `https://elevate-assigment.onrender.com` |

No trailing slash on `VITE_API_URL`.

---

## Production deployment

### Backend (Render)

| Setting | Value |
| ------- | ----- |
| Root Directory | `backend` |
| Build Command | `pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput` |
| Start Command | `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT` |

### Frontend (Vercel)

| Setting | Value |
| ------- | ----- |
| Root Directory | `frontend` |
| Environment | `VITE_API_URL=https://elevate-assigment.onrender.com` |

---

## Security notes

- Claude API key is stored **only on the server** (never in frontend code or GitHub).
- `/api/rewrite/` requires a valid JWT.
- `DEBUG=False` in production.
- `.env` files are gitignored.

---

## Troubleshooting

| Issue | Fix |
| ----- | --- |
| CORS error in browser | Add frontend URL to `CORS_ALLOWED_ORIGINS` on Render |
| 401 on rewrite | Log in again; token may have expired |
| `ANTHROPIC_API_KEY is not configured` | Set key in `backend/.env` or Render env |
| Claude billing error | Add credits at [console.anthropic.com](https://console.anthropic.com/) |
| Render module error | Use `config.wsgi:application` (not `elevate_assignment_backend`) |

---

## Assignment submission links

- **GitHub:** https://github.com/Dhruv45arora/elevate-assigment  
- **Live demo:** https://elevate-assigment.vercel.app/  
- **API:** https://elevate-assigment.onrender.com/  

See [SUBMISSION.md](./SUBMISSION.md) for a short summary to share with HR or your mentor.

---

## License

Educational project for elevatecareer.ai bootcamp.
