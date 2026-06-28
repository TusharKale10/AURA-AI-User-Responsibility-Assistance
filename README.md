# AURA — AI User Responsibility Assistance

AURA is a productivity platform I built because every other tool I tried was just a fancier to-do list. They let you write things down, set reminders, and then leave you to figure out the rest. AURA actually tries to help you *finish* things — it plans with you, flags what's at risk, adapts when things change, and builds a picture of how you work over time.

The idea is simple: give it your goals, and it helps you turn them into a realistic plan you can actually execute. The AI isn't just a chatbot slapped on top — it's woven into the core workflow. Planning, reflection, decisions, knowledge — everywhere it makes sense.

---

## What's inside

**Dashboard** — each morning you get a single "Daily Mission" (AI-picked based on deadlines and priority), a progress ring for the day, and a live risk panel that flags tasks likely to be missed before they actually are.

**Task Management** — full CRUD with categories, priority levels, deadline tracking, and an automated priority engine that rescores tasks as things change. Risk levels (safe / moderate / high) are recalculated on every update.

**Goal Intelligence** — long-term goals with milestones, progress tracking, and a conflict detector that uses Gemini to flag when two goals are fighting for the same time or energy.

**AI Planner** — describe a goal in plain language and get back a structured task breakdown with time estimates, priorities, and sequencing. It actually thinks about dependencies.

**Productivity DNA** — a behavioral profile built from your real task history. Tracks your completion rate, most productive hours, deep focus window, weekly trend, and consistency score. Gets smarter the more you use it.

**Life Balance** — score yourself across 7 dimensions (career, health, finance, relationships, etc.) and get AI suggestions for the ones falling behind. Shows history so you can see trends.

**AI Decision Advisor** — describe a decision you're stuck on. Gemini analyzes it with your current workload in context and returns a structured recommendation with reasoning.

**Knowledge Engine** — pick a goal and the AI generates a curated knowledge base for it: concepts, resources, action steps. Any item can be converted directly into a tracked task.

**Adaptive Planner** — when your schedule gets disrupted, AURA reorganizes your task load based on updated priorities and remaining time.

**Reflection** — end-of-day review where you log what got done, what didn't, and your mood. The AI synthesizes it into an insight and sets tomorrow's focus.

**Focus Mode** — stripped-down view for distraction-free work sessions.

**Analytics** — powered by a separate Python/FastAPI microservice using pandas and numpy. Tracks weekly trends, hourly productivity heatmaps, completion rates, burnout index, and generates an AI weekly report.

---

## Tech stack

| | |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4, Framer Motion |
| Backend | Node.js, Express 5, Mongoose |
| Database | MongoDB Atlas |
| AI | Google Gemini API |
| Analytics | Python, FastAPI, pandas, numpy, plotly |
| Auth | JWT + bcrypt |

---

## Running it locally

You need Node.js ≥ 18, Python ≥ 3.10, and a MongoDB Atlas connection string.

**Backend**
```bash
cd backend
npm install
cp .env.example .env   # fill in your values
npm run dev            # runs on :5000
```

**Frontend**
```bash
cd frontend
npm install
npm run dev            # runs on :5173
```

**Analytics** (optional — only needed for the Analytics page)
```bash
cd analytics
python -m venv venv && venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

---

## Environment variables

Copy `backend/.env.example` and fill these in:

| Variable | What it's for |
|---|---|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Any long random string |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `GEMINI_API_KEY` | From [Google AI Studio](https://aistudio.google.com) |
| `PORT` | Defaults to `5000` |
| `FRONTEND_URL` | `http://localhost:5173` for local dev |

---

## License

MIT
