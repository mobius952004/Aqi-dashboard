export function deriveSources(pollutants) {
  const {
    pm25 = 0,
    pm10 = 0,
    no2 = 0,
    so2 = 0,
    co = 0,
    o3 = 0
  } = pollutants

  const sources = []

  // Vehicular emissions
  if (pm25 > 60 && no2 > 25) {
    sources.push("Vehicular emissions")
  }

  // Road dust
  if (pm10 > 120 && pm10 / (pm25 || 1) > 1.5) {
    sources.push("Road dust")
  }

  // Construction activity
  if (pm10 > 140 && pm25 < pm10) {
    sources.push("Construction activity")
  }

  // Industrial emissions
  if (so2 > 10) {
    sources.push("Industrial emissions")
  }

  // Biomass / waste burning
  if (co > 4 && pm25 > 80) {
    sources.push("Biomass / waste burning")
  }

  // Secondary pollution
  if (o3 > 30) {
    sources.push("Secondary photochemical pollution")
  }

  return [...new Set(sources)].slice(0, 3)
}
