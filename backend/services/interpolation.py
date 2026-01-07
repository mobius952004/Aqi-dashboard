import geopandas as gpd
import numpy as np
import json
from shapely.geometry import Point
from scipy.spatial import distance

def idw(x, y, values, xi, yi, power=2):
    dist = distance.cdist([(xi, yi)], list(zip(x, y)))[0]
    weights = 1 / (dist ** power + 1e-6)
    return np.sum(weights * values) / np.sum(weights)

def compute_ward_aqi(stations):
    wards = gpd.read_file("data/wards.geojson")

    station_x = np.array([s["lon"] for s in stations])
    station_y = np.array([s["lat"] for s in stations])
    station_aqi = np.array([s["aqi"] for s in stations if isinstance(s["aqi"], int)])

    ward_results = []

    for _, ward in wards.iterrows():
        centroid = ward.geometry.centroid
        aqi_est = idw(
            station_x,
            station_y,
            station_aqi,
            centroid.x,
            centroid.y
        )

        ward_results.append({
            "ward_name": ward["ward_name"],
            "aqi": round(float(aqi_est), 2)
        })

    with open("data/ward_aqi.json", "w") as f:
        json.dump(ward_results, f, indent=2)

    return ward_results
