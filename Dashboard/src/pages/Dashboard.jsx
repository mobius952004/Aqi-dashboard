import Navbar from "../components/layout/Navbar";
import PollutionMap from "../components/maps/PollutionMap";
import WardGrid from "../components/cards/WardGrid";
import AQITrendChart from "../components/charts/AQITrendChart";
import { useAQIData } from "../hooks/useAQIData";
import WardTable from "../components/Tables/WardTable";
import { useState } from "react";
import { useEffect } from "react";

export default function Dashboard() {
  const { wardsGeoJSON, wardAQIMap, loading } = useAQIData();
  const [wards,setwards]=useState([])

  useEffect(() => {
    fetch("http://localhost:5000/api/wards")
      .then(res => res.json())
      .then(data => setwards(data))
  }, [])

  return (
    <>
      <Navbar />

      <main className="pt-16">
        <section className="h-[80vh] mx-50 my-30 border-black border-4 rounded-4xl">
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
        </section>

        <section className="max-w-7xl mx-auto px-6 py-12">
          <WardGrid wards={wards} />
        </section>

        <section className="bg-gray-600 py-12">
          <AQITrendChart wards={wards} />
        </section>
              <section className="bg-[#161b20]">
        <WardTable wards={wards} />
      </section>
      </main>
    </>
  );
}
