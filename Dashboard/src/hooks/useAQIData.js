// import { useEffect, useState } from "react";
// import { fetchLiveWardAQI, fetchWardsGeoJSON } from "../services/api";

// function normalizeWardName(name) {
//   if (!name) return "";
//   return name
//     .toLowerCase()
//     .replace(/-/g, " ")
//     .replace(/\s+/g, " ")
//     .replace(/[^\w\s]/g, "")
//     .trim();
// }

// export function useAQIData() {
//   const [wardsGeoJSON, setWardsGeoJSON] = useState(null);
//   const [wardAQIMap, setWardAQIMap] = useState({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function load() {
//       try {
//         const [aqiData, geojson] = await Promise.all([
//           fetchLiveWardAQI(),
//           fetchWardsGeoJSON()
//         ]);

//         const map = {};
//         aqiData.forEach(w => {
//           map[normalizeWardName(w.ward_name)] = w;
//         });

//         setWardAQIMap(map);
//         setWardsGeoJSON(geojson);
//       } catch (err) {
//         console.error("AQI data load failed:", err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     load();
//   }, []);

//   return { wardsGeoJSON, wardAQIMap, loading };
// }
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
      map[normalizeWardName(w.ward_name)] = w;
    });
    return map;
  }, [liveWards]);

  return { wardsGeoJSON, wardAQIMap, loading };
}
