export function getAQIColor(aqi) {
  if (aqi > 400) return "#7F1D1D";   // Hazardous – dark maroon
  if (aqi > 300) return "#EF4444";   // Severe – purple/magenta
  if (aqi > 200) return "#FB923C";   // Unhealthy – deep red-orange
  if (aqi > 100) return "#FACC15";   // Poor – amber/orange
  if (aqi > 50)  return "#A3E635";   // Moderate – olive yellow
  return "#2ECC71";                  // Good – muted green
}
  