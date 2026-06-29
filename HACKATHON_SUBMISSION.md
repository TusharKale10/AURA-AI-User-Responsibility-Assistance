# Project Description

## 1. Project Name

### [AURA — AI User Responsibility Assistance](https://github.com/TusharKale10/AURA-AI-User-Responsibility-Assistance)

---

## 2. Problem Statement Selected

**Problem Statement 1 — The Last-Minute Life Saver**

### The Real-World Problem

Deadlines are missed not because people are lazy — they are missed because people lack the tools to see failure coming early enough to act. The standard productivity workflow goes like this: you add a task, set a reminder, and hope for the best. By the time a reminder fires, there is often no time left to do anything meaningful about it.

This is a structural failure in how productivity software is designed. Most apps are passive storage systems. They hold your tasks but offer no intelligence about which ones are in danger, which ones deserve your attention *right now*, or how your current workload compares to your available capacity.

### Why It Matters

Students miss assignment deadlines. Professionals miss project milestones. Both groups suffer the same root cause: they underestimate how long tasks take, overestimate how much time they have, and have no system that connects those two realities in real time.

The consequences go beyond a missed deadline. Compounding overdue tasks create stress, erode consistency, and break the habit of finishing things — which is the single most important behavior in any high-performing individual.

### How AURA Addresses It

AURA is built around the philosophy that prevention is better than rescue. Rather than waiting for deadlines to pass, AURA:

- Computes a **real-time risk score** for every task based on time remaining versus estimated effort — flagging tasks as `safe`, `moderate`, or `high` risk *while there is still time to act*
- Selects a **Daily Mission** each morning — the single most important task for the day — so the user never has to decide where to start
- Detects **goal conflicts** the moment a new goal is created and warns about deadline overlaps immediately
- Runs an **Adaptive Planner** that reorganizes the day's workload whenever circumstances change
- Builds a **Productivity DNA** profile from actual task history so users understand *why* they keep missing deadlines and what their productive patterns actually look like

---

## 3. Solution Overview

### What AURA Does

AURA is a full-stack AI productivity platform that connects goals, tasks, planning, reflection, and analytics into one continuous loop. The user starts by defining a goal. AURA's AI Planner uses Google Gemini to decompose that goal into a structured, ordered, and time-estimated task list. From that point forward, AURA actively monitors the state of those tasks — scoring their priority, assessing their risk, and surfacing the most critical work every day.

### Who It Is Built For

AURA is built for students managing coursework and placement preparation, developers running project timelines, and professionals who need to balance multiple concurrent goals across different life areas. The platform covers 6 task categories (Work, Study, Personal, Health, Finance, Other) and 8 goal categories (Career, Learning, Health, Finance, Personal Growth, Habits, Relationships, Other) — making it useful across the full breadth of a user's life, not just their job.

### End-to-End User Workflow

```
Register → Create Goal → AI Planner breaks goal into tasks
    → Daily Mission selected each morning
    → Risk Engine monitors all tasks in real time
    → Focus Mode for deep work sessions
    → Evening Reflection with AI-generated insight
    → Analytics Dashboard shows weekly patterns
    → Productivity DNA evolves as habits form
    → Life Balance scores 7 life dimensions
    → Decision Advisor resolves prioritization conflicts
    → Knowledge Engine generates study/prep packs per goal
```

### How AI Is Involved

AURA uses Google Gemini as its reasoning layer in **9 distinct workflows**, all of which are implemented and verified in the codebase:

| Workflow | What Gemini Does |
|---|---|
| AI Planner | Decomposes a natural-language goal into 3–7 specific, time-estimated, priority-ordered tasks |
| Daily Reflection | Reads that day's completed and pending tasks, generates a warm, specific narrative insight |
| Decision Advisor (free-form) | Accepts a natural-language question and reasons over the user's task list to return an answer, a top recommendation, and confidence score |
| Decision Advisor (task compare) | Compares two specific tasks, returns a winner with reasoning, tradeoffs, estimated impact, and success probability |
| Goal Conflict Analysis | Detects conflicting goals from deadline proximity and total estimated hours, then Gemini generates a prioritization recommendation |
| Knowledge Engine | For a given goal, generates a 10–14 item structured knowledge pack with checklists, timelines, topics, resources, and tips |
| Productivity DNA | Analyzes 30 days of task completion data and generates a 2-sentence warm behavioral insight |
| Life Balance | Generates a 2-sentence observation about dimension balance and 3 specific, actionable suggestions |
| Weekly Analytics Report | Synthesizes the week's completion rate, best working time, and category spread into a 3–4 sentence narrative |

