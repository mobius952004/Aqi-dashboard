from flask import Flask, jsonify
from flask_cors import CORS
import os
import json
import threading
import time

from backend.services.aqi_fetcher import fetch_station_aqi
from backend.services.interpolation import compute_ward_pollution
from backend.config import DATA_DIR

app = Flask(__name__)
CORS(app)


# -----------------------------
# HEALTH CHECK
# -----------------------------
@app.route("/api/health")
def health():
    return {"status": "ok"}


# -----------------------------
# GET RAW STATION DATA
# -----------------------------
@app.route("/api/stations")
def get_stations():
    path = os.path.join(DATA_DIR, "stations.json")
    if not os.path.exists(path):
        return {"error": "stations.json not found"}, 404

    with open(path, "r", encoding="utf-8") as f:
        return jsonify(json.load(f))


# -----------------------------
# GET WARD-LEVEL POLLUTION DATA
# -----------------------------
@app.route("/api/wards")
def get_wards():
    path = os.path.join(DATA_DIR, "ward_pollution.json")
    if not os.path.exists(path):
        return {"error": "ward_pollution.json not found"}, 404

    with open(path, "r", encoding="utf-8") as f:
        return jsonify(json.load(f))


def update_ward_data():
    print("[INFO] Running scheduled ward update")

    # Step 1: Fetch station AQI + pollutants
    stations = fetch_station_aqi()

    # Step 2: Interpolate ward pollution
    ward_data = compute_ward_pollution(stations)

    print("[INFO] Ward update completed")

    return {
        "message": "Pollution data updated successfully",
        "stations": len(stations),
        "wards": len(ward_data)
    }
    
def scheduler ():
    while True :
        try :
            update_ward_data()
        except Exception as e:
            print ("[ERROR] Scheduler Failed:",e)

        time.sleep(60)

# -----------------------------
# ENTRY POINT
# -----------------------------
if __name__ == "__main__":
    threading.Thread(target=scheduler, daemon=True).start()
    app.run(debug=True)
