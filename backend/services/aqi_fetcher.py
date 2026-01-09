import requests
import json
import os
import time

from backend.config import WAQI_TOKEN, DELHI_BBOX, DATA_DIR

MAP_URL = "https://api.waqi.info/map/bounds/"
FEED_URL = "https://api.waqi.info/feed/@{}"


def fetch_station_details(uid):
    """Fetch pollutant data for a single station."""
    try:
        r = requests.get(
            FEED_URL.format(uid),
            params={"token": WAQI_TOKEN},
            timeout=10
        )
        data = r.json()
        if data.get("status") != "ok":
            return {}

        iaqi = data["data"].get("iaqi", {})

        def get_val(k):
            try:
                return int(iaqi[k]["v"])
            except Exception:
                return None

        return {
            "pm25": get_val("pm25"),
            "pm10": get_val("pm10"),
            "no2": get_val("no2"),
            "so2": get_val("so2"),
            "o3":  get_val("o3"),
            "co":  get_val("co"),
        }

    except Exception:
        return {}


def fetch_station_aqi():
    params = {
        "latlng": DELHI_BBOX,  # STRING
        "token": WAQI_TOKEN
    }

    response = requests.get(MAP_URL, params=params, timeout=10)
    response.raise_for_status()

    data = response.json()
    stations_raw = data.get("data", [])

    print("[DEBUG] Stations discovered:", len(stations_raw))

    stations = []

    for s in stations_raw:
        uid = s.get("uid")
        if uid is None:
            continue

        pollutants = fetch_station_details(uid)

        station = {
            "uid": uid,
            "lat": s["lat"],
            "lon": s["lon"],
            "aqi": (
                int(s["aqi"])
                if isinstance(s.get("aqi"), (int, str)) and str(s["aqi"]).isdigit()
                else None
            ),
            "pollutants": pollutants
        }

        stations.append(station)

        # Respect WAQI rate limits
        time.sleep(0.3)

    os.makedirs(DATA_DIR, exist_ok=True)
    out = os.path.join(DATA_DIR, "stations.json")

    with open(out, "w", encoding="utf-8") as f:
        json.dump(stations, f, indent=2)

    print(f"[INFO] Saved {len(stations)} stations with pollutants")

    return stations


if __name__ == "__main__":
    print("[INFO] Running AQI fetcher directly")
    fetch_station_aqi()