All AI responses use **structured JSON prompts** with strict output constraints. Every AI call has a **quota-resilient fallback**: if Gemini returns a 429 or quota error, the system falls back to deterministic logic (pattern-matched static plans, algorithmic text generation) so the application never breaks for the user.

### What Makes the Approach Different

**1. Proactive risk detection, not reactive reminders.**
The Risk Engine (`priorityEngine.js`) runs on every task save. It calculates `hoursLeft - hoursNeeded` and classifies tasks as high risk when the buffer falls below zero — before the deadline passes, not after.

**2. AI operates on real task data, not a blank canvas.**
When Gemini is called for reflection, decision advice, or DNA insights, it receives serialized, filtered task data from MongoDB. The AI reasons over the user's *actual* state, not hypothetical scenarios.

**3. Multi-model cascade for resilience.**
The Gemini client (`gemini.js`) attempts `gemini-2.5-flash` → `gemini-2.0-flash` → `gemini-3.5-flash` in sequence, with per-model error handling and a 10-second `AbortController` timeout. This means the application stays functional even under model availability issues.

**4. Algorithmic intelligence below the AI layer.**
Priority scoring uses a validated multi-factor formula: urgency (50%) + importance (40%) − effort penalty (10%), producing a 0–100 score used consistently across planning, decision advice, and adaptive scheduling. This score is what Gemini reasons *about* — not a black box.

### Architecture Overview

```
User → React 19 Frontend (Vite, Tailwind CSS v4, Framer Motion)
     → REST API (Express 5, Node.js)
         → MongoDB Atlas (8 collections)
         → Google Gemini API (REST: generativelanguage.googleapis.com)
         → Python FastAPI Analytics Microservice
              → pandas / numpy computation
              → MongoDB Atlas (direct connection)
```

---

## 4. Key Features

### Planning & Execution

| Feature | Description | User Benefit |
|---|---|---|
| **AI Planner** | User describes a goal in plain language; Gemini returns a structured breakdown of 3–7 tasks with titles, descriptions, estimated minutes, priority, and category | Turns vague goals into an immediately actionable task list |
| **Daily Mission** | Each morning, AURA selects the single most critical task based on deadline proximity and status | Eliminates the "what do I do first?" decision that wastes morning momentum |
| **Adaptive Planner** | Builds a time-blocked day schedule from pending tasks sorted by priority score, respecting estimated effort and available working hours | Shows exactly how to spend the rest of the day |
| **Reschedule Engine** | When circumstances change (freed time, overdue detection), generates typed recommendations (opportunity / reschedule / risk) with specific action text | Helps users recover from schedule disruptions without losing the thread |

### Task Management

| Feature | Description | User Benefit |
|---|---|---|
| **Smart Task CRUD** | Full task management with 6 categories, 4 priority levels, deadline, estimated minutes, status workflow, tags, and dependency links | Captures all context needed for accurate AI reasoning |
| **Priority Scoring** | Server-side algorithm: urgency (50%) + importance (40%) − effort penalty (10%) → 0–100 score, recalculated on every save | Objective, automatic ranking without user effort |
| **Deadline Risk Detection** | Compares buffer time (hoursLeft − hoursNeeded); classifies as safe / moderate / high | Flags tasks at risk while there is still time to act |
| **Risk Alerts Dashboard Panel** | Live dashboard panel shows high and moderate risk tasks with hours remaining | Morning snapshot of what needs immediate attention |

### Goal Intelligence

| Feature | Description | User Benefit |
|---|---|---|
| **Goal Tracking** | Goals with 8 categories, deadlines, estimated hours, and 0–100% progress auto-computed from milestone completion | Long-term direction with measurable milestones |
| **Milestone System** | Ordered sub-milestones with individual deadlines; toggle completion; auto-updates parent goal progress to 100% when all complete | Breaks big goals into verifiable checkpoints |
| **Conflict Detection** | On goal creation, checks deadline proximity (< 7 days overlap) and total effort across all active goals (> 60h triggers high severity); Gemini generates resolution recommendation | Prevents the user from committing to an impossible combination of goals |
| **Goal Heatmap** | Calendar view of task completions linked to a goal, last 30 days | Visual reinforcement of daily progress toward the goal |

### AI Intelligence Features

