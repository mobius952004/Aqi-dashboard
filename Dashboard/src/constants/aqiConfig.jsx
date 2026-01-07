export const AQI_LEVELS = [
  {
    label: "Good",
    min: 0,
    max: 50,
    bg: "bg-green-100",
    text: "text-green-800",
  },
  {
    label: "Satisfactory",
    min: 51,
    max: 100,
    bg: "bg-lime-100",
    text: "text-lime-800",
  },
  {
    label: "Moderate",
    min: 101,
    max: 200,
    bg: "bg-yellow-100",
    text: "text-yellow-800",
  },
  {
    label: "Poor",
    min: 201,
    max: 300,
    bg: "bg-orange-100",
    text: "text-orange-800",
  },
  {
    label: "Very Poor",
    min: 301,
    max: 400,
    bg: "bg-red-100",
    text: "text-red-800",
  },
  {
    label: "Severe",
    min: 401,
    max: 500,
    bg: "bg-purple-100",
    text: "text-purple-800",
  },
]

export function getAQIStyle(aqi) {
  return AQI_LEVELS.find(
    level => aqi >= level.min && aqi <= level.max
  ) || AQI_LEVELS[AQI_LEVELS.length - 1]
}
