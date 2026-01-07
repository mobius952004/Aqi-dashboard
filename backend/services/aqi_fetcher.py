import requests
import json
import os 
from dotenv import load_dotenv
load_dotenv()

API_KEY = os.getenv(API_KEy)
API_URL = "https://api.waqi.info/map/bounds/"

def fetch_station_aqi():
    params = {
        "latlng": "28.40,76.80,28.90,77.35",  # Delhi NCR bounding box
        "token": API_KEY
    }

    response = requests.get(API_URL, params=params)
    data = response.json()["data"]

    stations = []
    for s in data:
        stations.append({
            "lat": s["lat"],
            "lon": s["lon"],
            "aqi": s["aqi"]
        })

    # Cache for reproducibility
    with open("data/stations.json", "w") as f:
        json.dump(stations, f, indent=2)

    return stations

# import requests
# import pandas as pd

# url = "https://api.openaq.org/v2/measurements"

# params = {
#     "city": "Delhi",
#     "country": "IN",
#     "parameter": "pm25",
#     "date_from": "2024-01-01",
#     "date_to": "2024-01-31",
#     "limit": 1000
# }

# res = requests.get(url, params=params)
# results = res.json()["results"]

# rows = []
# for r in results:
#     rows.append({
#         "datetime": r["date"]["utc"],
#         "lat": r["coordinates"]["latitude"],
#         "lon": r["coordinates"]["longitude"],
#         "value": r["value"]
#     })

# df = pd.DataFrame(rows)
# df.to_csv("data/historical_pm25.csv", index=False)