| Feature | Description | User Benefit |
|---|---|---|
| **Decision Advisor** | Two modes: (1) compare two tasks head-to-head — Gemini returns winner, reasoning, tradeoffs, success probability; (2) free-form question answered with task context | Eliminates the mental cost of deciding what to prioritize |
| **Knowledge Engine** | AI generates a 10–14 item structured knowledge pack for any goal — checklists, topics, resources, timelines, tips; any item converts directly to a tracked task | Turns a goal into a ready-to-execute preparation plan |
| **Productivity DNA** | 30-day behavioral profile: completion rate, missed deadlines, most productive days and time slots, deep focus window (best 2-hour block), weekly trend, consistency score, Gemini narrative | Users see *why* they work the way they do and where to improve |
| **AI Reflection** | End-of-day: Gemini reads completed and pending tasks, writes a 2–3 sentence warm insight with one specific action for tomorrow | Daily habit of honest self-assessment with zero writing effort |
| **Weekly Report** | Gemini synthesizes completion rate, best working time, lightest day, and active goals into a narrative performance summary | Weekly accountability without manual journaling |

### Life & Wellbeing

| Feature | Description | User Benefit |
|---|---|---|
| **Life Balance** | 7-dimension scoring (Career, Learning, Health, Finance, Personal Growth, Habits, Relationships) computed from actual task and goal data; NLP keyword detection classifies `personal` tasks as social vs. growth; Gemini generates 3 actionable suggestions | Reveals imbalances before they become crises |
| **Balance History** | Up to 30 historical life balance snapshots | Track dimension trends over time |
| **Focus Mode** | Dedicated distraction-free page for deep work sessions with configurable duration | Structured time for uninterrupted concentration |
| **Reflection Engine** | Daily review of completed/pending tasks, mood rating (1–5), tomorrow's priorities; AI-generated insight stored per date | Continuous improvement habit with AI support |

### Analytics

| Feature | Description | User Benefit |
|---|---|---|
| **Overview Analytics** | 30-day task analysis: completion rate, category breakdown, 14-day daily trend, priority distribution, risk distribution, week-over-week improvement | Objective view of productivity output |
| **Trend Analysis** | 4-week completion rate by week, 24-hour productivity heatmap by hour, category trend across weeks | Identifies when and what kind of work gets done |
| **Productivity Score** | Composite score: completion rate (60%) + punctuality rate (40%), plus overdue count | Single number representing actual delivery quality |
| **Python Analytics Microservice** | Separate FastAPI service with pandas/numpy computation: overview, trends, productivity, life scores, consistency — isolated from Node.js event loop | Heavy computation without blocking the main API |

---

## 5. Technologies Used

| Technology | Purpose | Where Used |
|---|---|---|
| **React 19** | UI framework | All frontend pages and components |
| **Vite 8** | Build tool and dev server | Frontend build pipeline |
| **Tailwind CSS v4** | Utility-first styling with design tokens | All UI styling via `@theme {}` custom tokens |
| **Framer Motion 12** | Animations and transitions | Page entrances, hover effects, sidebar indicator, hero orbs |
| **React Router DOM 7** | Client-side routing and protected routes | App routing, ProtectedRoute component |
| **Axios 1.x** | HTTP client with interceptors | `api.js` — all API calls, 401 auto-logout |
| **Lucide React** | Icon library | All icons across the UI |
| **Node.js (LTS)** | Server runtime | Backend execution environment |
| **Express 5** | REST API framework | All 44+ API endpoints across 11 route files |
| **Mongoose 9** | MongoDB ODM with schema validation | 8 data models |
| **MongoDB Atlas** | Cloud NoSQL database | All persistent storage |
| **bcryptjs** | Password hashing | Auth registration and login |
| **jsonwebtoken** | JWT generation and verification | Stateless session authentication |
| **express-validator 7** | Server-side input validation | Auth and task routes |
| **Google Gemini API** | AI language model | 9 distinct AI workflows (see Section 6) |
| **`@google/generative-ai` SDK** | Google AI client library | Listed in `backend/package.json` dependencies |
| **Python 3.x** | Analytics runtime | `analytics/main.py` |
| **FastAPI 0.115** | Python web framework | Analytics microservice |
| **pandas 2.2** | Data analysis and aggregation | Task pattern computation |
| **numpy 1.26** | Numerical computation | Score calculations in analytics |
| **plotly 5.22** | Chart data generation | Analytics visualization data |
| **pymongo 4.8** | Python MongoDB driver | Analytics microservice DB connection |
| **uvicorn** | ASGI server | Running the FastAPI analytics service |
| **dotenv** | Environment variable management | Both backend and analytics config |
| **nodemon** | Dev auto-reload | Backend development workflow |

---

## 6. Google Technologies Utilized

