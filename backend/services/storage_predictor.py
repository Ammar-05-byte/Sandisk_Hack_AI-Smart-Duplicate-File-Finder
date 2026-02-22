import os
import stat
import time
from typing import List, Dict, Any, Optional
import numpy as np
from datetime import datetime, timedelta

from models.schemas import StoragePredictionResponse


def get_disk_usage(path: str) -> Dict[str, int]:
    """Get disk usage stats for the filesystem containing path."""
    st = os.statvfs(path)
    total = st.f_blocks * st.f_frsize
    free = st.f_bfree * st.f_frsize
    used = total - free
    return {"total": total, "free": free, "used": used}


def simulate_historical_data(current_used: int, days: int = 30) -> List[Dict[str, Any]]:
    """
    Simulate historical storage data using realistic growth patterns.
    In production, this would come from actual system logs or monitoring.
    """
    # Simulate ~2-5% daily growth with some noise
    growth_rate = np.random.uniform(0.02, 0.05)
    history = []
    now = datetime.now()

    for i in range(days, 0, -1):
        date = now - timedelta(days=i)
        # Work backward from current size
        size = current_used / ((1 + growth_rate) ** i)
        noise = size * np.random.uniform(-0.01, 0.01)
        history.append({
            "date": date.strftime("%Y-%m-%d"),
            "size_bytes": max(0, int(size + noise)),
            "size_gb": round(max(0, (size + noise) / (1024 ** 3)), 2),
        })

    return history


async def predict_storage_growth(directory_path: str) -> StoragePredictionResponse:
    """
    Use linear regression on historical storage data to predict when disk will be full.
    """
    try:
        disk = get_disk_usage(directory_path)
    except Exception:
        return StoragePredictionResponse(
            days_until_full=None,
            growth_rate_gb_per_day=0.0,
            predicted_sizes=[],
            confidence=0.0,
        )

    total = disk["total"]
    used = disk["used"]
    free = disk["free"]

    # Simulate historical data (in real prod: fetch from DB/monitoring)
    history = simulate_historical_data(used, days=30)

    # Fit linear regression on historical data
    sizes = np.array([h["size_bytes"] for h in history], dtype=float)
    days_x = np.arange(len(sizes), dtype=float)

    # Linear fit: size = a * day + b
    a, b = np.polyfit(days_x, sizes, 1)
    growth_rate_bytes = max(0, a)  # bytes per day

    # Predict future
    predictions = []
    now = datetime.now()
    for future_day in range(0, 90, 7):  # Weekly for 90 days
        pred_date = now + timedelta(days=future_day)
        pred_size = used + growth_rate_bytes * future_day
        predictions.append({
            "date": pred_date.strftime("%Y-%m-%d"),
            "size_bytes": int(pred_size),
            "size_gb": round(pred_size / (1024 ** 3), 2),
            "projected": True,
        })

    # Days until full
    if growth_rate_bytes > 0:
        days_until_full = int(free / growth_rate_bytes)
    else:
        days_until_full = None

    # Confidence: R² score
    y_pred = a * days_x + b
    ss_res = np.sum((sizes - y_pred) ** 2)
    ss_tot = np.sum((sizes - np.mean(sizes)) ** 2)
    r2 = float(1 - ss_res / ss_tot) if ss_tot > 0 else 0.0
    confidence = max(0.0, min(1.0, r2))

    growth_rate_gb = growth_rate_bytes / (1024 ** 3)

    return StoragePredictionResponse(
        days_until_full=days_until_full,
        growth_rate_gb_per_day=round(growth_rate_gb, 4),
        predicted_sizes=predictions,
        confidence=round(confidence, 3),
    )
