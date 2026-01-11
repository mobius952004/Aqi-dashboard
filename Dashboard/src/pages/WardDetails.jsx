// import { getMitigationActions } from "../services/mitigationEngine"



// export default function WardDetails({ wardName, history }) {



//     const actions = getMitigationActions(sources, latestPollutants)
//     return (
//         <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">

//             {/* Header */}
//             <section>
//                 <h1 className="text-2xl font-bold mb-2">{wardName}</h1>
//                 <p className="text-gray-500">
//                     Detailed air quality analysis and recommendations
//                 </p>
//             </section>

//             {/* AQI Trends */}
//             <section>
//                 <h2 className="text-lg font-semibold mb-3">AQI Trends</h2>
//                 {/* Line chart / sparkline expanded */}
//             </section>

//             {/* Pollutant Trends */}
//             <section>
//                 <h2 className="text-lg font-semibold mb-3">Pollutant Trends</h2>
//                 {/* PM2.5, PM10, NO2 charts */}
//             </section>

//             {/* Source Attribution */}
//             <section>
//                 <h2 className="text-lg font-semibold mb-3">
//                     Identified Pollution Sources
//                 </h2>
//                 {/* Source cards */}
//             </section>

//             {/* Traffic & Temporal Analysis */}
//             <section>
//                 <h2 className="text-lg font-semibold mb-3">
//                     Traffic & Time-of-Day Impact
//                 </h2>
//                 {/* Peak hours, congestion frequency */}
//             </section>

//             {/* Mitigation */}
//             <section>
//                 <h2 className="text-lg font-semibold mb-3">
//                     Recommended Mitigation Actions
//                 </h2>
//                 <ul className="list-disc list-inside text-sm">
//                     {actions.immediate.map((a, i) => (
//                         <li key={i}>{a}</li>
//                     ))}
//                 </ul>
//             </section>

//         </div>
//     )
// }

import { useLocation, useParams, useNavigate } from "react-router-dom"
import { getMitigationActions } from "../services/mitigationEngine"

export default function WardDetails() {
    const { wardName } = useParams()
    const location = useLocation()
    const navigate = useNavigate()

    // 🔴 IMPORTANT: state may be undefined on refresh
    const state = location.state

    if (!state) {
        return (
            <div className="p-8 text-center">
                <p className="text-gray-600 mb-4">
                    Data not available. Please navigate from dashboard.
                </p>
                <button
                    onClick={() => navigate("/Aqi-dashboard")}
                    className="px-4 py-2 bg-gray-900 text-white rounded"
                >
                    Go back
                </button>
            </div>
        )
    }

    const {
        history,
        // latestPollutants,
        sources
    } = state

    const actions = getMitigationActions(sources)

    return (
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">

            {/* Header */}
            <section>
                <h1 className="text-2xl font-bold mb-2">
                    {wardName}
                </h1>
                <p className="text-gray-500">
                    Detailed air quality analysis and recommendations
                </p>
            </section>

            {/* AQI Trends */}
            <section>
                <h2 className="text-lg font-semibold mb-3">AQI Trends</h2>
                {/* Line chart / sparkline expanded */}


            </section>

            {/* Pollutant Trends */}
            <section>
                <h2 className="text-lg font-semibold mb-3">Pollutant Trends</h2>
                {/* PM2.5, PM10, NO2 charts */}
            </section>

            {/* Sources */}
            <section>
                <h2 className="text-lg font-semibold mb-3">
                    Identified Pollution Sources
                </h2>

                <ul className="list-disc list-inside text-sm">
                    {sources.map((src, i) => (
                        <li key={i}>{src}</li>
                    ))}
                </ul>
            </section>

            {/* Traffic & Temporal Analysis */}
            <section>
                <h2 className="text-lg font-semibold mb-3">
                    Traffic & Time-of-Day Impact
                </h2>
                {/* Peak hours, congestion frequency */}
            </section>

            {/* Mitigation */}
            <section>
                <h2 className="text-lg font-semibold mb-3">
                    Recommended Mitigation Actions
                </h2>

                <h3 className="font-medium mt-2">Immediate</h3>
                <ul className="list-disc list-inside text-sm">
                    {actions.immediate.map((a, i) => (
                        <li key={i}>{a}</li>
                    ))}
                </ul>

                <h3 className="font-medium mt-4">Policy Level</h3>
                <ul className="list-disc list-inside text-sm">
                    {actions.policy.map((a, i) => (
                        <li key={i}>{a}</li>
                    ))}
                </ul>
            </section>
        </div>
    )
}
