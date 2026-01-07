import { useEffect, useState } from "react";
import { fetchWardAQI, fetchWardsGeoJSON } from "../services/api";

function normalizeWardName(name) {
  if (!name) return "";
  return name
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .replace(/[^\w\s]/g, "")
    .trim();
}

export function useAQIData() {
  const [wardsGeoJSON, setWardsGeoJSON] = useState(null);
  const [wardAQIMap, setWardAQIMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [aqiData, geojson] = await Promise.all([
          fetchWardAQI(),
          fetchWardsGeoJSON()
        ]);

        const map = {};
        aqiData.forEach(w => {
          map[normalizeWardName(w.ward_name)] = w;
        });

        setWardAQIMap(map);
        setWardsGeoJSON(geojson);
      } catch (err) {
        console.error("AQI data load failed:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { wardsGeoJSON, wardAQIMap, loading };
}
