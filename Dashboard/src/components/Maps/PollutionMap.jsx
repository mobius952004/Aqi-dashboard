import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import { useState } from "react";
import { getAQIColor } from "../../constants/aqiColors";

/* ------------------ Helpers ------------------ */
function normalizeWardName(name) {
  if (!name) return "";
  return name
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .replace(/[^\w\s]/g, "")
    .trim();
}

/* ------------------ Interaction Toggle ------------------ */
function MapInteractionController({ enabled }) {
  const map = useMap();

  if (enabled) {
    map.scrollWheelZoom.enable();
    map.dragging.enable();
    map.doubleClickZoom.enable();
  } else {
    map.scrollWheelZoom.disable();
    map.dragging.disable();
    map.doubleClickZoom.disable();
  }

  return null;
}

/* ------------------ Main Component ------------------ */
export default function PollutionMap({ wardsGeoJSON, wardAQIMap }) {
  const [interactive, setInteractive] = useState(false);

  function styleFeature(feature) {
    const name =
      feature.properties.WARDNAME ||
      feature.properties.Ward_Name ||
      feature.properties.ward_name ||
      feature.properties.name ||
      "";

    const ward = wardAQIMap?.[normalizeWardName(name)];
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

    const ward = wardAQIMap?.[normalizeWardName(name)];

    layer.bindTooltip(
      `<strong>${name}</strong><br/>AQI: ${ward?.aqi ?? "N/A"}`,
      { sticky: true }
    );
  }

  return (
    <div className="relative h-full w-full">
      {/* Interaction Toggle Button */}
      <button
        onClick={() => setInteractive(!interactive)}
        className="absolute top-3 right-3 z-1000 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-800 transition"
      >
        {interactive ? "Disable Map Interaction" : "Enable Map Interaction"}
      </button>

      <MapContainer
        center={[28.6139, 77.2090]}
        zoom={11}
        className="h-full w-full rounded-4xl"
        scrollWheelZoom={false} // important
      >
        <MapInteractionController enabled={interactive} />

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
    </div>
  );
}
