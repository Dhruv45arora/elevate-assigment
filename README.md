# AI Writing Assistant

Full-stack capstone for **elevatecareer.ai Module 4**: paste text and get AI-powered **rewrite** or **summarise** results via the Claude API.

| Layer    | Stack                                      |
| -------- | ------------------------------------------ |
| Backend  | Django, DRF, SimpleJWT, SQLite, Anthropic  |
| Frontend | React (Vite), Tailwind CSS                 |
| Model    | `claude-haiku-4-5-20251001` (configurable) |

**Live demo:** _(add your Vercel + Railway/Render URLs here after deployment)_

---

## Project structure

```
express-decouple/
├── backend/          # Django API
│   ├── accounts/     # Register, login (JWT), /me
│   ├── rewrite/      # POST /api/rewrite/
│   └── config/       # Settings & URLs
├── frontend/         # React SPA
└── README.md
```

---

## 1. Get a Claude API key

1. Go to [https://console.anthropic.com/](https://console.anthropic.com/) and sign up or log in.
2. Open **API Keys** in the sidebar (or **Settings → API keys**).
3. Click **Create Key**, name it (e.g. `writing-assistant-dev`), and copy the key once. It starts with `sk-ant-`.
4. Add billing if prompted — Haiku is inexpensive, but Anthropic requires a funded account for production use.
5. Never commit the key. Put it only in `backend/.env` (local) or your host’s environment variables (production).

Official docs: [https://docs.anthropic.com/en/api/getting-started](https://docs.anthropic.com/en/api/getting-started)

---

## 2. Local setup

### Backend

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
py -m pip install -r requirements.txt
copy .env.example .env
# Edit .env: set ANTHROPIC_API_KEY and SECRET_KEY
py manage.py migrate
py manage.py runserver
```

API runs at **http://127.0.0.1:8000**

### Frontend

```powershell
cd frontend
npm install
npm install -D @tailwindcss/vite tailwindcss
copy .env.example .env
# VITE_API_URL=http://127.0.0.1:8000
npm run dev
```

App runs at **http://localhost:5173**

### Test the flow

1. Open the frontend → **Register** a user.
2. Paste text, choose **Rewrite** or **Summarise**, click **Submit**.
3. The UI calls `POST /api/rewrite/` with a JWT `Authorization: Bearer …` header.

---

## 3. API reference

| Method | Path                 | Auth | Body |
| ------ | -------------------- | ---- | ---- |
| POST   | `/api/auth/register/` | No   | `{ "username", "password", "email?" }` |
| POST   | `/api/auth/login/`      | No   | `{ "username", "password" }` → `{ access, refresh }` |
| POST   | `/api/auth/refresh/`    | No   | `{ "refresh" }` → `{ access }` |
| GET    | `/api/auth/me/`         | JWT  | — |
| POST   | `/api/rewrite/`         | JWT  | `{ "text": "...", "mode": "rewrite" \| "summarise" }` |

**Rewrite response:** `{ "result": "...", "mode": "rewrite" }`

---

## 4. Environment variables

### Backend (`backend/.env`)

| Variable              | Required | Description |
| --------------------- | -------- | ----------- |
| `SECRET_KEY`          | Yes      | Django secret (long random string) |
| `DEBUG`               | Yes      | `True` locally, `False` in production |
| `ALLOWED_HOSTS`       | Yes      | Comma-separated, e.g. `localhost,127.0.0.1,your-app.up.railway.app` |
| `CORS_ALLOWED_ORIGINS`| Yes      | Frontend URL(s), e.g. `https://your-app.vercel.app` |
| `ANTHROPIC_API_KEY`   | Yes      | Claude API key from console.anthropic.com |
| `CLAUDE_MODEL`        | No       | Default: `claude-haiku-4-5-20251001` |

### Frontend (`frontend/.env`)

| Variable        | Required | Description |
| --------------- | -------- | ----------- |
| `VITE_API_URL`  | Yes      | Backend base URL, no trailing slash |

---

## 5. Deploy

### Backend — Railway or Render

1. Push the repo to GitHub (see section 6).
2. Create a new **Web Service** pointing at the `backend` folder (or set root to repo and start command to `cd backend && …`).
3. Set all backend env vars above; set `DEBUG=False`.
4. Build/start example (Render):
   - **Build:** `pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput`
   - **Start:** `gunicorn config.wsgi --bind 0.0.0.0:$PORT`
5. Copy the public URL (e.g. `https://xxx.up.railway.app`) into frontend `VITE_API_URL` and backend `CORS_ALLOWED_ORIGINS`.

### Frontend — Vercel

1. Import the GitHub repo in [vercel.com](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Add env var `VITE_API_URL` = your deployed Django URL.
4. Deploy; add the Vercel URL to backend `CORS_ALLOWED_ORIGINS` and redeploy backend if needed.

---

## 6. GitHub — what to do for the assignment

### Create the repository

1. Go to [https://github.com/new](https://github.com/new).
2. Name it e.g. `ai-writing-assistant` (public or private per your bootcamp rules).
3. Do **not** initialize with README if you already have one locally.

### Push your code

```powershell
cd "c:\Users\Dhruv Arora\Desktop\express-decouple"
git init
git add .
git commit -m "Add AI writing assistant capstone (Django + React)"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### What must be in the repo

| Include | Exclude (`.gitignore` handles most) |
| ------- | ----------------------------------- |
| `/backend` and `/frontend` source   | `node_modules/` |
| `README.md`, `.env.example` files   | `.env` (secrets) |
| `requirements.txt`, `package.json`  | `db.sqlite3` (optional — fine to exclude) |
| Clean commit history                | API keys, `__pycache__` |

### What graders expect

- **GitHub link** with clear folders `backend/` and `frontend/`
- **Live demo URL** (Vercel) where both modes work
- **README** with setup, env vars, and live URL
- **Code review** — you can explain JWT flow, Claude service, and CORS

### Submit

Reply to the assignment email with:

- GitHub repository URL  
- Live demo URL  
- Short note that README has local setup steps  

---

## 7. Troubleshooting

| Issue | Fix |
| ----- | --- |
| `ANTHROPIC_API_KEY is not configured` | Create `backend/.env` from `.env.example` |
| CORS error in browser | Add frontend origin to `CORS_ALLOWED_ORIGINS` |
| 401 on rewrite | Log in again; token may have expired |
| Claude model error | Confirm `CLAUDE_MODEL` matches an available model in your Anthropic account |

---

## License

Educational project for elevatecareer.ai bootcamp.
