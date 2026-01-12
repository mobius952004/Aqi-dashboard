import { useEffect, useMemo, useState } from "react";
import { fetchWardsGeoJSON } from "../services/api";

function normalizeWardName(name) {
  if (!name) return "";
  return name
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .replace(/[^\w\s]/g, "")
    .trim();


}

export function useAQIData(liveWards = []) {
  const [wardsGeoJSON, setWardsGeoJSON] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Side effect: fetching external data (allowed)
  useEffect(() => {
    fetchWardsGeoJSON()
      .then(setWardsGeoJSON)
      .finally(() => setLoading(false));
  }, []);

  // ✅ Derived data: computed, not stored
  const wardAQIMap = useMemo(() => {
    const map = {};
    liveWards.forEach(w => {
      const rawName =
        w.ward_name ||
        w.ward ||
        w.name;
  
      if (!rawName) return;
  
      map[normalizeWardName(rawName)] = w;
      // console.log(w)
    });
    return map;
  }, [liveWards]);

  return { wardsGeoJSON, wardAQIMap, loading };
}