### Google Gemini API

**The primary and only Google technology used in this project, integrated deeply across the entire AI layer.**

**Why it was used:**
Google Gemini provides the natural language reasoning capability that makes AURA's intelligence possible. Tasks like decomposing a vague goal into structured work, synthesizing a day's activity into a warm reflection, or analyzing two competing priorities require understanding intent and context — not just pattern matching. Gemini handles this accurately and at the speed required for a real-time web application.

**How it improves the solution:**
Without Gemini, AURA would still work — the fallback system ensures that — but the quality of outputs would be significantly lower. Gemini's ability to understand the *meaning* of a goal (not just its keywords), produce warm and specific narrative text, and reason about structured task data in a human-readable way is what makes the AI features genuinely useful rather than gimmicky.

**Exactly where it is used in the implementation:**

| Location in Codebase | Gemini Call | Model Attempted |
|---|---|---|
| `aiController.js` — `plannerBreakdown` | Structured JSON task breakdown from goal description | gemini-2.5-flash → 2.0-flash → 3.5-flash |
| `aiController.js` — `generateReflection` | 2–3 sentence warm daily reflection narrative | gemini-2.5-flash → 2.0-flash → 3.5-flash |
| `goalsController.js` — `getConflicts` | Short actionable conflict resolution recommendation | gemini-2.5-flash → 2.0-flash → 3.5-flash |
| `decisionController.js` — `analyzeDecision` (compare) | Task winner, reasoning, tradeoffs, impact, success probability as structured JSON | gemini-2.5-flash → 2.0-flash → 3.5-flash |
| `decisionController.js` — `analyzeDecision` (free-form) | Natural-language answer to productivity question with task context | gemini-2.5-flash → 2.0-flash → 3.5-flash |
| `knowledgeController.js` — `generateKnowledge` | 10–14 item structured knowledge pack for a goal | gemini-2.5-flash → 2.0-flash → 3.5-flash |
| `dnaController.js` — `computeDNA` | 2-sentence behavioral insight from 30-day metrics | gemini-2.5-flash → 2.0-flash → 3.5-flash |
| `lifeBalanceEngine.js` — `computeAndSaveBalance` | 2-sentence balance observation + 3 actionable suggestions as JSON | gemini-2.5-flash → 2.0-flash → 3.5-flash |
| `analyticsController.js` — `generateWeeklyReport` | 3–4 sentence narrative weekly performance report | gemini-2.5-flash → 2.0-flash → 3.5-flash |

**API Integration Details:**
- REST endpoint: `https://generativelanguage.googleapis.com/v1/models/{model}:generateContent`
- Authentication: API key via `GEMINI_API_KEY` environment variable
- Multi-model cascade: `gemini-2.5-flash` → `gemini-2.0-flash` → `gemini-3.5-flash`
- Timeout: 10-second `AbortController` on every request
- Quota resilience: 429 / RESOURCE_EXHAUSTED errors trigger deterministic fallbacks
- SDK: `@google/generative-ai@^0.24.1` included as a dependency

**Note:** Firebase, Vertex AI, Google Cloud Run, Google Cloud Storage, Google Authentication, and other Google Cloud services are **not present in this codebase** and are not claimed.

---

## 7. Technical Highlights

### Project Architecture

AURA is a three-tier architecture:

- **Presentation layer**: React 19 SPA served by Vite. All routing is client-side with protected routes enforcing auth. Framer Motion provides staggered page transitions and animated components.
- **Application layer**: Express 5 REST API on Node.js. 13 controllers handle all business logic. JWT middleware protects every private route. express-validator sanitizes all inputs at system boundaries.
- **Data layer**: MongoDB Atlas. 8 Mongoose schemas with compound indexes on the most queried fields (`user+deadline`, `user+status`, `user+type+createdAt`, `user+date`).
- **Analytics layer**: Separate Python FastAPI microservice — computation-heavy pandas/numpy operations run isolated from the Node.js event loop, preventing any blocking of the main API.

### AI Workflow Design

Every Gemini call follows the same pattern:

```
1. Build a structured prompt from real MongoDB data
2. Specify exact JSON output format in the prompt
3. Set a 10-second AbortController timeout
4. Try gemini-2.5-flash; on 404 or 429, cascade to next model
5. Strip markdown wrappers and parse JSON
6. On any failure: execute deterministic fallback (never expose error to user)
7. Save result to AIHistory collection for audit trail
```

### Priority and Risk Engine

The Priority Engine (`priorityEngine.js`) produces a 0–100 score using:

