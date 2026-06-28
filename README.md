<div align="center">

<img src="frontend/public/AURA.jpg" alt="AURA Logo" width="100" height="100" style="border-radius: 16px;" />

# AURA

### AI User Responsibility Assistance

**An AI-powered productivity platform that proactively plans, prioritizes, schedules, analyzes, and helps you complete meaningful work — before deadlines are missed.**

<br/>

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)
[![Python](https://img.shields.io/badge/Python-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<br/>

[🐛 Report Bug](https://github.com/TusharKale10/AURA-AI-User-Responsibility-Assistance/issues) · [✨ Request Feature](https://github.com/TusharKale10/AURA-AI-User-Responsibility-Assistance/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Database Models](#-database-models)
- [API Documentation](#-api-documentation)
- [Analytics Module](#-analytics-module)
- [AI Features](#-ai-features)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Usage Guide](#-usage-guide)
- [Roadmap](#-roadmap)
- [Performance](#-performance)
- [Security](#-security)
- [License](#-license)

---

## 🧠 Overview

Most productivity apps are **task collectors, not task completers**. They help you write down what needs to get done — and then leave you to figure out the rest.

**AURA is different.**

AURA acts as your **AI Chief of Staff** — an intelligent layer that sits between your goals and your results. It doesn't just store your tasks; it:

- 🔍 **Understands context** — deadlines, energy levels, priorities, and dependencies
- 🤖 **Reasons with AI** — uses Google Gemini to plan, adapt, and generate insights in natural language
- 📊 **Learns your patterns** — builds a Productivity DNA profile from your actual behavior
- ⚠️ **Detects risk proactively** — flags tasks that are on track to be missed *before* they're missed
- 🧭 **Guides daily execution** — delivers a single, AI-selected Daily Mission each morning

> AURA was built out of frustration with tools that let you feel busy without making you productive. It gives you one place to plan, execute, reflect, and improve — powered by AI at every step.

---

## ✨ Features

<details>
<summary><strong>🔐 Authentication & Profile</strong></summary>

- Secure registration and login with JWT-based sessions
- Password hashing via bcrypt
- Profile management with avatar upload (base64), bio, timezone
- Configurable work-hours and focus duration preferences
- Protected routes — unauthenticated users are redirected to login
- Auto-logout on token expiry with seamless redirect

</details>

<details>
<summary><strong>🏠 Dashboard</strong></summary>

- **Today's Mission** — AI-selected single most important task for the day
- **Today's Progress Ring** — visual progress tracker (completed / total tasks)
- **Stat Cards** — active tasks, completed today, high-risk count
- **Productivity DNA Snapshot** — completion rate, consistency score, deep focus window, weekly trend
- **Priority Task List** — upcoming deadline-sorted tasks with one-click navigation
- **Risk Alerts Panel** — live categorization of high and moderate risk tasks
- Animated entrance with staggered Framer Motion transitions

</details>

<details>
<summary><strong>✅ Smart Task Management</strong></summary>

- Full CRUD for tasks with rich metadata: title, description, deadline, estimated minutes, category, priority
- **6 categories**: Work, Study, Personal, Health, Finance, Other
- **4 priority levels**: Low, Medium, High, Critical
- **Automated Priority Engine** — server-side scoring based on deadline proximity, category weight, and dependencies
- **Deadline Risk Detection** — automatic `riskLevel` classification (safe / moderate / high) recalculated on every update
- Task dependency linking (block/unblock relationships)
- Filter and search across all task fields
- Status workflow: Pending → In Progress → Completed / Cancelled

</details>

<details>
<summary><strong>🎯 Goal Intelligence</strong></summary>

- Create and track long-term goals with deadlines, categories, and progress (0–100%)
- **8 goal categories**: Career, Learning, Health, Finance, Personal Growth, Habits, Relationships, Other
- **Milestone system** — add ordered sub-milestones with individual deadlines and toggle completion
- **Goal Conflict Detection** — AI-powered conflict analysis flags overlapping goals with severity levels (none / low / medium / high)
- **Goal Heatmap** — calendar view of task activity linked to each goal
- **AI Insights per Goal** — generated context and recommendations stored alongside each goal
- Goal progress auto-calculated from milestone completion

</details>

<details>
<summary><strong>🤖 AI Planner</strong></summary>

- Input a goal in natural language — Gemini AI decomposes it into a structured task breakdown
- Returns time estimates, priority suggestions, dependency ordering, and an execution sequence
- AI Planner history stored for reference and future optimization
- Directly integrates with task creation flow

</details>

<details>
<summary><strong>🧬 Productivity DNA</strong></summary>

- Persistent behavioral profile built from your actual task history
- **Computed Metrics**:
  - Completion rate
  - Missed deadlines
  - Average estimation error
  - Most productive days of the week
  - Most productive time slots
  - Tasks by category breakdown
- **Behavioral Profile**:
  - Morning productivity score
  - Deep focus window detection
  - Peak learning time
  - Weekly trend (improving / declining)
  - Consistency score
- AI-generated insight narrative summarizing your work patterns
- Manual refresh to recompute from latest data

</details>

<details>
<summary><strong>⚖️ Life Balance</strong></summary>

- Score yourself across **7 life dimensions**: Career, Learning, Health, Finance, Personal Growth, Habits, Relationships
- Visual Radar Chart for multidimensional balance view
- AI generates personalized suggestions for underperforming areas
- Historical tracking — view balance trends over time
- Recalculate anytime with a single click

</details>

<details>
<summary><strong>🧠 AI Decision Advisor</strong></summary>

- Submit a decision dilemma — Gemini AI analyzes pros, cons, risks, and recommendations
- Task-aware context: pulls your current active tasks to add workload perspective
- Structured output: decision framework, recommended option, reasoning, and action steps
- Full decision history stored for reflection

</details>

<details>
<summary><strong>📚 Knowledge Engine</strong></summary>

- Select a goal — AI generates a curated knowledge base (concepts, resources, steps)
- **Item types**: concepts, resources, action steps, frameworks
- Convert any knowledge item directly into a tracked task
- Delete or manage knowledge bases per goal
- Stores estimated prep hours and a summary narrative

</details>

<details>
<summary><strong>🔄 Adaptive Planner</strong></summary>

- Fetch an AI-generated adaptive schedule based on current task load and priorities
- **Reschedule trigger** — when plans change, AURA reorganizes your workload instantly
- Accounts for deadlines, estimated effort, and priority scoring in the new schedule

</details>

<details>
<summary><strong>🪞 Reflection Engine</strong></summary>

- Daily reflection workflow: review completed tasks, note pending items, rate mood (1–5)
- Set tomorrow's priorities from within the reflection flow
- **AI Reflection Synthesis** — Gemini reads your day and returns a narrative insight + recommendations
- Reflection history stored per date for longitudinal self-review

</details>

<details>
<summary><strong>⚡ Focus Mode</strong></summary>

- Dedicated distraction-free focus session page
- Configurable focus duration via profile preferences
- Task selection for focused execution
- Minimal UI designed for deep work

</details>

<details>
<summary><strong>📊 Analytics Dashboard</strong></summary>

- **Overview**: daily completion counts, category breakdown, priority distribution
- **Trends**: weekly completion trend, hourly productivity heatmap, burnout index
- **Productivity Score**: composite score with completion rate, punctuality rate, and forecast
- **AI Weekly Report** — Gemini synthesizes your week into a written performance report
- Powered by a separate Python/FastAPI analytics microservice for heavy computation

</details>

<details>
<summary><strong>🌐 Landing Page</strong></summary>

- Animated hero section with floating orbs and gradient text
- Interactive audience cards with hover animations
- Feature showcase with live interactive previews
- CountUp analytics stats, testimonials, FAQ accordion, feature carousel
- Dark CTA section with shimmer button effect

</details>

---

## 🛠 Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Frontend Framework** | React | 19 | Component-based UI |
| **Build Tool** | Vite | 8 | Fast development server & bundling |
| **Styling** | Tailwind CSS | v4 | Utility-first CSS with design tokens |
| **Animations** | Framer Motion | 12 | Page transitions & micro-animations |
| **Icons** | Lucide React | Latest | Consistent icon system |
| **HTTP Client** | Axios | 1.x | API communication with interceptors |
| **Routing** | React Router DOM | 7 | Client-side navigation |
| **Backend Framework** | Express.js | 5 | REST API server |
| **Database** | MongoDB Atlas | — | Cloud NoSQL document database |
| **ODM** | Mongoose | 9 | Schema modeling & validation |
| **Authentication** | JWT + bcryptjs | — | Stateless auth & password hashing |
| **Input Validation** | express-validator | 7 | Server-side request validation |
| **AI Engine** | Google Gemini API | Latest | Natural language reasoning |
| **Analytics Runtime** | Python / FastAPI | 3.x / 0.115 | Heavy data computation microservice |
| **Data Analysis** | pandas + numpy | 2.x / 1.x | Task pattern analysis |
| **Visualization Data** | Plotly | 5.x | Chart data generation |
| **Analytics DB Driver** | pymongo | 4.x | Python → MongoDB connection |

---

## 🏗 Architecture

```
AURA/
├── frontend/                        # React 19 + Vite + Tailwind CSS v4
│   ├── public/
│   │   └── AURA.jpg                 # App logo
│   └── src/
│       ├── components/
│       │   ├── dashboard/           # MissionCard, ProgressRing, RiskBadge, TaskRow
│       │   ├── layout/              # AppLayout, Sidebar, ProtectedRoute
│       │   ├── tasks/               # TaskCard, TaskForm
│       │   └── ui/                  # Button, Card, Input, Modal, Badge, Spinner,
│       │                            #   Select, EmptyState, RadarChart, DonutChart,
│       │                            #   MiniBarChart, HeatmapGrid
│       ├── context/
│       │   └── AuthContext.jsx      # Global auth state + token management
│       ├── pages/                   # 15 page components
│       ├── services/
│       │   └── api.js               # Axios instance + all API call functions
│       └── utils/
│           └── formatters.js        # Date, category, priority formatters
│
├── backend/                         # Express 5 + MongoDB REST API
│   └── src/
│       ├── config/db.js             # MongoDB Atlas connection
│       ├── controllers/             # Business logic (13 controllers)
│       ├── middleware/              # JWT auth + global error handler
│       ├── models/                  # Mongoose schemas (8 models)
│       ├── routes/                  # Express routers (11 route files)
│       └── utils/                   # gemini.js, jwt.js, priorityEngine.js,
│                                    #   lifeBalanceEngine.js
│
└── analytics/                       # Python FastAPI microservice
    ├── main.py                      # FastAPI app with 6 analytics endpoints
    └── requirements.txt
```

### System Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (React 19)                    │
│         Vite :5173 │ Tailwind v4 │ Framer Motion        │
└───────────────────────────┬─────────────────────────────┘
                            │ REST / JSON
        ┌───────────────────┼──────────────────┐
        │                   │                  │
        ▼                   ▼                  ▼
┌──────────────┐   ┌────────────────┐  ┌──────────────┐
│ Express API  │   │ Python FastAPI  │  │ Google Gemini│
│ Node.js :5000│   │ Analytics :8000│  │    AI API    │
└──────┬───────┘   └───────┬────────┘  └──────────────┘
       │                   │
       ▼                   ▼
┌────────────────────────────────────┐
│           MongoDB Atlas            │
│  users · tasks · goals · reflec-  │
│  tions · aihistories · lifebal-   │
│  ances · productivitydnas ·       │
│  knowledgebases                   │
└────────────────────────────────────┘
```

---

## 🗄 Database Models

| Collection | Key Fields | Purpose |
|---|---|---|
| `users` | name, email, password, avatar, bio, timezone, preferences | User accounts & settings |
| `tasks` | title, description, deadline, estimatedMinutes, category, priority, priorityScore, status, riskLevel, dependencies[], parentGoal | Core task management |
| `goals` | title, description, deadline, status, progress, category, milestones[], conflictSeverity, aiInsights | Long-term goal tracking |
| `reflections` | date, completedTasks[], pendingTasks[], summary, tomorrowPriorities[], mood (1–5), aiInsights | Daily reflection records |
| `aihistories` | type (planner/reflection/recommendation/mission), prompt, response, metadata | AI interaction audit log |
| `lifebalances` | date, scores {career, learning, health, finance, personal_growth, habits, relationships}, suggestions[], aiInsights | Life dimension tracking |
| `productivitydnas` | metrics {completionRate, missedDeadlines, mostProductiveDays[], mostProductiveSlots[]}, profile {deepFocusWindow, weeklyTrend, consistencyScore}, aiInsights | Behavioral DNA profile |
| `knowledgebases` | goal (ref), goalTitle, items[] {type, title, content, convertedToTask}, summary, estimatedPrepHours | AI-generated knowledge |

---

## 📡 API Documentation

> All protected endpoints require `Authorization: Bearer <token>` header.

### Auth — `/api/auth`

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Create new user account | ❌ |
| `POST` | `/api/auth/login` | Login and receive JWT | ❌ |
| `GET` | `/api/auth/me` | Get current user profile | ✅ |
| `PUT` | `/api/auth/profile` | Update profile, avatar, preferences | ✅ |

### Tasks — `/api/tasks`

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| `GET` | `/api/tasks` | List all tasks (with filters) | ✅ |
| `POST` | `/api/tasks` | Create task (auto-scores priority & risk) | ✅ |
| `GET` | `/api/tasks/:id` | Get single task | ✅ |
| `PUT` | `/api/tasks/:id` | Update task | ✅ |
| `DELETE` | `/api/tasks/:id` | Delete task | ✅ |

### Dashboard — `/api/dashboard`

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| `GET` | `/api/dashboard` | Today's mission, progress, stats, risk alerts | ✅ |

### AI — `/api/ai`

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| `POST` | `/api/ai/planner` | Break a goal into AI-generated tasks | ✅ |
| `POST` | `/api/ai/reflection` | Generate AI daily reflection | ✅ |
| `GET` | `/api/ai/mission` | Get today's AI-selected mission | ✅ |

### Goals — `/api/goals`

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| `GET` | `/api/goals` | List all goals | ✅ |
| `POST` | `/api/goals` | Create goal | ✅ |
| `PUT` | `/api/goals/:id` | Update goal | ✅ |
| `DELETE` | `/api/goals/:id` | Delete goal | ✅ |
| `GET` | `/api/goals/conflicts` | Get AI-detected goal conflicts | ✅ |
| `POST` | `/api/goals/:id/milestones` | Add milestone to goal | ✅ |
| `PATCH` | `/api/goals/:id/milestones/:milestoneId/toggle` | Toggle milestone completion | ✅ |
| `DELETE` | `/api/goals/:id/milestones/:milestoneId` | Delete milestone | ✅ |
| `GET` | `/api/goals/:id/heatmap` | Get task activity heatmap for goal | ✅ |

### Productivity DNA — `/api/dna`

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| `GET` | `/api/dna` | Get computed DNA profile | ✅ |
| `POST` | `/api/dna/refresh` | Recompute DNA from latest data | ✅ |

### Decision Advisor — `/api/decision`

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| `GET` | `/api/decision/tasks` | Get tasks context for decision | ✅ |
| `POST` | `/api/decision/analyze` | Submit decision for AI analysis | ✅ |

### Knowledge Engine — `/api/knowledge`

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| `GET` | `/api/knowledge` | List all knowledge bases | ✅ |
| `POST` | `/api/knowledge/generate` | Generate AI knowledge base for a goal | ✅ |
| `POST` | `/api/knowledge/convert-to-task` | Convert knowledge item into a task | ✅ |
| `DELETE` | `/api/knowledge/:id` | Delete knowledge base | ✅ |

### Life Balance — `/api/life-balance`

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| `GET` | `/api/life-balance` | Get latest life balance scores | ✅ |
| `POST` | `/api/life-balance` | Save new balance assessment | ✅ |
| `POST` | `/api/life-balance/recalculate` | Recalculate with AI suggestions | ✅ |
| `GET` | `/api/life-balance/history` | Get historical balance records | ✅ |

### Adaptive Planner — `/api/adaptive`

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| `GET` | `/api/adaptive/plan` | Get AI adaptive schedule | ✅ |
| `POST` | `/api/adaptive/reschedule` | Trigger workload reorganization | ✅ |

### Analytics — `/api/analytics`

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| `GET` | `/api/analytics/overview` | Category breakdown, completion counts | ✅ |
| `GET` | `/api/analytics/trends` | Weekly trends, hourly productivity | ✅ |
| `GET` | `/api/analytics/productivity` | Composite productivity score | ✅ |
| `POST` | `/api/analytics/generate-report` | Generate AI weekly performance report | ✅ |

### Health Check

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| `GET` | `/api/health` | Server health — `{ status: 'ok', version: '2.0.0' }` | ❌ |

---

## 📈 Analytics Module

The analytics module is a **standalone Python microservice** (`analytics/`) built with FastAPI. It connects directly to MongoDB Atlas and performs computation-heavy analysis that would block the Node.js event loop.

```
FastAPI 0.115  ·  pymongo 4.8  ·  pandas 2.2  ·  numpy 1.26  ·  plotly 5.22  ·  uvicorn
```

| Endpoint | Returns |
|---|---|
| `GET /analytics/overview` | Daily completion counts, category & priority distribution |
| `GET /analytics/trends` | Weekly task data, hourly productivity heatmap, burnout trend |
| `GET /analytics/productivity` | Composite productivity score, completion rate, punctuality, forecast |
| `GET /analytics/life-score` | Life balance dimension scores |
| `GET /analytics/consistency` | Active days streak & consistency score |

**What it computes:** completion patterns by day/week/hour/category, burnout index, punctuality rate, productivity forecast from historical velocity, and per-hour heatmap data.

---

## 🤖 AI Features

AURA uses **Google Gemini** as its reasoning layer. All CRUD stays backend-driven — Gemini is only called where natural language understanding or complex reasoning genuinely adds value.

| Feature | What AI does |
|---|---|
| **AI Planner** | Decomposes a natural-language goal into structured tasks with time estimates, priorities, and sequencing |
| **Daily Mission** | Selects the single most impactful task for today based on deadlines, priority scores, and context |
| **Reflection Synthesis** | Reads completed/pending task data and generates a narrative insight + tomorrow's focus |
| **Decision Advisor** | Analyzes a submitted dilemma with workload context — returns framework, recommendation, and reasoning |
| **Knowledge Generation** | For a selected goal, generates a curated knowledge base with concepts, resources, and action steps |
| **Goal Conflict Analysis** | Evaluates all active goals for timeline and resource conflicts with severity ratings |
| **Adaptive Planning** | Reorganizes task schedules when disruptions occur, re-prioritizing based on updated constraints |
| **Life Balance Suggestions** | Generates personalized recommendations for underperforming life dimensions |
| **Weekly Analytics Report** | Synthesizes the week's performance data into a written report with patterns and improvement actions |
| **Productivity DNA Insights** | Produces a behavioral narrative explaining your computed work patterns |

---

## 🚀 Installation

### Prerequisites

- Node.js ≥ 18 LTS
- Python ≥ 3.10
- MongoDB Atlas account (free tier works)
- Google Gemini API key — [Get one here](https://aistudio.google.com)

### 1. Clone

```bash
git clone https://github.com/TusharKale10/AURA-AI-User-Responsibility-Assistance.git
cd AURA-AI-User-Responsibility-Assistance
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your values, then:
npm run dev
```
> Runs on **http://localhost:5000**

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```
> Runs on **http://localhost:5173**

### 4. Analytics (optional)

```bash
cd analytics
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
> Runs on **http://localhost:8000** — only needed for the Analytics page

### 5. Verify

```
✅ Backend   → http://localhost:5000/api/health
✅ Frontend  → http://localhost:5173
✅ Analytics → http://localhost:8000
```

---

## 🔐 Environment Variables

> ⚠️ Never commit your `.env` file — it's already in `.gitignore`.

Copy `backend/.env.example` and fill in:

| Variable | Example | Description |
|---|---|---|
| `PORT` | `5000` | Express server port |
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/aura` | MongoDB Atlas connection string |
| `JWT_SECRET` | `your_secret_min_32_chars` | Secret used to sign JWT tokens |
| `JWT_EXPIRES_IN` | `7d` | Token expiration duration |
| `GEMINI_API_KEY` | `AIzaSy...` | Google Gemini API key |
| `NODE_ENV` | `development` | Runtime environment |
| `FRONTEND_URL` | `http://localhost:5173` | Allowed CORS origin |

---

## 🧭 Usage Guide

```
1. Landing Page     Browse features and value proposition
        ↓
2. Register         Create your account
        ↓
3. Profile Setup    Set work hours, focus duration, timezone
        ↓
4. Create a Goal    Define what you want to achieve with a deadline
        ↓
5. AI Planning      Describe the goal — get a structured task breakdown
        ↓
6. Task Management  Review, edit, and track tasks through their lifecycle
        ↓
7. Daily Workflow    Dashboard → Daily Mission → Risk Alerts each morning
        ↓
8. Focus Mode       Distraction-free sessions for deep work
        ↓
9. Reflection       Log your day, rate mood, set tomorrow's priorities
        ↓
10. Analytics       Review trends, scores, and your AI weekly report
        ↓
11. Life Balance    Score all 7 dimensions, get AI improvement suggestions
        ↓
12. DNA Profile     Watch your Productivity DNA evolve as habits improve
```

---

## 🗺 Roadmap

| Priority | Feature |
|---|---|
| 🔥 | Google Calendar two-way sync |
| 🔥 | Mobile app (React Native) |
| 🔥 | Push notifications for deadlines |
| 🟡 | Gmail integration for task extraction |
| 🟡 | Team collaboration and shared goals |
| 🟡 | AI voice assistant |
| 🟢 | Cloud deployment (Vercel + Railway) |
| 🟢 | Browser extension for quick task capture |

---

## ⚡ Performance

- React Router code-splitting — only the current page's JS is loaded
- Dashboard uses `Promise.all` for parallel API calls
- MongoDB indexes on `user+deadline`, `user+status`, `user+type+createdAt`, `user+date`
- Heavy pandas/numpy computation runs in the Python microservice — Node.js event loop stays unblocked
- Tailwind CSS v4 utility classes for responsive layouts from 320px to 4K

---

## 🔒 Security

| Layer | Implementation |
|---|---|
| **Authentication** | JWT tokens with configurable expiry stored in `localStorage` |
| **Password Security** | bcryptjs hashing — plaintext passwords never stored or logged |
| **Route Protection** | `protect` middleware validates JWT before every private controller |
| **Input Validation** | `express-validator` sanitizes all incoming request bodies |
| **CORS** | Strict origin whitelist — only `FRONTEND_URL` is permitted |
| **Secrets** | All config in `.env` files, never committed to version control |
| **Auto-logout** | Axios 401 interceptor clears token and redirects on expiry |

---

## 📄 License

Distributed under the **MIT License**.

---

<div align="center">

*AURA — Plan smarter. Focus deeper. Achieve more.*

</div>
