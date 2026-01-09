export default function Navbar({lastUpdated}) {
  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-gray-900 text-white z-9999 shadow scroll_offset">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
        
        {/* Title */}
        <h1 className="text-lg font-semibold">
          AI-Based Ward-wise Pollution Dashboard
        </h1>

        {/* Navigation Buttons */}
        <div className="hidden md:flex gap-6 text-sm">
          <a href="#map" className="hover:text-blue-400">
            Map
          </a>
          <a href="#wards" className="hover:text-blue-400">
            Wards
          </a>
          <a href="#table" className="hover:text-blue-400">
            Table
          </a>
          <a href="#charts" className="hover:text-blue-400">
            Graphs
          </a>
          <p className="text-xs text-gray-400">
             Last updated:{" "}
            {lastUpdated?.toLocaleTimeString()}
</p>
        </div>
      </div>
    </nav>
  )
}
