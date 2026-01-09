export function getAQIColor(aqi) {
  if (aqi > 300) return "#8B1E2D";   // Hazardous – dark maroon
  if (aqi > 200) return "#9B3FA8";   // Severe – purple/magenta
  if (aqi > 150) return "#C0392B";   // Unhealthy – deep red-orange
  if (aqi > 100) return "#E67E22";   // Poor – amber/orange
  if (aqi > 50)  return "#B5B51E";   // Moderate – olive yellow
  return "#2ECC71";                  // Good – muted green
}
  