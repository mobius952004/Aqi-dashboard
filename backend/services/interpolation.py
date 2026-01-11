import json
import os
import numpy as np
import geopandas as gpd
from scipy.spatial.distance import cdist

from backend.config import DATA_DIR

from datetime import datetime
import pytz

IST = pytz.timezone("Asia/Kolkata")

# -----------------------------
# IDW INTERPOLATION
# -----------------------------
def idw(x, y, values, xi, yi, power=2):
    coords = np.column_stack((x, y))
    dist = cdist([(xi, yi)], coords)[0]
    dist = np.where(dist == 0, 1e-6, dist)
    weights = 1 / (dist ** power)
    return np.sum(weights * values) / np.sum(weights)


# -----------------------------
# SAFE WARD NAME EXTRACTOR
# -----------------------------
def get_ward_name(ward):
    for key in [
        "ward_name",
        "WARDNAME",
        "WARD_NAME",
        "Ward_Name",
        "name",
        "Name",
        "WARD"
    ]:
        if key in ward and ward[key]:
            return str(ward[key]).strip()
    return "Unknown"

computed_at = datetime.now(IST).isoformat()

# -----------------------------
# MAIN COMPUTATION
# -----------------------------
def compute_ward_pollution(stations):
    wards = gpd.read_file(os.path.join(DATA_DIR, "wards.geojson"))

    pollutants = ["pm25", "pm10", "no2", "so2", "o3", "co"]
    ward_results = []

    for _, ward in wards.iterrows():
        centroid = ward.geometry.centroid
        ward_name = get_ward_name(ward)

        result = {
            "ward_name": ward_name,
            "aqi": None,
            "pollutants": {},
            "computed_at": computed_at
        }


        # -------- AQI --------
        aqi_points = [
            s for s in stations
            if isinstance(s.get("aqi"), int)
        ]

        if len(aqi_points) >= 3:
            x = np.array([s["lon"] for s in aqi_points])
            y = np.array([s["lat"] for s in aqi_points])
            v = np.array([s["aqi"] for s in aqi_points])

            result["aqi"] = round(
                float(idw(x, y, v, centroid.x, centroid.y)), 2
            )

        # -------- POLLUTANTS --------
        for p in pollutants:
            points = [
                s for s in stations
                if s.get("pollutants", {}).get(p) is not None
            ]

            if len(points) < 3:
                result["pollutants"][p] = None
                continue

            x = np.array([s["lon"] for s in points])
            y = np.array([s["lat"] for s in points])
            v = np.array([s["pollutants"][p] for s in points])

            result["pollutants"][p] = round(
                float(idw(x, y, v, centroid.x, centroid.y)), 2
            )

        ward_results.append(result)

    # -----------------------------
    # SAVE SINGLE FILE
    # -----------------------------
    os.makedirs(DATA_DIR, exist_ok=True)
    output_path = os.path.join(DATA_DIR, "ward_pollution.json")

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(ward_results, f, indent=2)

    print(f"[INFO] Saved ward pollution data → {output_path}")

    return ward_results


# -----------------------------
# ENTRY POINT
# -----------------------------
if __name__ == "__main__":
    stations_path = os.path.join(DATA_DIR, "stations.json")

    with open(stations_path, "r", encoding="utf-8") as f:
        stations = json.load(f)

    compute_ward_pollution(stations)
