import Navbar from "../components/layout/Navbar";
import PollutionMap from "../components/maps/PollutionMap";
import WardGrid from "../components/cards/WardGrid";
import AQITrendChart from "../components/charts/AQITrendChart";
import { useAQIData } from "../hooks/useAQIData";
import WardTable from "../components/Tables/WardTable";
import { useState } from "react";
import { useEffect } from "react";
import AQILegend from "../components/layout/AqiLegendUI";

export default function Dashboard() {
  const { wardsGeoJSON, wardAQIMap, loading } = useAQIData();
const [wards, setWards] = useState([])
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    let isMounted = true

    const fetchAndUpdate = async () => {
      try {
        await fetch("http://localhost:5000/api/update")

        const res = await fetch("http://localhost:5000/api/wards")
        const data = await res.json()

        if (isMounted) {
          setWards(data)
          setLastUpdated(new Date())
        }
      } catch (err) {
        console.error(err)
      }
    }

    // Initial load
    fetchAndUpdate()

    // Polling
    const interval = setInterval(fetchAndUpdate, 60_000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  return (
    <>
      <Navbar lastUpdated={lastUpdated}/>

      <main className="pt-16">
        <section id="map" className="h-[80vh] mx-50 mt-10 border-black border-4 rounded-4xl scroll-offset">
          {loading ? (
            <div className="h-full flex rounded-4xl items-center justify-center">
              Loading pollution map…
            </div>
          ) : (
            <PollutionMap
              wardsGeoJSON={wardsGeoJSON}
              wardAQIMap={wardAQIMap}
            />
          )}
          
            <AQILegend className="bg-amber-100 m-5 p-5 scroll-offset"/>
          
        </section>

        <section id="wards" className="max-w-7xl mx-auto px-6 py-12 scroll-offset">
          <WardGrid wards={wards} />
        </section>

        <section id="charts" className="bg-gray-600 py-12">
          <AQITrendChart wards={wards} />
        </section>
        <section id="table" className="bg-blue-300">
        <WardTable wards={wards} />
      </section>
      <button onClick={() => window.scrollTo(0,0)}>↑</button>

      </main>
    </>
  );
}
