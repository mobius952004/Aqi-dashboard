

export default function Sparkline({ data, trend }) {
  const max = Math.max(...data)
  const min = Math.min(...data)

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100
    const y = 100 - ((v - min) / (max - min || 1)) * 100
    return `${x},${y}`
  }).join(" ")

  const color =
    trend > 0 ? "#ef4444" :
    trend < 0 ? "#22c55e" :
    "#9ca3af"

  return (
    <svg viewBox="0 0 120 40" className="w-full h-10">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={points}
      />
    </svg>
  )
}
