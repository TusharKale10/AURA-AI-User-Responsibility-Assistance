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

[🚀 Live Demo](#) · [📖 Documentation](#) · [🐛 Report Bug](https://github.com/TusharKale10/AURA-AI-User-Responsibility/issues) · [✨ Request Feature](https://github.com/TusharKale10/AURA-AI-User-Responsibility/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Screenshots](#-screenshots)
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
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

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
- CountUp analytics stats
- Testimonials section
- FAQ accordion
- Feature carousel
- Dark CTA section with shimmer button effect

</details>

---

## 📸 Screenshots

> Add your screenshots to the `docs/screenshots/` folder and update the paths below.

| Section | Preview |
|---|---|
| **Landing Page** | ![Landing Page](docs/screenshots/landing.png) |
| **Dashboard** | ![Dashboard](docs/screenshots/dashboard.png) |
| **Task Management** | ![Tasks](docs/screenshots/tasks.png) |
| **Analytics** | ![Analytics](docs/screenshots/analytics.png) |
| **Life Balance** | ![Life Balance](docs/screenshots/life-balance.png) |
| **AI Planner** | ![AI Planner](docs/screenshots/planner.png) |
| **Decision Advisor** | ![Decision Advisor](docs/screenshots/decision.png) |
| **Productivity DNA** | ![DNA](docs/screenshots/dna.png) |
| **Knowledge Engine** | ![Knowledge](docs/screenshots/knowledge.png) |

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
| **Runtime** | Node.js | LTS | Server execution environment |

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
│       ├── pages/
│       │   ├── LandingPage.jsx      # Public marketing page
│       │   ├── LoginPage.jsx        # Authentication
│       │   ├── RegisterPage.jsx     # Registration
│       │   ├── DashboardPage.jsx    # Main dashboard
│       │   ├── TasksPage.jsx        # Task management
│       │   ├── GoalsPage.jsx        # Goal + milestone tracking
│       │   ├── PlannerPage.jsx      # AI task planner
│       │   ├── ReflectionPage.jsx   # Daily reflection
│       │   ├── FocusPage.jsx        # Focus mode
│       │   ├── ProductivityDNAPage.jsx
│       │   ├── AnalyticsPage.jsx
│       │   ├── LifeBalancePage.jsx
│       │   ├── DecisionAdvisorPage.jsx
│       │   ├── KnowledgePage.jsx
│       │   └── ProfilePage.jsx
│       ├── services/
│       │   └── api.js               # Axios instance + all API call functions
│       ├── utils/
│       │   └── formatters.js        # Date, category, priority formatters
│       ├── App.jsx                  # Route definitions
│       └── index.css                # Design tokens + component CSS system
│
├── backend/                         # Express 5 + MongoDB REST API
│   └── src/
│       ├── config/
│       │   └── db.js                # MongoDB Atlas connection
│       ├── controllers/             # Business logic (13 controllers)
│       ├── middleware/
│       │   ├── auth.js              # JWT protect middleware
│       │   └── errorHandler.js      # Global error handler
│       ├── models/                  # Mongoose schemas (8 models)
│       ├── routes/                  # Express routers (11 route files)
│       ├── utils/
│       │   ├── gemini.js            # Google Gemini AI client
│       │   ├── jwt.js               # Token sign/verify helpers
│       │   ├── priorityEngine.js    # Task prioritization algorithm
│       │   └── lifeBalanceEngine.js # Life balance scoring logic
│       ├── app.js                   # Express app config, CORS, middleware, routes
│       └── server.js                # Entry point — DB connect + listen
│
└── analytics/                       # Python FastAPI microservice
    ├── main.py                      # FastAPI app with 6 analytics endpoints
    ├── requirements.txt             # Python dependencies
    └── README.md                    # Analytics module docs
```

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser (React 19)                       │
│   Vite Dev Server :5173 │ TailwindCSS v4 │ Framer Motion        │
└──────────────────────────────┬──────────────────────────────────┘
                               │ REST / JSON
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
┌───────────────┐    ┌─────────────────┐   ┌─────────────────┐
│  Express API  │    │  Python FastAPI  │   │  Google Gemini  │
│  Node.js :5000│    │  Analytics :8000 │   │   AI API        │
└──────┬────────┘    └────────┬────────┘   └─────────────────┘
       │                      │
       ▼                      ▼
┌──────────────────────────────────────┐
│         MongoDB Atlas                │
│  users · tasks · goals · reflections │
│  aihistories · lifebalances          │
│  productivitydnas · knowledgebases   │
└──────────────────────────────────────┘
```

---

## 🗄 Database Models

| Collection | Key Fields | Purpose |
|---|---|---|
| `users` | name, email, password, avatar, bio, timezone, preferences (workStartHour, workEndHour, focusDuration) | User accounts & settings |
| `tasks` | title, description, deadline, estimatedMinutes, category, priority, priorityScore, status, riskLevel, dependencies[], tags[], parentGoal | Core task management |
| `goals` | title, description, deadline, status, progress, category, estimatedHours, milestones[], conflictSeverity, aiInsights | Long-term goal tracking |
| `reflections` | date, completedTasks[], pendingTasks[], summary, tomorrowPriorities[], mood (1-5), aiInsights | Daily reflection records |
| `aihistories` | type (planner/reflection/recommendation/mission), prompt, response, metadata | AI interaction audit log |
| `lifebalances` | date, scores {career, learning, health, finance, personal_growth, habits, relationships}, suggestions[], aiInsights | Life dimension tracking |
| `productivitydnas` | metrics {completionRate, missedDeadlines, avgEstimationError, mostProductiveDays[], mostProductiveSlots[]}, profile {deepFocusWindow, weeklyTrend, consistencyScore}, aiInsights | Behavioral DNA profile |
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
| `GET` | `/api/health` | Server health check — `{ status: 'ok', version: '2.0.0' }` | ❌ |

---

## 📈 Analytics Module

The analytics module is a **standalone Python microservice** (`analytics/`) built with FastAPI, running separately from the main Express backend. It connects directly to MongoDB Atlas and performs computation-heavy analysis that would be expensive in Node.js.

### Stack

```
FastAPI 0.115  ·  pymongo 4.8  ·  pandas 2.2  ·  numpy 1.26  ·  plotly 5.22  ·  uvicorn
```

### Endpoints

| Method | Endpoint | Returns |
|---|---|---|
| `GET` | `/` | Health check |
| `GET` | `/analytics/overview` | Daily completion counts, category & priority distribution |
| `GET` | `/analytics/trends` | Weekly task data, hourly productivity heatmap, burnout trend |
| `GET` | `/analytics/productivity` | Composite productivity score, completion rate, punctuality, forecast |
| `GET` | `/analytics/life-score` | Life balance dimension scores |
| `GET` | `/analytics/consistency` | Active days streak & consistency score |

### What It Computes

- **Completion Patterns** — Task success rate broken down by day, week, hour, and category
- **Burnout Index** — Measures volume vs. completion imbalance over rolling periods
- **Punctuality Rate** — Percentage of tasks completed by their original deadline
- **Productivity Forecast** — Trend-based projection using historical completion velocity
- **Hourly Heatmap** — When during the day the user completes the most tasks
- **Consistency Score** — Measures how regularly the user maintains active productivity

---

## 🤖 AI Features

AURA uses **Google Gemini** as its AI reasoning layer. All CRUD operations remain backend-driven — AI is called only for tasks that require natural language understanding or complex reasoning.

| Feature | AI Role |
|---|---|
| **AI Planner** | Decomposes a natural-language goal into structured tasks with time estimates, priorities, and sequencing |
| **Daily Mission** | Selects the single most impactful task for today based on deadlines, priority scores, and user context |
| **Reflection Synthesis** | Reads completed/pending task data and generates a narrative insight + tomorrow's focus suggestions |
| **Decision Advisor** | Analyzes a submitted dilemma with workload context — returns framework, recommendation, and reasoning |
| **Knowledge Generation** | For a selected goal, generates a curated knowledge base with concepts, resources, and action steps |
| **Goal Conflict Analysis** | Evaluates all active goals for timeline and resource conflicts, returning severity and detail |
| **Adaptive Planning** | Reorganizes task schedules when disruptions occur, re-prioritizing based on updated constraints |
| **Life Balance Suggestions** | Generates personalized recommendations for underperforming life dimensions |
| **Weekly Analytics Report** | Synthesizes the week's performance data into a written report with patterns and improvement actions |
| **Productivity DNA Insights** | Produces a behavioral narrative explaining the user's computed work patterns |

---

## 🚀 Installation

### Prerequisites

- **Node.js** ≥ 18 LTS
- **Python** ≥ 3.10
- **MongoDB Atlas** account (free tier works)
- **Google Gemini API key** — [Get one here](https://ai.google.dev)
- **Git**

---

### 1. Clone the Repository

```bash
git clone https://github.com/TusharKale10/AURA-AI-User-Responsibility.git
cd AURA-AI-User-Responsibility
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create your environment file:

```bash
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and Gemini API key
```

Start the backend server:

```bash
npm run dev        # Development (nodemon auto-reload)
# or
npm start          # Production
```

> Backend runs on **http://localhost:5000**

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

> Frontend runs on **http://localhost:5173**

---

### 4. Analytics Module Setup

```bash
cd analytics
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

Create the analytics environment file:

```bash
# Create analytics/.env with your MongoDB connection string
echo "MONGODB_URI=your_mongodb_uri_here" > .env
```

Start the analytics service:

```bash
uvicorn main:app --reload --port 8000
```

> Analytics service runs on **http://localhost:8000**

---

### 5. Verify Everything Is Running

```
✅ Backend  → http://localhost:5000/api/health
✅ Frontend → http://localhost:5173
✅ Analytics → http://localhost:8000
```

---

## 🔐 Environment Variables

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

### Backend (`backend/.env`)

| Variable | Example Value | Description |
|---|---|---|
| `PORT` | `5000` | Express server port |
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/aura` | MongoDB Atlas connection string |
| `JWT_SECRET` | `your_super_secret_key_min_32_chars` | Secret used to sign JWT tokens |
| `JWT_EXPIRES_IN` | `7d` | Token expiration duration |
| `GEMINI_API_KEY` | `AIzaSy...` | Google Gemini API key |
| `NODE_ENV` | `development` | Runtime environment |
| `FRONTEND_URL` | `http://localhost:5173` | Allowed CORS origin |

### Analytics (`analytics/.env`)

| Variable | Example Value | Description |
|---|---|---|
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/aura` | Same MongoDB URI as backend |

---

## 🧭 Usage Guide

```
1. Landing Page
   └── Browse features, read testimonials, explore the platform

2. Register
   └── Create your account with name, email, and password

3. Set Up Profile
   └── Add your work hours, focus duration, bio, and timezone

4. Create a Goal
   └── Define what you want to achieve — add milestones and a deadline

5. AI Planning
   └── Describe your goal to the AI Planner
   └── Receive a structured task breakdown with priorities and time estimates

6. Task Management
   └── Review, edit, and organize generated tasks
   └── Track status: Pending → In Progress → Completed

7. Daily Workflow
   └── Check Dashboard each morning for your Daily Mission
   └── Review risk alerts and priority task list

8. Focus Mode
   └── Enter a distraction-free session for deep work

9. Evening Reflection
   └── Log your day, rate your mood, set tomorrow's priorities
   └── Receive AI-generated insights and recommendations

10. Analytics
    └── Review weekly trends, productivity scores, and burnout index
    └── Generate your AI Weekly Report

11. Life Balance Check
    └── Score all 7 life dimensions, get AI suggestions for improvement

12. Continuous Improvement
    └── Monitor your Productivity DNA profile as it evolves over time
```

---

## 🗺 Roadmap

| Priority | Feature | Status |
|---|---|---|
| 🔥 High | Google Calendar two-way sync | Planned |
| 🔥 High | Mobile app (React Native) | Planned |
| 🔥 High | Push notifications for deadlines | Planned |
| 🟡 Medium | Gmail integration for task extraction from email | Planned |
| 🟡 Medium | Team collaboration and shared goals | Planned |
| 🟡 Medium | AI voice assistant integration | Planned |
| 🟢 Future | Wearable device integration (heart rate → focus state) | Concept |
| 🟢 Future | Cloud deployment (Vercel + Railway + Atlas) | Planned |
| 🟢 Future | Browser extension for quick task capture | Concept |
| 🟢 Future | API webhooks for third-party integrations | Concept |

---

## ⚡ Performance

- **Lazy Loading** — React Router code-splitting ensures only the current page's JS is loaded
- **Optimized API Calls** — Axios interceptors handle auth headers globally; dashboard makes parallel requests with `Promise.all`
- **Modular Architecture** — Backend separated into controllers, services, routes, and utilities for independent scaling
- **Reusable Component Library** — Shared `Button`, `Card`, `Modal`, `Badge`, `Spinner`, and chart components eliminate duplication
- **Indexed Queries** — MongoDB indexes on `user+deadline`, `user+status`, `user+type+createdAt`, and `user+date` for fast filtered queries
- **Responsive UI** — Tailwind CSS v4 utility classes ensure correct layouts from 320px mobile to 4K desktop
- **Analytics Microservice** — Heavy pandas/numpy computation runs in Python (not Node.js event loop) to prevent backend blocking

---

## 🔒 Security

| Layer | Implementation |
|---|---|
| **Authentication** | JWT tokens with configurable expiry; stored in `localStorage` under `aura_token` |
| **Password Security** | bcryptjs hashing with salt rounds — plaintext passwords never stored or logged |
| **Route Protection** | `protect` middleware on every private Express route validates JWT before controller runs |
| **Input Validation** | `express-validator` validates and sanitizes all incoming request bodies server-side |
| **CORS Policy** | Strict CORS origin whitelist — only `FRONTEND_URL` is permitted |
| **Environment Secrets** | All sensitive config in `.env` files, never committed to version control |
| **Database** | MongoDB Atlas with network access controls, encrypted at rest |
| **Auto-logout** | Axios 401 interceptor clears token and redirects to login on any expired-token response |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m 'feat: add your feature'`
4. **Push** to the branch: `git push origin feature/your-feature-name`
5. **Open** a Pull Request

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
feat:     New feature
fix:      Bug fix
refactor: Code change that neither fixes a bug nor adds a feature
docs:     Documentation only changes
style:    Formatting, missing semicolons, etc.
test:     Adding or correcting tests
chore:    Build process or tooling changes
```

### Code Style

- Frontend: Functional components with hooks; no class components
- Backend: Async/await throughout; no callbacks
- Naming: camelCase for JS, snake_case for Python
- No unused imports or variables — oxlint is enforced

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

```
MIT License — Copyright (c) 2026 Tushar Kale

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

---

## 👨‍💻 Author

<div align="center">

<img src="https://github.com/TusharKale10.png" alt="Tushar Kale" width="100" height="100" style="border-radius: 50%;" />

### Tushar Kale

*Full-Stack Developer · AI/ML Enthusiast · Builder*

[![GitHub](https://img.shields.io/badge/GitHub-TusharKale10-181717?style=for-the-badge&logo=github)](https://github.com/TusharKale10)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/your-linkedin)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-FF5722?style=for-the-badge&logo=firefox)](https://your-portfolio.dev)
[![Email](https://img.shields.io/badge/Email-tusharkale2037@gmail.com-D14836?style=for-the-badge&logo=gmail)](mailto:tusharkale2037@gmail.com)

</div>

---

<div align="center">

**Built with ❤️ using React, Node.js, MongoDB, and Google Gemini AI**

⭐ **Star this repository if AURA helped you or impressed you!** ⭐

*AURA — Plan smarter. Focus deeper. Achieve more.*

</div>
