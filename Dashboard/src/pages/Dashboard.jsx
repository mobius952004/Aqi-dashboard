import Navbar from "../components/layout/Navbar";
import PollutionMap from "../components/maps/PollutionMap";
import WardGrid from "../components/cards/WardGrid";
// import AQITrendChart from "../components/charts/AQITrendChart";
import { useAQIData } from "../hooks/useAQIData";
import WardTable from "../components/Tables/WardTable";
import { useState } from "react";
import { useEffect } from "react";
import AQILegend from "../components/layout/AqiLegendUI";
import { fetchLiveWardAQI } from "../services/api";


export default function Dashboard() {
  const [wards, setWards] = useState([])
  const [lastUpdated, setLastUpdated] = useState(null)
  const { wardsGeoJSON, wardAQIMap, loading: geoLoading } = useAQIData(wards);

  const dataReady =
    !geoLoading &&
    wards.length > 0 &&
    Object.keys(wardAQIMap).length > 0;

  useEffect(() => {
  let isMounted = true

  const fetchData = async () => {
    try {
      const data = await fetchLiveWardAQI()
      if (isMounted) {
        setWards(data)
        setLastUpdated(new Date())
      }
    } catch (err) {
      console.error(err)
    }
  }

  // initial load
  fetchData()

  // polling
  const interval = setInterval(fetchData, 60_000)

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
        {!dataReady ? (
  <div className="h-full flex items-center justify-center">
    Loading pollution map…
  </div>
) : (
  <PollutionMap
    key={lastUpdated}
    wardsGeoJSON={wardsGeoJSON}
    wardAQIMap={wardAQIMap}
  />
)}
          
            <AQILegend className=" m-5 p-5 scroll-offset"/>
          
        </section>

        <section id="wards" className="max-w-7xl mx-auto px-6 py-12 scroll-offset">
          <WardGrid wards={wards} />
        </section>

        {/* <section id="charts" className=" py-12">
          <AQITrendChart wards={wards} />
        </section> */}
        <section id="table" className="">
        <WardTable wards={wards} />
      </section>
      <button onClick={() => window.scrollTo(0,0)}>↑</button>

      </main>
    </>
  );
}
