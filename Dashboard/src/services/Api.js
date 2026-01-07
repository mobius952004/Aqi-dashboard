export async function fetchWardAQI() {
    const res = await fetch("/data/ward_aqi.json");
    if (!res.ok) throw new Error("Failed to load ward AQI");
    return res.json();
  }
  
  export async function fetchWardsGeoJSON() {
    const res = await fetch("/data/wards.geojson");
    if (!res.ok) throw new Error("Failed to load wards GeoJSON");
    return res.json();
  }
  