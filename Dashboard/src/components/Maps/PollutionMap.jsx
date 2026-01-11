import { MapContainer, TileLayer, GeoJSON, useMap, Pane } from "react-leaflet";
import { useState } from "react";
import { getAQIColor } from "../../constants/aqiColors";

// 🔑 GET A FREE KEY HERE: https://developer.tomtom.com/
const TOMTOM_API_KEY = "HzFDEc6OOkDL1DT5GagfJTKOOOf5sieX"; 

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

/* ------------------ Interaction Controller ------------------ */
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
  const [showTraffic, setShowTraffic] = useState(false); // New State

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
      // If Traffic is ON, make wards more transparent so we can see roads
      fillColor: aqi ? getAQIColor(aqi) : "#d1d5db",
      weight: showTraffic ? 1 : 2, 
      color: "#374151",
      fillOpacity: showTraffic ? 0.3 : 0.7, // Reduce opacity when traffic is on
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

    // Dynamic Tooltip Content
    const content = `
      <div class="text-sm">
        <strong class="text-lg block mb-1">${name}</strong>
        <span class="${ward?.aqi > 300 ? 'text-red-600 font-bold' : ''}">
          AQI: ${ward?.aqi ?? "N/A"}
        </span>
        ${
          ward?.traffic_score
            ? `<br/><span class="text-blue-600">🚗 Congestion: ${ward.traffic_score}</span>`
            : ""
        }
      </div>
    `;

    layer.bindTooltip(content, { sticky: true, direction: "top" });
  }

  return (
    <div className="relative h-full w-full">
      {/* Controls Container */}
      <div className="absolute top-3 right-3 z-1000 flex flex-col gap-2">
        
        {/* Toggle Traffic Button */}
        <button
          onClick={() => setShowTraffic(!showTraffic)}
          className={`px-4 py-2 rounded-lg shadow-md transition font-semibold ${
            showTraffic
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-white text-gray-800 hover:bg-gray-100"
          }`}
        >
          {showTraffic ? "🚦 Hide Traffic" : "🚦 Show Traffic"}
        </button>

        {/* Toggle Interaction Button */}
        <button
          onClick={() => setInteractive(!interactive)}
          className={`px-4 py-2 rounded-lg shadow-md transition font-medium ${
            interactive 
              ? "bg-gray-800 text-white" 
              : "bg-white text-gray-800 hover:bg-gray-100"
          }`}
        >
          {interactive ? "Disable Zoom/Pan" : "Enable Zoom/Pan"}
        </button>
      </div>

      <MapContainer
        center={[28.6139, 77.209]}
        zoom={11}
        className="h-full w-full rounded-3xl"
        scrollWheelZoom={false}
      >
        <MapInteractionController enabled={interactive} />

        {/* Base Map Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 🚦 TRAFFIC LAYER (TomTom) */}
        {showTraffic && (
          <Pane name="trafficPane" style={{ zIndex: 650 }}>
            <TileLayer
              url={`https://{s}.api.tomtom.com/traffic/map/4/tile/flow/relative0/{z}/{x}/{y}.png?key=${TOMTOM_API_KEY}`}
              attribution='&copy; <a href="https://developer.tomtom.com/">TomTom</a>'
            />
          </Pane>
        )}

        {/* Wards Layer (GeoJSON) */}
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