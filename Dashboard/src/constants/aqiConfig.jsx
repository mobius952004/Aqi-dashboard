export const AQI_LEVELS = [
  {
    label: "Good",
    min: 0,
    max: 50,
    bg: "bg-green-500",
    text: "text-green-900",
  },
  {
    label: "Satisfactory",
    min: 51,
    max: 100,
    bg: "bg-lime-400",
    text: "text-lime-900",
  },
  {
    label: "Moderate",
    min: 101,
    max: 200,
    bg: "bg-yellow-400",
    text: "text-yellow-900",
  },
  {
    label: "Poor",
    min: 201,
    max: 300,
    bg: "bg-orange-400",
    text: "text-orange-900",
  },
  {
    label: "Very Poor",
    min: 301,
    max: 400,
    bg: "bg-red-500",
    text: "text-red-900",
  },
  {
    label: "Severe",
    min: 401,
    max: 500,
    bg: "bg-red-900",
    text: "text-red-100",
  },
];



export function getAQIStyle(aqi) {
  return AQI_LEVELS.find(
    level => aqi >= level.min && aqi <= level.max
  ) || AQI_LEVELS[AQI_LEVELS.length - 1]
}
