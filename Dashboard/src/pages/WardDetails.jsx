

import { useParams, useNavigate } from "react-router-dom"
import { useWardHistoryContext } from "../context/WardHistoryContext"
import { deriveSources } from "../services/sourceDerivation"
import { getMitigationActions } from "../services/mitigationEngine"
import { calculatePercentTrend } from "../services/Trend"
import { getAQIStyle } from "../constants/aqiConfig"

export default function WardDetails() {
  // ✅ hooks first (rules-of-hooks compliant)
  const { wardName } = useParams()
  const navigate = useNavigate()
  const historyByWard = useWardHistoryContext()

  // history may not be ready yet
  const history = historyByWard?.[wardName]

  /* ------------------ LOADING SKELETON ------------------ */
  if (!history) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-6 animate-pulse">
        <div className="h-8 w-1/3 bg-gray-300 rounded" />
        <div className="h-24 w-40 bg-gray-300 rounded" />

        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-300 rounded" />
          ))}
        </div>

        <div className="h-6 w-1/2 bg-gray-300 rounded" />
        <div className="h-24 bg-gray-300 rounded" />
      </div>
    )
  }

  /* ------------------ DERIVED DATA ------------------ */

  const aqiArr = history.aqi
  const latestAQI = aqiArr.at(-1)?.value
  const aqiPctTrend = calculatePercentTrend(aqiArr, 10)
  const aqiStyle = getAQIStyle(latestAQI)

  const latestPollutants = Object.fromEntries(
    Object.entries(history.pollutants).map(([k, arr]) => [
      k,
      arr.at(-1)?.value
    ])
  )

  // ✅ derive sources HERE (not passed)
  const sources = deriveSources(latestPollutants)

  // ✅ mitigation derived from sources
  const actions = getMitigationActions(sources)

  /* ------------------ UI ------------------ */

  return (
    <div className=" bg-white/80 max-w-6xl mx-auto px-6 py-8 space-y-10">

      {/* HEADER */}
      <section>
        <button
          onClick={() => navigate("/Aqi-dashboard")}
          className="text-sm text-gray-500 mb-2"
        >
          ← Back to dashboard
        </button>

        <h1 className="text-2xl font-bold mb-2">{wardName}</h1>

        <div className="flex items-center gap-6">
          <div className={`px-5 py-3 rounded-lg ${aqiStyle.bg}`}>
            <div className="text-3xl font-bold text-white">
              {latestAQI}
            </div>
            <div className="text-sm text-white">
              {aqiStyle.label}
            </div>
          </div>

          <div className="text-sm">
            <p className="text-gray-500">AQI trend (last 20 min)</p>
            {aqiPctTrend !== null ? (
              <p
                className={
                  aqiPctTrend > 0
                    ? "text-red-500"
                    : aqiPctTrend < 0
                    ? "text-green-500"
                    : "text-gray-400"
                }
              >
                {aqiPctTrend > 0 ? "↑" : aqiPctTrend < 0 ? "↓" : "→"}{" "}
                {Math.abs(aqiPctTrend)}%
              </p>
            ) : (
              <p className="text-gray-400">Collecting data…</p>
            )}
          </div>
        </div>
      </section>

      {/* CURRENT POLLUTANTS */}
      <section>
        <h2 className="text-lg font-semibold mb-3">
          Current Pollutant Levels
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          {Object.entries(latestPollutants).map(([key, value]) => (
            <div key={key} className="bg-white rounded shadow p-3">
              <p className="text-gray-500 uppercase text-xs mb-1">{key}</p>
              <p className="font-semibold">
                {value} <span className="text-xs text-gray-400">µg/m³</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* POLLUTANT TRENDS */}
      <section>
        <h2 className="text-lg font-semibold mb-3">
          Pollutant Trends (last 2 hours)
        </h2>

        <div className="space-y-2 text-sm">
          {Object.entries(history.pollutants).map(([key, arr]) => {
            const pct = calculatePercentTrend(arr, 60)

            return (
              <div key={key} className="flex justify-between">
                <span className="uppercase text-gray-500">{key}</span>
                {pct !== null ? (
                  <span
                    className={
                      pct > 0
                        ? "text-red-500"
                        : pct < 0
                        ? "text-green-500"
                        : "text-gray-400"
                    }
                  >
                    {pct > 0 ? "↑" : pct < 0 ? "↓" : "→"}{" "}
                    {Math.abs(pct)}%
                  </span>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* SOURCES */}
      <section>
        <h2 className="text-lg font-semibold mb-3">
          Identified Pollution Sources
        </h2>
        <ul className="list-disc list-inside text-sm">
          {sources.map((src, i) => (
            <li key={i}>{src}</li>
          ))}
        </ul>
      </section>

      {/* MITIGATION */}
      <section>
        <h2 className="text-lg font-semibold mb-3">
          Recommended Mitigation Actions
        </h2>

        <h3 className="font-medium">Immediate</h3>
        <ul className="list-disc list-inside text-sm">
          {actions.immediate.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>

        <h3 className="font-medium mt-4">Policy Level</h3>
        <ul className="list-disc list-inside text-sm">
          {actions.policy.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