```
score = (urgencyScore × 0.5) + (importanceScore × 0.4) − (effortPenalty × 0.1)
```

Where:
- `urgencyScore` = `max(0, 100 − hoursLeft × 0.5)` — approaches 100 as deadline nears
- `importanceScore` = mapped from priority: low=10, medium=30, high=60, critical=100
- `effortPenalty` = `min(30, estimatedMinutes / 10)`

Risk level uses buffer analysis: `buffer = hoursLeft − hoursNeeded`. If buffer < 0 → `high`. If buffer < 50% of hoursNeeded → `moderate`. Otherwise → `safe`.

This score flows into the adaptive planner sort, the decision advisor context, the daily mission selection, and directly into Gemini prompts as a numerical signal.

### Life Balance NLP Classification

The Life Balance engine (`lifeBalanceEngine.js`) uses keyword detection on task `title + description` to classify `personal` category tasks as either `relationships` or `personal_growth`. It matches against a social keyword list (friend, family, call, lunch, date, colleague, etc.) to route tasks to the appropriate dimension — a lightweight NLP-style classification without a model call.

### Security

- Passwords hashed with bcryptjs before storage; plaintext never logged or returned
- JWT tokens verified by `protect` middleware before every private controller executes
- CORS restricted to `FRONTEND_URL` environment variable only
- All secrets in `.env` files excluded from version control via `.gitignore`
- Axios 401 interceptor auto-clears token and redirects on session expiry

### Performance Optimizations

- Dashboard API uses `Promise.all` for parallel task and DNA fetches
- Productivity DNA is cached in MongoDB and only recomputed when `lastComputedAt` is more than 1 hour old
- MongoDB compound indexes on the 4 highest-frequency query patterns
- Heavy analytics computation (pandas, numpy) runs in the Python microservice — zero impact on Node.js event loop latency
- React Router code-splitting ensures only the current page's JavaScript loads

---

## 8. Conclusion

AURA addresses a problem that every student and professional faces: not the lack of a to-do list, but the absence of a system that tells you what is at risk, what to do next, and why your current patterns keep producing the same outcomes.

By combining a priority engine that detects risk *before* deadlines pass, an AI planner that converts goals into immediately actionable tasks, and a behavioral profile that learns from actual work history, AURA delivers something most productivity tools do not: a genuine reduction in the gap between intention and execution.

The Google Gemini API is woven into 9 distinct workflows — not as a feature, but as the reasoning engine that makes each workflow more useful than its algorithmic baseline. The result is a platform where the AI genuinely earns its presence by improving the quality of plans, reflections, decisions, and insights in ways that a formula alone cannot.

---

## Verification Checklist

| Claim | Verified Against |
|---|---|
| Gemini used in 9 workflows | `aiController.js`, `goalsController.js`, `decisionController.js`, `knowledgeController.js`, `dnaController.js`, `lifeBalanceEngine.js`, `analyticsController.js` |
| Model cascade: 2.5-flash → 2.0-flash → 3.5-flash | `gemini.js` lines 1–3; `aiController.js` lines 6–36 |
| 10-second AbortController timeout | `gemini.js` lines 10–13 |
| Quota fallback system | `aiController.js` `smartFallbackPlan()`, `knowledgeController.js` `getFallbackKnowledge()`, `lifeBalanceEngine.js` catch block |
| Priority score formula | `priorityEngine.js` lines 7–21 |
| Risk level buffer formula | `priorityEngine.js` lines 23–36 |
| Life balance NLP keyword list | `lifeBalanceEngine.js` lines 6–10 |
| 8 Mongoose models | `backend/src/models/` — User, Task, Goal, Reflection, AIHistory, LifeBalance, ProductivityDNA, KnowledgeBase |
| 44+ API endpoints | 11 route files in `backend/src/routes/` |
| Python analytics microservice | `analytics/main.py`, `analytics/requirements.txt` |
| `@google/generative-ai` SDK dependency | `backend/package.json` line 16 |
| JWT + bcrypt authentication | `authController.js`, `middleware/auth.js`, `utils/jwt.js` |
| Productivity DNA 30-day computation | `dnaController.js` `computeDNA()` function |
| Life Balance 7-dimension scoring | `lifeBalanceEngine.js` `buildScores()` function |
| AIHistory audit trail | `aiController.js` — `AIHistory.create()` after every Gemini call |
| Firebase / Vertex AI / Cloud Run used | ❌ **Not present in codebase — not claimed** |
| Google Authentication used | ❌ **Not present in codebase — not claimed** |
