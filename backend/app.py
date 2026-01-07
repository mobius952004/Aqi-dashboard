from flask import Flask, jsonify
from flask_cors import CORS
from services.aqi_fetcher import fetch_station_aqi
from services.interpolation import compute_ward_aqi

app = Flask(__name__)
CORS(app)

@app.route("/update-aqi")
def update_aqi():
    stations = fetch_station_aqi()
    ward_data = compute_ward_aqi(stations)
    return jsonify(ward_data)

@app.route("/wards")
def get_wards():
    with open("data/ward_aqi.json") as f:
        return jsonify(f.read())

if __name__ == "__main__":
    app.run(debug=True)
