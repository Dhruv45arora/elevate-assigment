# AI Writing Assistant — Project Overview

**Developer:** Dhruv Arora  
**Project type:** Full-stack production web application 
---

## Links

| Resource | URL |
| -------- | --- |
| **Live application** | https://elevate-assigment.vercel.app/ |
| **REST API (backend)** | https://elevate-assigment.onrender.com/ |
| **Source code** | https://github.com/Dhruv45arora/elevate-assigment |
| **Technical documentation** | https://github.com/Dhruv45arora/elevate-assigment/blob/main/README.md |

---

## Overview

Production-ready **AI Writing Assistant** — a decoupled full-stack application that lets authenticated users paste text and receive **rewrite** or **summary** output powered by the **Anthropic Claude API**.

Built to demonstrate backend architecture, API design, authentication, third-party AI integration, and cloud deployment — aligned with real-world Python/Django development practices.

---

## What it does

1. User **registers / logs in** (JWT-based auth)
2. User pastes content into the editor
3. User selects **Rewrite** or **Summarise**
4. Backend processes the request via Claude (Haiku) and returns structured JSON
5. Frontend displays the result with loading and error handling

---

## Technical highlights (Python / backend focus)

| Area | Implementation |
| ---- | -------------- |
| **API layer** | Django REST Framework — RESTful endpoints, serializers, validation |
| **Authentication** | JWT (`djangorestframework-simplejwt`) — stateless auth for SPA |
| **AI integration** | Anthropic SDK — prompt routing by mode, server-side API key only |
| **Security** | Env-based secrets, `DEBUG=False` in production, CORS, `ALLOWED_HOSTS` |
| **Architecture** | Separated `accounts` and `rewrite` apps; service layer for Claude calls |
| **Database** | SQLite (dev); swappable to PostgreSQL for scale |
| **Deployment** | Gunicorn on Render; static React build on Vercel |

---

## Stack

| Layer | Technologies |
| ----- | ------------ |
| **Backend** | Python 3.11, Django 5, DRF, SimpleJWT, Anthropic SDK |
| **Frontend** | React 19, Vite, Tailwind CSS |
| **Infrastructure** | Render (API), Vercel (UI) |
| **AI model** | Claude Haiku (`claude-haiku-4-5-20251001`) |

---

## API endpoints

| Method | Endpoint | Auth | Purpose |
| ------ | -------- | ---- | ------- |
| POST | `/api/auth/register/` | Public | User registration |
| POST | `/api/auth/login/` | Public | JWT token issuance |
| POST | `/api/auth/refresh/` | Public | Token refresh |
| GET | `/api/auth/me/` | JWT | Current user profile |
| POST | `/api/rewrite/` | JWT | AI rewrite or summarise |

**Core request (protected):**

```json
POST /api/rewrite/
Authorization: Bearer <access_token>

{
  "text": "Content to process...",
  "mode": "rewrite"
}
```

---

## Repository layout

```
elevate-assigment/
├── backend/
│   ├── accounts/       # Auth APIs
│   ├── rewrite/        # Claude service + /api/rewrite/
│   └── config/         # Django settings & WSGI
├── frontend/
│   └── src/            # React SPA + API client
├── README.md           # Setup, env vars, deployment
└── SUBMISSION.md       # This document
```

No secrets committed — `.env` files are gitignored.

---

## Live demo walkthrough (for reviewers / HR)

1. Open https://elevate-assigment.vercel.app/
2. Register or sign in
3. Paste sample text (article, email draft, notes)
4. Test **Rewrite** — clearer, professional output
5. Test **Summarise** — concise key points

Both flows are verified in production.

---

## Run locally

See [README.md](https://github.com/Dhruv45arora/elevate-assigment/blob/main/README.md) for full steps.

```powershell
# Backend
cd backend
pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py runserver

# Frontend
cd frontend
npm install
copy .env.example .env
npm run dev
```

---

## Why this project matters

- Demonstrates **end-to-end ownership**: API design, Python backend, integration, deployment
- Shows **secure AI integration** — API keys never exposed to the browser
- **Production deployment** with real URLs, not localhost-only
- Clean separation of concerns suitable for team code review

---

## Contact

**GitHub:** https://github.com/Dhruv45arora  
**Repository:** https://github.com/Dhruv45arora/elevate-assigment
