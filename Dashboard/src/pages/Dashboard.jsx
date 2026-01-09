import Navbar from "../components/layout/Navbar";
import PollutionMap from "../components/maps/PollutionMap";
import WardGrid from "../components/cards/WardGrid";
import AQITrendChart from "../components/charts/AQITrendChart";
import { useAQIData } from "../hooks/useAQIData";
import WardTable from "../components/Tables/WardTable";

export default function Dashboard() {
  const { wardsGeoJSON, wardAQIMap, loading } = useAQIData();

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
          <WardGrid />
        </section>

        <section className="bg-gray-600 py-12">
          <AQITrendChart />
        </section>
              <section className="bg-[#161b20]">
        <WardTable />
      </section>
      </main>
    </>
  );
}
