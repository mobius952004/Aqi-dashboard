// import { getAQIStyle } from "../../constants/aqiConfig"


// export default function WardTableRow({ward}) {
//   const aqiStyle = getAQIStyle(ward.aqi)

//   return (
//     <tr className="border-b border-gray-700 hover:bg-[#2a3138] transition">
      
//       <td className="px-6 py-4 font-medium text-white">
//         {ward.ward_name}
//       </td>

//       <td className="px-6 py-4">
//         <span
//           className={`px-3 py-1 rounded-full text-xs font-semibold ${aqiStyle.bg} ${aqiStyle.text}`}
//         >
//           {aqiStyle.label}
//         </span>
//       </td>

//       <td className="px-6 py-4 font-semibold text-white">
//         {ward.aqi}
//       </td>

//       <td className="px-6 py-4">
//         {ward.components?.pm25 ?? "-"}
//       </td>

//       <td className="px-6 py-4">
//         {ward.components?.pm10 ?? "-"}
//       </td>

//       <td className="px-6 py-4">
//         {ward.temperature ?? "-"}
//       </td>

//       <td className="px-6 py-4">
//         {ward.humidity ?? "-"}
//       </td>
//     </tr>
//   )
// }
import { getAQIStyle } from "../../constants/aqiConfig"

export default function WardTableRow({ ward }) {
  const aqiStyle = getAQIStyle(Math.round(ward.aqi))

  return (
    <tr className="border-b border-gray-700 hover:bg-[#2a3138] transition">
      <td className="px-6 py-4 text-white">
        {ward.ward_name}
      </td>

      <td className="px-6 py-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${aqiStyle.bg} ${aqiStyle.text}`}
        >
          {aqiStyle.label}
        </span>
      </td>

      <td className="px-6 py-4 font-semibold">
        {Math.round(ward.aqi)}
      </td>

      <td className="px-6 py-4">
        {ward.pollutants?.pm25 ?? "-"}
      </td>

      <td className="px-6 py-4">
        {ward.pollutants?.pm10 ?? "-"}
      </td>

      <td className="px-6 py-4">
        {ward.pollutants?.co ?? "-"}
      </td>

      <td className="px-6 py-4">
        {ward.pollutants?.no2 ?? "-"}
      </td>
      <td className="px-6 py-4">
        {ward.pollutants?.so2 ?? "-"}
      </td>
      <td className="px-6 py-4">
        {ward.pollutants?.o3 ?? "-"}
      </td>
    </tr>
  )
}
