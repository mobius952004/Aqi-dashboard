import Dashboard from "./pages/Dashboard"
import bgimage from "./assets/Background.png"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import WardDetails from "./pages/WardDetails"
import { WardHistoryContext } from "./context/WardHistoryContext"
import useWardHistory from "./hooks/useWardHistory"
import { fetchLiveWardAQI } from "./services/Api"





function App() {
const historyByWard = useWardHistory(fetchLiveWardAQI)


  return (
    <>
    <WardHistoryContext.Provider value={historyByWard}>

      <BrowserRouter>
       

          <div
            className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
            style={{ backgroundImage: `url(${bgimage})` }}
          >

            <div className="min-h-screen bg-black/40">
            <Routes>

              <Route path="/Aqi-dashboard" element={<Dashboard />} />
              <Route path="/Aqi-dashboard/ward/:wardName" element={<WardDetails />} />
            </Routes>
            </div>
          </div>


       
      </BrowserRouter>
    </WardHistoryContext.Provider>
    </>
  )
}

export default App
