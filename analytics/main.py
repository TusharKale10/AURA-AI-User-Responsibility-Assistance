"""
AURA Python Analytics Module
Provides advanced analytics computed with pandas/numpy.
Runs on port 8000. Node.js backend calls this internally.
"""
import os
from datetime import datetime, timedelta
from typing import Optional
from dotenv import load_dotenv

load_dotenv(dotenv_path="../backend/.env")

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from bson import ObjectId
import pandas as pd
import numpy as np

app = FastAPI(title="AURA Analytics", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/aura")
client = MongoClient(MONGO_URI)
db = client.get_database()


def serialize(doc):
    """Convert MongoDB doc to JSON-safe dict."""
    if doc is None:
        return None
    doc = dict(doc)
    for k, v in doc.items():
        if isinstance(v, ObjectId):
            doc[k] = str(v)
        elif isinstance(v, datetime):
            doc[k] = v.isoformat()
    return doc


def get_tasks_df(user_id: str, days: int = 30) -> pd.DataFrame:
    since = datetime.utcnow() - timedelta(days=days)
    tasks = list(db.tasks.find({"user": ObjectId(user_id), "createdAt": {"$gte": since}}))
    if not tasks:
        return pd.DataFrame()
    df = pd.DataFrame(tasks)
    df["_id"] = df["_id"].astype(str)
    df["user"] = df["user"].astype(str)
    for col in ["createdAt", "deadline", "completedAt"]:
        if col in df.columns:
            df[col] = pd.to_datetime(df[col], errors="coerce")
    return df


@app.get("/")
def health():
    return {"status": "ok", "service": "AURA Analytics", "version": "1.0.0"}


@app.get("/analytics/overview")
def analytics_overview(user_id: str = Query(...)):
    df = get_tasks_df(user_id, days=30)
    if df.empty:
        return {"message": "No data", "overview": {}}

    completed = df[df["status"] == "completed"]
    total = len(df)
    done = len(completed)
    rate = round(done / total * 100, 1) if total > 0 else 0

    # Daily completion counts (last 14 days)
    now = datetime.utcnow()
    daily = []
    for i in range(13, -1, -1):
        day = now - timedelta(days=i)
        day_str = day.strftime("%Y-%m-%d")
        day_done = completed[completed["completedAt"].dt.strftime("%Y-%m-%d") == day_str] if "completedAt" in completed.columns else pd.DataFrame()
        daily.append({"date": day_str, "label": day.strftime("%a %d"), "completed": len(day_done)})

    # Category breakdown
    cat_breakdown = {}
    if "category" in df.columns:
        for cat, group in df.groupby("category"):
            cat_breakdown[cat] = {
                "total": len(group),
                "completed": len(group[group["status"] == "completed"])
            }

    # Priority distribution
    priority_dist = {}
    if "priority" in df.columns:
        for p, g in df.groupby("priority"):
            priority_dist[p] = len(g)

    return {
        "overview": {
            "totalTasks": total,
            "completedTasks": done,
            "completionRate": rate,
        },
        "dailyTrend": daily,
        "categoryBreakdown": cat_breakdown,
        "priorityDistribution": priority_dist,
    }


@app.get("/analytics/trends")
def analytics_trends(user_id: str = Query(...)):
    df = get_tasks_df(user_id, days=30)
    if df.empty:
        return {"weeklyData": [], "hourlyProductivity": [], "categoryTrend": {}}

    completed = df[df["status"] == "completed"].copy()
    now = datetime.utcnow()

    # Weekly data (last 4 weeks)
    weekly = []
    for weeks_ago in range(3, -1, -1):
        start = now - timedelta(weeks=weeks_ago + 1)
        end = now - timedelta(weeks=weeks_ago)
        wdf = df[(df["createdAt"] >= start) & (df["createdAt"] < end)]
        wc = wdf[wdf["status"] == "completed"]
        rate = round(len(wc) / len(wdf) * 100) if len(wdf) > 0 else 0
        weekly.append({
            "week": "This week" if weeks_ago == 0 else f"{weeks_ago}w ago",
            "total": len(wdf),
            "completed": len(wc),
            "rate": rate,
        })

    # Hourly productivity (0-23)
    hourly = [{"hour": h, "count": 0} for h in range(24)]
    if "completedAt" in completed.columns:
        for h, g in completed.dropna(subset=["completedAt"]).groupby(completed["completedAt"].dt.hour):
            if 0 <= h <= 23:
                hourly[h]["count"] = len(g)

    # Burnout trend (tasks created per day normalized)
    burnout = []
    for i in range(13, -1, -1):
        day = now - timedelta(days=i)
        day_str = day.strftime("%Y-%m-%d")
        day_tasks = df[df["createdAt"].dt.strftime("%Y-%m-%d") == day_str]
        burnout.append({"date": day_str, "taskLoad": len(day_tasks)})

    return {"weeklyData": weekly, "hourlyProductivity": hourly, "burnoutTrend": burnout}


@app.get("/analytics/productivity")
def analytics_productivity(user_id: str = Query(...)):
    df = get_tasks_df(user_id, days=7)
    if df.empty:
        return {"productivityScore": 50, "completionScore": 50, "punctualityScore": 50}

    completed = df[df["status"] == "completed"]
    total = len(df)
    done = len(completed)

    completion_score = round(done / total * 100) if total > 0 else 50

    # Punctuality: completed before deadline
    on_time = 0
    if "deadline" in completed.columns and "completedAt" in completed.columns:
        ct = completed.dropna(subset=["completedAt", "deadline"])
        on_time = len(ct[ct["completedAt"] <= ct["deadline"]])
    punctuality_score = round(on_time / max(1, done) * 100)

    productivity_score = round(completion_score * 0.6 + punctuality_score * 0.4)

    # Forecast: simple moving average for next 3 days
    daily_completed = []
    now = datetime.utcnow()
    for i in range(6, -1, -1):
        day = now - timedelta(days=i)
        day_done = len(completed[completed["completedAt"].dt.date == day.date()]) if "completedAt" in completed.columns else 0
        daily_completed.append(day_done)

    avg = np.mean(daily_completed) if daily_completed else 1
    forecast = [{"day": f"Day +{i+1}", "predicted": round(avg * (1 + np.random.uniform(-0.1, 0.1)))} for i in range(3)]

    return {
        "productivityScore": productivity_score,
        "completionScore": completion_score,
        "punctualityScore": punctuality_score,
        "completedCount": done,
        "overdueCount": len(df[(df["status"] != "completed") & (df["deadline"] < now)]) if "deadline" in df.columns else 0,
        "forecast": forecast,
    }


@app.get("/analytics/life-score")
def analytics_life_score(user_id: str = Query(...)):
    """Compute life balance score from task categories."""
    df = get_tasks_df(user_id, days=7)
    if df.empty:
        base = {"career": 50, "learning": 50, "health": 50, "finance": 50, "personal_growth": 50, "habits": 50, "relationships": 50}
        return {"scores": base}

    cat_map = {"work": "career", "study": "learning", "health": "health", "finance": "finance", "personal": "personal_growth", "other": "habits"}
    scores = {}
    for cat, dim in cat_map.items():
        cat_tasks = df[df["category"] == cat] if "category" in df.columns else pd.DataFrame()
        if len(cat_tasks) == 0:
            scores[dim] = 40
        else:
            done = len(cat_tasks[cat_tasks["status"] == "completed"])
            scores[dim] = min(100, round(done / len(cat_tasks) * 100))
    scores["relationships"] = 50

    avg = round(np.mean(list(scores.values())))
    return {"scores": scores, "average": avg}


@app.get("/analytics/consistency")
def analytics_consistency(user_id: str = Query(...)):
    """Consistency score — how many of the last 30 days had at least 1 completed task."""
    df = get_tasks_df(user_id, days=30)
    completed = df[df["status"] == "completed"] if not df.empty else pd.DataFrame()

    active_days = 0
    if not completed.empty and "completedAt" in completed.columns:
        active_days = completed["completedAt"].dt.date.nunique()

    consistency = round(active_days / 30 * 100)
    return {"consistencyScore": consistency, "activeDays": active_days, "totalDays": 30}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
