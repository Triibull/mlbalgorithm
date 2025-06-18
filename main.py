from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import date
from app.pipeline import run_full_projection
from pybaseball import pitching_stats_range

app = FastAPI()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

cached_projections = []

@app.on_event("startup")
def startup_event():
    global cached_projections
    cached_projections = run_full_projection(date.today())

@app.get("/api/projections")
def get_today_projections():
    return cached_projections


def get_last_7_k_logs(pitcher_id):
    from datetime import timedelta
    import pandas as pd
    from pybaseball import statcast_pitcher_game_logs

    today = date.today()
    past = today - timedelta(days=60)
    try:
        logs = statcast_pitcher_game_logs(pitcher_id, past.strftime('%Y-%m-%d'), today.strftime('%Y-%m-%d'))
        logs = logs.sort_values("GameDate", ascending=False)
        last_7 = logs.head(7)
        return last_7["SO"].tolist()
    except Exception as e:
        print(f"Error fetching game logs for pitcher {pitcher_id}: {e}")
        return []
