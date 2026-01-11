import Dashboard from "./pages/Dashboard"
import bgimage from "./assets/Background.png"




function App() {
 

  return (
    <>
         <div
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url(${bgimage})` }}
    >

      <div className="min-h-screen bg-black/40">
        <Dashboard />
      </div>
    </div>
     </>
  )
}

export default App
