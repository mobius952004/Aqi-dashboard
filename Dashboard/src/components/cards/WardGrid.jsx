
import { useState } from "react"
import WardCard from "./WardCard"
import Pagination from "../pagination/Pagination"
import { useWardHistoryContext } from "../../context/WardHistoryContext"

const PAGE_SIZE = 6

export default function WardGrid({ wards }) {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")

  const { historyByWard } = useWardHistoryContext()

  const filteredWards = wards?.filter((ward) =>
    ward.ward_name.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filteredWards?.length / PAGE_SIZE)
  const start = (page - 1) * PAGE_SIZE
  const current = filteredWards?.slice(start, start + PAGE_SIZE)

  return (
    <div>
      {/* Header + Search */}
      <div className="flex justify-between items-center m-6 mb-4">
        <h2 className="text-2xl text- font-semibold">
          Ward-wise AQI Status
        </h2>

        <input
          type="text"
          placeholder="Search ward..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="px-3 py-1 rounded bg-amber-100 text-black text-sm focus:outline-none"
        />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {current?.map((ward) => {
          const history = historyByWard[ward.ward_name]
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

