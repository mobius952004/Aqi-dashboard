import { getAQIStyle } from "../../constants/aqiConfig"

export default function WardCard({ ward }) {
  const {
    ward_name,
    aqi,
    pollutants = {}, // pm25, pm10, no2, o3 etc
  } = ward

  const aqiStyle = getAQIStyle(aqi)

  return (
    <div
      className={`
        ${aqiStyle.bg}
        rounded-xl shadow-md p-6
        transition-transform hover:scale-[1.02]
      `}
    >
      {/* Ward Name */}
      <h1 className="text-xl font-bold mb-2">
        {ward_name}
      </h1>

      {/* AQI Value */}
      <div className="flex items-center gap-4 mb-4">
        <div className={`text-4xl font-extrabold ${aqiStyle.text}`}>
          {aqi}
        </div>cd.

        <div>
          <p className={`text-sm font-semibold ${aqiStyle.text}`}>
            {aqiStyle.label}
          </p>
          <p className="text-xs text-gray-600">
            Air Quality Index
          </p>
        </div>
      </div>

      {/* Pollutant Components */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        {Object.entries(pollutants).map(([key, value]) => (
          <div
            key={key}
            className="bg-white/60 rounded-md px-3 py-2"
          >
            <p className="text-gray-500 uppercase text-xs">
              {key}
            </p>
            <p className="font-semibold">
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
