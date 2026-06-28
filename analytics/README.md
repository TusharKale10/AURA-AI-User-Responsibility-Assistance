# AURA Python Analytics Module

Advanced analytics computed with pandas and numpy.

## Setup

```bash
cd analytics
pip install -r requirements.txt
python main.py
```

Runs on **http://localhost:8000**

## Endpoints

| Route | Description |
|-------|-------------|
| GET /analytics/overview?user_id=<id> | 30-day overview, daily trend, category breakdown |
| GET /analytics/trends?user_id=<id> | Weekly data, hourly productivity, burnout trend |
| GET /analytics/productivity?user_id=<id> | Scores + 3-day forecast |
| GET /analytics/life-score?user_id=<id> | Life balance from task categories |
| GET /analytics/consistency?user_id=<id> | Consistency score |

## Notes
- Requires MongoDB URI from `../backend/.env`
- Optional enhancement — the Node.js analytics endpoints work independently
