import Navbar from "../components/layout/Navbar";
import PollutionMap from "../components/maps/PollutionMap";
import WardGrid from "../components/cards/WardGrid";
import AQITrendChart from "../components/charts/AQITrendChart";
import { useAQIData } from "../hooks/useAQIData";

export default function Dashboard() {
  const { wardsGeoJSON, wardAQIMap, loading } = useAQIData();

  return (
    <>
      <Navbar />

      <main className="pt-16">
        <section className="h-[80vh]">
          {loading ? (
            <div className="h-full flex items-center justify-center">
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
      </main>
    </>
  );
}
