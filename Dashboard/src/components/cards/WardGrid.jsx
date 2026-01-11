

import { useState } from "react"
import WardCard from "./WardCard"
import Pagination from "../pagination/Pagination"
import useWardHistory from "../../hooks/useWardHistory"
import { fetchLiveWardAQI } from "../../services/Api"

const PAGE_SIZE = 6

export default function WardGrid({ wards }) {
  const [page, setPage] = useState(1)

  // 🔥 NEW: rolling time-series for all wards
  const historyByWard = useWardHistory(fetchLiveWardAQI)

  const totalPages = Math.ceil(wards?.length / PAGE_SIZE)
  const start = (page - 1) * PAGE_SIZE
  const current = wards?.slice(start, start + PAGE_SIZE)

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">
        Ward-wise AQI Status
      </h2>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {current?.map((ward) => {
          const history = historyByWard[ward.ward_name]

          // ⛔ history not ready yet (first 1–2 polls)
          if (!history) return null

          return (
            <WardCard
              key={ward.ward_name}
              wardName={ward.ward_name}
              history={history}
            />
          )
        })}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <Pagination
          page={page}
          total={totalPages}
          onChange={setPage}
        />
      </div>
    </div>
  )
}
