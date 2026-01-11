export async function fetchLiveWardAQI() {
  const res = await fetch("http://localhost:5000/api/wards");
  if (!res.ok) throw new Error("Failed to fetch live AQI");
  return res.json();
}
  
  export async function fetchWardsGeoJSON() {
    const res = await fetch("/data/wards.geojson");
    if (!res.ok) throw new Error("Failed to load wards GeoJSON");
    return res.json();
  }
  
  export async function fetchGcnWardAQI() {
  const res = await fetch("http://localhost:5000/api/gcn");
  if (!res.ok) throw new Error("Failed to fetch live AQI");
  return res.json();
}