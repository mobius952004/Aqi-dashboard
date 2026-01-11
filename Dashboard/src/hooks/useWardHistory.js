import { useEffect, useRef, useState } from "react"

const MAX_POINTS = 60          // last 60 minutes
const POLL_INTERVAL = 60_000  // 1 minute

export default function useWardHistory(fetchLiveWardAQI) {
  const [historyByWard, setHistoryByWard] = useState({})
  const timerRef = useRef(null)

  useEffect(() => {
    async function poll() {
      const wards = await fetchLiveWardAQI()
      if (!Array.isArray(wards)) return

      setHistoryByWard(prev => {
        const next = { ...prev }

        wards.forEach(ward => {
          const wardKey = ward.ward_name
          const time = new Date(ward.computed_at).getTime()

          if (!next[wardKey]) {
            next[wardKey] = { aqi: [], pollutants: {} }
          }

          /* ---- AQI ---- */
          next[wardKey].aqi = [
            ...(next[wardKey].aqi || []),
            { value: ward.aqi, time }
          ].slice(-MAX_POINTS)

          /* ---- Pollutants ---- */
          Object.entries(ward.pollutants).forEach(([key, value]) => {
            const prevArr = next[wardKey].pollutants[key] || []
            next[wardKey].pollutants[key] = [
              ...prevArr,
              { value, time }
            ].slice(-MAX_POINTS)
          })
        })

        return next
      })
    }

    poll()
    timerRef.current = setInterval(poll, POLL_INTERVAL)

    return () => clearInterval(timerRef.current)
  }, [fetchLiveWardAQI])

  return historyByWard
}
