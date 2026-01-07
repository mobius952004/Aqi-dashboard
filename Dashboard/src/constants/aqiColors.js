export function getAQIColor(aqi) {
    if (aqi > 300) return "#7e0023";
    if (aqi > 200) return "#8f3f97";
    if (aqi > 150) return "#ff0000";
    if (aqi > 100) return "#ff7e00";
    if (aqi > 50)  return "#ffff00";
    return "#00e400";
  }
  