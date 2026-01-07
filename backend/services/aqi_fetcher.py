import requests
import json
from datetime import datetime
from pathlib import Path

from backend.config import WAQI_TOKEN, DELHI_BBOX, DATA_DIR

API_URL = "https://api.waqi.info/map/bounds/"


def fetch_station_aqi():
    params = {
        "latlng": ",".join(map(str, DELHI_BBOX)),
        "token": WAQI_TOKEN
    }

    response = requests.get(API_URL, params=params, timeout=10)
    response.raise_for_status()

    payload = response.json()

    if payload.get("status") != "ok":
        raise RuntimeError(f"WAQI API error: {payload}")

    stations = []

    for s in payload["data"]:
        aqi = s.get("aqi")

        # Skip invalid AQI values
        if aqi in [None, "-", ""]:
            continue

        stations.append({
            "uid": s.get("uid"),
            "station_name": s.get("station", {}).get("name"),
            "lat": s.get("lat"),
            "lon": s.get("lon"),
            "aqi": int(aqi),
            "fetched_at": datetime.utcnow().isoformat()
        })

    return stations


def save_stations(stations):
    output_path = Path(DATA_DIR) / "stations.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(stations, f, indent=2)

    print(f"[INFO] Saved {len(stations)} stations → {output_path}")


if __name__ == "__main__":
    stations = fetch_station_aqi()
    save_stations(stations)
