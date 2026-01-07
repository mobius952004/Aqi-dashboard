import os
from dotenv import load_dotenv

load_dotenv()  # loads backend/.env

WAQI_TOKEN = os.getenv("WAQI_TOKEN")

CITY_NAME = os.getenv("CITY_NAME", "Delhi")

# Parse bounding box
DELHI_BBOX = tuple(map(float, os.getenv("DELHI_BBOX").split(",")))

DATA_DIR = os.getenv("DATA_DIR", "backend/data")

if not WAQI_TOKEN:
    raise RuntimeError("WAQI_TOKEN not set in .env")
