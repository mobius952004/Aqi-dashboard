
import Sparkline from "./Sparkline"
import { calculateTrend, calculatePercentTrend } from "../../services/Trend"
import { getAQIStyle } from "../../constants/aqiConfig"
import { deriveSources } from "../../services/sourceDerivation"
// import WardDetails from "../../pages/WardDetails"
import { useNavigate } from "react-router-dom"

export default function WardCard({ wardName, history }) {
  const navigate=useNavigate()
  const aqiArr = history.aqi
  const latestAQI = aqiArr.at(-1)?.value
  const aqiTrend = calculateTrend(aqiArr, 10)
  const aqiStyle = getAQIStyle(latestAQI)
  const aqiPctTrend = calculatePercentTrend(aqiArr, 10)
  const showAQITrend = aqiPctTrend !== null


  const latestPollutants = Object.fromEntries(
  Object.entries(history.pollutants).map(([k, arr]) => [
    k,
    arr.at(-1)?.value
  ])

)


const sources = deriveSources(latestPollutants)
const handleViewDetails = () => {
    navigate(`/Aqi-dashboard/ward/${wardName}`, {
      state: {
        wardName,
        history,
        latestPollutants,
        sources
      }
    })
  }



  return (
    <div className="bg-amber-100/80 rounded-xl p-4 shadow-md">

      {/* Ward name */}
      <h3 className="text-sm font-semibold mb-3">
        {wardName}
      </h3>

      {/* AQI section */}
      <div className="flex justify-between items-center mb-4">
        <div className={`px-3 py-2 rounded-lg ${aqiStyle.bg}`}>
          <div className="text-xl font-bold text-white">
            {latestAQI ?? "—"}
          </div>
          <div className="text-xs text-white">
            {aqiStyle.label}
          </div>
        </div>

        <div className="text-right">
          <Sparkline
            data={aqiArr.map(p => p.value).slice(-24)}
            trend={aqiTrend}
          />
          <div className="text-xs font-medium">
            {showAQITrend ? (
              <span
                className={
                  aqiPctTrend > 0 ? "text-red-500" :
                    aqiPctTrend < 0 ? "text-green-500" :
                      "text-gray-400"
                }
              >
                {aqiPctTrend > 0 ? "↑" : aqiPctTrend < 0 ? "↓" : "→"}
                {" "}
                {Math.abs(aqiPctTrend)}%
              </span>
            ) : (
              <span className="text-gray-400">—</span>
            )}
          </div>
        </div>
      </div>

      {/* Pollutants (REAL-TIME + TREND) */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs mb-4">
        {Object.entries(history.pollutants).map(([key, arr]) => {
          const latest = arr.at(-1)?.value
          const trend = calculateTrend(arr, 60)
          const pctTrend = calculatePercentTrend(arr, 60)
          const showTrend = pctTrend !== null

          return (
            <div key={key} className="flex justify-between">
              <span className="uppercase text-gray-500">
                {key}
              </span>
              <span
                className={
                  trend > 0 ? "text-red-500" :
                    trend < 0 ? "text-green-500" :
                      "text-gray-700"
                }
              >
                {latest ?? "—"}{" "}
                {showTrend && (
                  <>
                    {pctTrend > 0 ? "↑" : pctTrend < 0 ? "↓" : "→"}
                    {Math.abs(pctTrend)}%
                  </>
                )}
              </span>
            </div>
          )
        })}
      </div>

      {/* CTA */}
      {sources?.length > 0 && (
        <div className="mt-3 mb-3">
          <p className="text-xs text-gray-500 mb-1">
            Key contributing sources
          </p>

          <ul className="flex flex-wrap gap-1">
            {sources.slice(0, 3).map((src, i) => (
              <li
                key={i}
                className="text-xs px-2 py-0.5 rounded-full
                     bg-gray-100 text-gray-700"
              >
                {src}
              </li>
            ))}
          </ul>
        </div>) }
      

      {/* {wardMeta && (
  <div className="flex justify-between text-xs text-gray-500 mb-3">
    <span>
      Area: {wardMeta.area_km2} km²
    </span>
    <span>
      Dominant: {wardMeta.dominant_pollutant}
    </span>
  </div>
)} */}
      <button
        onClick={handleViewDetails}
        className="w-full py-2 text-sm rounded-md
                   bg-gray-900 text-white hover:bg-gray-800"
      >
        View ward details →
      </button>


    </div>
  )
}
