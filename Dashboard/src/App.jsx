import Dashboard from "./pages/Dashboard"
import bgimage from "./assets/Background.png"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import WardDetails from "./pages/WardDetails"





function App() {


  return (
    <>
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
    </>
  )
}

export default App
