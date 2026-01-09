import { useState } from "react"
import WardCard from "./WardCard"
import Pagination from "../pagination/Pagination"
import wardData from "../../data/ward_aqi.json"
// import { useEffect } from "react"
const PAGE_SIZE = 9

export default function WardGrid() {
  const [page, setPage] = useState(1)

  // useEffect(() => window.scrollTo(0, 0), [page])


  const totalPages = Math.ceil(wardData.length / PAGE_SIZE)

  const start = (page - 1) * PAGE_SIZE
  const current = wardData.slice(start, start + PAGE_SIZE)

  return (
    <>
      <h2 className="text-2xl font-semibold mb-6">
        Ward-wise AQI Status
      </h2>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {current.map((ward, i) => (
          <WardCard key={i} ward={ward} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <Pagination
          page={page}
          total={totalPages}
          onChange={setPage}
        />
      </div>
    </>
  )
}
