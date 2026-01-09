import os
from dotenv import load_dotenv

load_dotenv()

WAQI_TOKEN = os.getenv("WAQI_TOKEN")

CITY_NAME = os.getenv("CITY_NAME", "Delhi")

# KEEP AS STRING — WAQI REQUIRES THIS
DELHI_BBOX = os.getenv("DELHI_BBOX")

DATA_DIR = os.getenv("DATA_DIR", "backend/data")

if not WAQI_TOKEN:
    raise RuntimeError("WAQI_TOKEN not set in .env")

if not DELHI_BBOX:
    raise RuntimeError("DELHI_BBOX not set in .env")
