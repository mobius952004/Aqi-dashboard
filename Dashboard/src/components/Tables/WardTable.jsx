// import WardTableRow from "./WardTableRow"
import wardData from "../../data/ward_aqi.json"

// export default function WardTable() {
//   return (
//     <div className="max-w-7xl mx-auto px-6 py-12">
//       <h2 className="text-2xl font-semibold mb-6 text-white">
//         Ward-wise AQI Data (Detailed)
//       </h2>

//       <div className="overflow-x-auto  rounded-xl bg-[#1f252b] shadow-lg">
//         <table className="min-w-full text-sm text-left text-gray-300">
          
//           {/* Table Head */}
//           <thead className="text-xs uppercase text-gray-400 border-b border-gray-700">
//             <tr>
//               <th className="px-6 py-4">Location</th>
//               <th className="px-6 py-4">Status</th>
//               <th className="px-6 py-4">AQI (IN)</th>
//               <th className="px-6 py-4">PM2.5 (µg/m³)</th>
//               <th className="px-6 py-4">PM10 (µg/m³)</th>
//               <th className="px-6 py-4">Temp (°C)</th>
//               <th className="px-6 py-4">Humi (%)</th>
//             </tr>
//           </thead>

//           {/* Table Body */}
//           <tbody>
//             {wardData.map((ward, index) => (
//               <WardTableRow key={index} ward={ward} />
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }
import { useMemo, useState } from "react"
import WardTableRow from "./WardTableRow"

const SORT_FIELDS = [
  { key: "aqi", label: "AQI" },
  { key: "pm25", label: "PM2.5" },
  { key: "pm10", label: "PM10" },
  { key: "temperature", label: "Temp" },
  { key: "humidity", label: "Humidity" }
]

export default function WardTable() {
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState("aqi")
  const [sortOrder, setSortOrder] = useState("desc")

  // 🔍 Filter + Sort (derived data)
  const processedWards = useMemo(() => {
    let data = [...wardData]

    // Search by ward name
    if (search) {
      data = data.filter(w =>
        w.ward_name.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Sorting
    data.sort((a, b) => {
      const aVal =
        sortKey === "pm25" || sortKey === "pm10"
          ? a.components?.[sortKey] ?? 0
          : a[sortKey] ?? 0

      const bVal =
        sortKey === "pm25" || sortKey === "pm10"
          ? b.components?.[sortKey] ?? 0
          : b[sortKey] ?? 0

      return sortOrder === "asc" ? aVal - bVal : bVal - aVal
    })

    return data
  }, [wardData, search, sortKey, sortOrder])

  const toggleSort = key => {
    if (sortKey === key) {
      setSortOrder(prev => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortOrder("desc")
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-2xl font-semibold mb-4 text-white">
        Ward-wise AQI Data (Detailed)
      </h2>

      {/* 🔍 Search + Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search ward name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-4 py-2 rounded bg-[#1f252b] text-gray-200 border border-gray-700 focus:outline-none focus:ring"
        />

        <select
          value={sortKey}
          onChange={e => setSortKey(e.target.value)}
          className="px-4 py-2 rounded bg-[#1f252b] text-gray-200 border border-gray-700"
        >
          {SORT_FIELDS.map(f => (
            <option key={f.key} value={f.key}>
              Sort by {f.label}
            </option>
          ))}
        </select>

        <button
          onClick={() =>
            setSortOrder(prev => (prev === "asc" ? "desc" : "asc"))
          }
          className="px-4 py-2 rounded bg-gray-700 text-white"
        >
          {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
        </button>
      </div>

      {/* 📜 Scrollable Table */}
      <div className="rounded-xl bg-[#1f252b] shadow-lg overflow-hidden">
        <div className="max-h-105 overflow-y-auto">
          <table className="min-w-full text-sm text-left text-gray-300">
            <thead className="sticky top-0 bg-[#1f252b] text-xs uppercase text-gray-400 border-b border-gray-700 z-10">
              <tr>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Status</th>
                <th
                  className="px-6 py-4 cursor-pointer"
                  onClick={() => toggleSort("aqi")}
                >
                  AQI
                </th>
                <th
                  className="px-6 py-4 cursor-pointer"
                  onClick={() => toggleSort("pm25")}
                >
                  PM2.5
                </th>
                <th
                  className="px-6 py-4 cursor-pointer"
                  onClick={() => toggleSort("pm10")}
                >
                  PM10
                </th>
                <th
                  className="px-6 py-4 cursor-pointer"
                  onClick={() => toggleSort("temperature")}
                >
                  Temp
                </th>
                <th
                  className="px-6 py-4 cursor-pointer"
                  onClick={() => toggleSort("humidity")}
                >
                  Humi
                </th>
              </tr>
            </thead>

            <tbody>
              {processedWards.map((ward, index) => (
                <WardTableRow key={index} ward={ward} />
              ))}

              {!processedWards.length && (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-6 text-gray-400"
                  >
                    No wards found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

