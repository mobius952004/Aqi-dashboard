import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { getAQIColor } from "../../constants/aqiColors";

function normalizeWardName(name) {
  if (!name) return "";
  return name
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .replace(/[^\w\s]/g, "")
    .trim();
}

export default function PollutionMap({ wardsGeoJSON, wardAQIMap }) {
  function styleFeature(feature) {
    const name =
      feature.properties.WARDNAME ||
      feature.properties.Ward_Name ||
      feature.properties.ward_name ||
      feature.properties.name ||
      "";

    const ward = wardAQIMap[normalizeWardName(name)];
    const aqi = ward?.aqi;

    return {
      fillColor: aqi ? getAQIColor(aqi) : "#d1d5db",
      weight: 1,
      color: "#374151",
      fillOpacity: 0.7
    };
  }

  function onEachWard(feature, layer) {
    const name =
      feature.properties.WARDNAME ||
      feature.properties.Ward_Name ||
      feature.properties.ward_name ||
      feature.properties.name ||
      "Unknown";

    const ward = wardAQIMap[normalizeWardName(name)];

    layer.bindTooltip(
      `<strong>${name}</strong><br/>AQI: ${ward?.aqi ?? "N/A"}`,
      { sticky: true }
    );
  }

  console.log("GeoJSON:", wardsGeoJSON);
  console.log("AQI map:", wardAQIMap);


  return (
    <MapContainer
      center={[28.6139, 77.2090]}
      zoom={11}
      className="h-full w-full"
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {wardsGeoJSON && (
        <GeoJSON
          data={wardsGeoJSON}
          style={styleFeature}
          onEachFeature={onEachWard}
        />
      )}
    </MapContainer>
  );
}
