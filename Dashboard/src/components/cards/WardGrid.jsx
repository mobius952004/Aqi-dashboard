import { useState } from "react"
import WardCard from "./WardCard"
import Pagination from "../pagination/Pagination"


const PAGE_SIZE = 6

export default function WardGrid() {
  const [page, setPage] = useState(1)

  // TEMP data (replace with API)
  const wards = Array.from({ length: 25 }, (_, i) => ({
    name: `Ward ${i + 1}`,
    // aqi: Math.floor(Math.random() * 300)
  }))

  const start = (page - 1) * PAGE_SIZE
  const current = wards.slice(start, start + PAGE_SIZE)

  return (
    <>
      <h2 className="text-2xl font-semibold mb-6">
        Ward-wise AQI Status
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {current.map((ward, i) => (
          <WardCard key={i} ward={ward} />
        ))}
      </div>

      <Pagination
        page={page}
        total={Math.ceil(wards.length / PAGE_SIZE)}
        onChange={setPage}
      />
    </>
  )
}
