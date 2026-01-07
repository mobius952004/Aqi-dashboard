import json
import numpy as np
import geopandas as gpd
from shapely.geometry import Point
from scipy.spatial.distance import cdist

from backend.config import DATA_DIR


def idw(x, y, values, xi, yi, power=2):
    coords = np.column_stack((x, y))
    dist = cdist([(xi, yi)], coords)[0]

    # Avoid division by zero
    dist = np.where(dist == 0, 1e-6, dist)

    weights = 1 / (dist ** power)
    return np.sum(weights * values) / np.sum(weights)


def compute_ward_aqi(stations):
    # Load ward boundaries
    wards = gpd.read_file(f"{DATA_DIR}/wards.geojson")

    # Build clean station arrays (aligned!)
    station_points = []
    for s in stations:
        if isinstance(s.get("aqi"), int):
            station_points.append({
                "x": s["lon"],
                "y": s["lat"],
                "aqi": s["aqi"]
            })

    if not station_points:
        raise RuntimeError("No valid station AQI data available")

    x = np.array([p["x"] for p in station_points])
    y = np.array([p["y"] for p in station_points])
    values = np.array([p["aqi"] for p in station_points])

    ward_results = []

    for _, ward in wards.iterrows():
        geom = ward.geometry

        # Handle MultiPolygon safely
        centroid = geom.centroid

        aqi_est = idw(
            x, y, values,
            centroid.x,
            centroid.y
        )

        ward_results.append({
            "ward_name": ward.get("Ward_Name", ward.get("WARDNAME", "Unknown")),
            "aqi": round(float(aqi_est), 2),
            "stations_used": len(values),
            "method": "IDW"
        })

    # Save output
    output_path = f"{DATA_DIR}/ward_aqi.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(ward_results, f, indent=2)

    print(f"[INFO] Saved ward AQI → {output_path}")

    return ward_results

if __name__ == "__main__":
    from backend.config import DATA_DIR

    stations_path = f"{DATA_DIR}/stations.json"

    with open(stations_path, "r", encoding="utf-8") as f:
        stations = json.load(f)

    print(f"[INFO] Loaded {len(stations)} stations")

    compute_ward_aqi(stations)
