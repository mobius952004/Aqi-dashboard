export function calculateTrend(values, window = 60) {
  if (values.length < window * 2) return 0

  const recent = values.slice(-window)
  const previous = values.slice(-window * 2, -window)

  const avg = arr =>
    arr.reduce((a, b) => a + b, 0) / arr.length

  return +(avg(recent) - avg(previous)).toFixed(1)
}

export function calculatePercentTrend(history, window = 10) {
  if (history.length < window * 2) return null

  const avg = arr =>
    arr.reduce((a, b) => a + b.value, 0) / arr.length

  const recent = history.slice(-window)
  const previous = history.slice(-window * 2, -window)

  const prevAvg = avg(previous)
  const currAvg = avg(recent)

  if (prevAvg === 0) return null

  return +(((currAvg - prevAvg) / prevAvg) * 100).toFixed(1)
}
